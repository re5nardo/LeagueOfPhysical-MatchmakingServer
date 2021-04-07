'use strict';
const express = require('express');
const router = express.Router();
const util = require("util");
const request = require('request-promise-native');
const uuid = require('uuid');

const MatchmakingTicket = require('../models/matchmaking_ticket');
const UserMatchState = require('../models/user_match_state');

const CreateMatchmakingTicketResponse = require('../models/response/create_matchmaking_ticket_response');
const CancelMatchmakingTicketResponse = require('../models/response/cancel_matchmaking_ticket_response');

const WaitingRoom = require('../models/waiting_room');
const ResponseCode = require('../response_code');

const gameRoomKeyFormat = `gameRoom:%s`;
const waitingRoomKeyFormat = `waitingRoom:%s`;

const waitingRoomMap = new Map();

router.put('/matchmakingTicket', function (req, res) {
    onCreateMatchmakingTicket(req, res);
});

router.delete('/matchmakingTicket/:userId', function (req, res) {
    onCancelMatchmakingTicket(req, res);
});

setInterval(matchmakingUpdate, 500);

async function onCreateMatchmakingTicket(req, res) {
    const userId = req.body.userId;
    const gameType = req.body.gameType;
    const matchType = req.body.matchType;
    const rating = req.body.rating;

    //  get userMatchState
    const userMatchState = await getUserMatchState(userId);
    if (!userMatchState) {
        return res.json(new CreateMatchmakingTicketResponse(ResponseCode.INVALID_TO_MATCHMAKING, -1));
    }

    //  validation test
    if (await validateToMatchmaking(userId) !== true) {
        return res.json(new CreateMatchmakingTicketResponse(ResponseCode.INVALID_TO_MATCHMAKING, -1));
    }

    //  issue & save matchmakingTicket
    let matchmakingTicket;
    try {
        matchmakingTicket = issueMatchmakingTicket(userId, gameType, matchType, rating);
        await matchmakingTicket.save();
    } catch (error) {
        console.error(error);
        return res.json(new CreateMatchmakingTicketResponse(ResponseCode.INVALID_TO_MATCHMAKING, -1));
    }

    //  update userMatchState
    try {
        userMatchState.matchmakingTicketId = matchmakingTicket.ticketId;
        await userMatchState.save();
    } catch (error) {
        console.error(error);
        return res.json(new CreateMatchmakingTicketResponse(ResponseCode.INVALID_TO_MATCHMAKING, -1));
    }

    //  join or create waitingRoom
    if (await joinOrCreateWaitingRoom(userMatchState, matchmakingTicket) === true) {
        res.json(new CreateMatchmakingTicketResponse(ResponseCode.SUCCESS, matchmakingTicket.ticketId));
    }
    else {
        res.json(new CreateMatchmakingTicketResponse(ResponseCode.INVALID_TO_MATCHMAKING, -1));
    }
}

async function onCancelMatchmakingTicket(req, res) {
    const userId = req.params.userId;
    try {
        const userMatchState = await getUserMatchState(userId);
        if (!userMatchState) {
            return res.json(new CancelMatchmakingTicketResponse(ResponseCode.UNKNOWN_ERROR));
        }

        switch (userMatchState.state) {
            case 'inWaitingRoom':
                leaveWaitingRoom(userId, userMatchState.stateValue);
                userMatchState.state = '';
                userMatchState.stateValue = '';
                userMatchState.matchmakingTicketId = '';
                await userMatchState.save();
                return res.json(new CancelMatchmakingTicketResponse(ResponseCode.SUCCESS));
            case 'inGameRoom':
                const gameRoomKey = util.format(gameRoomKeyFormat, userMatchState.stateValue);
                if (await global.redis.existsAsync(gameRoomKey) === 1) {
                    return res.json(new CancelMatchmakingTicketResponse(ResponseCode.UNKNOWN_ERROR));
                } else {
                    userMatchState.state = '';
                    userMatchState.stateValue = '';
                    userMatchState.matchmakingTicketId = '';
                    await userMatchState.save();
                    return res.json(new CancelMatchmakingTicketResponse(ResponseCode.SUCCESS));
                }
            default:
                return res.json(new CancelMatchmakingTicketResponse(ResponseCode.SUCCESS));
        }
    } catch (error) {
        console.error(error);
        return res.json(new CancelMatchmakingTicketResponse(ResponseCode.UNKNOWN_ERROR));
    }

    res.json(new CancelMatchmakingTicketResponse(ResponseCode.UNKNOWN_ERROR));
}

async function getUserMatchState(userId) {
    try {
        const filter = {
            userId: userId
        };

        const update = {
            userId: userId,
        };

        const userMatchState = await UserMatchState.findOneAndUpdate(filter, update, {
            new: true,
            upsert: true,
        });

        switch (userMatchState.state) {
            case 'inWaitingRoom':
                const waitingRoomKey = util.format(waitingRoomKeyFormat, userMatchState.stateValue);
                if (await global.redis.existsAsync(waitingRoomKey) !== 1) {
                    userMatchState.state = '';
                    userMatchState.stateValue = '';
                    userMatchState.matchmakingTicketId = '';
                    await userMatchState.save();
                }
                break;

            case 'inGameRoom':
                const gameRoomKey = util.format(gameRoomKeyFormat, userMatchState.stateValue);
                if (await global.redis.existsAsync(gameRoomKey) !== 1) {
                    userMatchState.state = '';
                    userMatchState.stateValue = '';
                    userMatchState.matchmakingTicketId = '';
                    await userMatchState.save();
                }
                break;
        }
        return userMatchState;
    } catch (error) {
        console.error(error);
    }
}

async function validateToMatchmaking(userId) {
    try {
        let userMatchState = await getUserMatchState(userId);
        switch (userMatchState.state) {
            case 'inWaitingRoom':
            case 'inGameRoom':
                return false;
            default:
                return true;
        }
    } catch (error) {
        console.error(error);
    }

    return false;
}

async function leaveWaitingRoom(userId, waitingRoomId) {
    const waitingRoom = getWaitingRoom(waitingRoomId);
    if (waitingRoom === undefined) {
        return;
    }

    const index = waitingRoom.waitingPlayerList.indexOf(userId);
    if (index !== -1) {
        waitingRoom.waitingPlayerList.splice(index, 1);
        return;
    };
}

function existsWaitingRoom(waitingRoomId) {
    for (let gameTypeMap of waitingRoomMap.values()) {
        for (let waitingRoomList of gameTypeMap.values()) {
            for (let waitingRoom of waitingRoomList) {
                if (waitingRoom.waitingRoomId === waitingRoomId) {
                    return true;
                }
            }
        }
    }

    return false;
}

function getWaitingRoom(waitingRoomId) {
    for (let gameTypeMap of waitingRoomMap.values()) {
        for (let waitingRoomList of gameTypeMap.values()) {
            for (let waitingRoom of waitingRoomList) {
                if (waitingRoom.waitingRoomId === waitingRoomId) {
                    return waitingRoom;
                }
            }
        }
    }
}

function removeWaitingRoom(waitingRoomId) {
    for (let gameTypeMap of waitingRoomMap.values()) {
        for (let waitingRoomList of gameTypeMap.values()) {
            const index = waitingRoomList.findIndex(element => element.waitingRoomId === waitingRoomId);
            if (index !== -1) {
                waitingRoomList[index].clear();
                waitingRoomList.splice(index, 1);
                return;
            };
        }
    }
}

function issueMatchmakingTicket(userId, gameType, matchType, rating) {
    const matchmakingTicket = new MatchmakingTicket();
    matchmakingTicket.ticketId = uuid.v4();
    matchmakingTicket.creator = userId;
    matchmakingTicket.gameType = gameType;
    matchmakingTicket.matchType = matchType;
    matchmakingTicket.rating = rating;

    return matchmakingTicket;
}

async function joinOrCreateWaitingRoom(userMatchState, matchmakingTicket) {
    const gameType = matchmakingTicket.gameType;
    const matchType = matchmakingTicket.matchType;

    if (waitingRoomMap.has(gameType) === false) {
        waitingRoomMap.set(gameType, new Map());
    }

    if (waitingRoomMap.get(gameType).has(matchType) === false) {
        waitingRoomMap.get(gameType).set(matchType, []);
    }

    const roomList = waitingRoomMap.get(gameType).get(matchType);

    let waitingRoom = findSuitableWaitingRoom(roomList, matchmakingTicket.rating, 200);
    if (waitingRoom === undefined) {
        const index = findIndexLowerRatingWaitingRoom(roomList, matchmakingTicket.rating);

        waitingRoom = new WaitingRoom();
        waitingRoom.waitingRoomId = uuid.v4();
        waitingRoom.gameType = gameType;
        waitingRoom.matchType = matchType;
        waitingRoom.targetRating = matchmakingTicket.rating;
        waitingRoom.created = Date.now();
        waitingRoom.waitingPlayerList = [];
        waitingRoom.matchmakingTicketList = [];
        waitingRoom.maxWaitngTime = 500;
        waitingRoom.minPlayerCount = 1; //  ?
        waitingRoom.maxPlayerCount = 8; //  ?
        waitingRoom.status = 'waitingPlayers';

        try {
            await waitingRoom.alive();
            roomList.splice(index + 1, 0, waitingRoom);
        } catch (error) {
            console.error(error);
            removeWaitingRoom(waitingRoom.waitingRoomId);
            return false;
        }
    }

    try {
        userMatchState.state = 'inWaitingRoom';
        userMatchState.stateValue = waitingRoom.waitingRoomId;
        userMatchState.matchmakingTicketId = matchmakingTicket.ticketId;
        await userMatchState.save();
        waitingRoom.waitingPlayerList.push(userMatchState.userId);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
   
    return false;
}

function findSuitableWaitingRoom(waitingRoomArray, rating, offset) {
    return waitingRoomArray.find(element => {
        return Math.abs(element.targetRating - rating) <= offset && element.isFull() === false;
    });
}

function findIndexLowerRatingWaitingRoom(waitingRoomArray, rating) {
    const reverseArray = waitingRoomArray.slice().reverse();
    const index = reverseArray.findIndex(element => {
        return element.targetRating <= rating;
    });

    if (index !== undefined) {
        return reverseArray.length - index - 1;
    } else {
        return reverseArray.length;
    }
}

async function processWaitingRoom(waitingRoom) {
    waitingRoom.status = 'waitingGameRoom';
    let response;
    try {
        const options = {
            uri: 'http://127.0.0.1:2000/room/spawnRoom',
            method: 'POST',
            body: {
                region: 'kr',
                gameRoomId: uuid.v4(),
                expectedPlayerList: waitingRoom.waitingPlayerList,
            },
            json: true
        }

        const json = await request(options);
        response = JSON.parse(json);
        if (response.code !== ResponseCode.SUCCESS) {
            throw response.code;
        }
    } catch (error) {
        console.error(error);
        waitingRoom.status = 'waitingPlayers';
        return;
    }

    //MULTI TRANSACTION
    for (const waitingPlayer of waitingRoom.waitingPlayerList) {
        try {
            let userMatchState = await getUserMatchState(waitingPlayer);
            userMatchState.state = 'inGameRoom';
            userMatchState.stateValue = response.gameRoomId;
            userMatchState.matchmakingTicketId = '';
            await userMatchState.save();
        } catch (error) {
            console.error(error);
            //  rollback (userMatchState, despawn game room)
        }
    }

    removeWaitingRoom(waitingRoom.waitingRoomId);
}

async function matchmakingUpdate() {
    for (const gameTypeMap of waitingRoomMap.values()) {
        for (const waitingRoomList of gameTypeMap.values()) {
            for (let i = waitingRoomList.length - 1; i >= 0; --i) {
                const waitingRoom = waitingRoomList[i];
                if (waitingRoom.waitingPlayerList.length >= waitingRoom.minPlayerCount && waitingRoom.status === 'waitingPlayers') {
                    processWaitingRoom(waitingRoom);
                }
            }
        }
    }
}

module.exports = router;
