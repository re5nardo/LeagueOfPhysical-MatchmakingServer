'use strict';
const express = require('express');
const router = express.Router();
const util = require("util");
const request = require('request-promise-native');
const uuid = require('uuid');

const CreateMatchmakingTicketResponse = require('../models/response/create_matchmaking_ticket_response');
const CancelMatchmakingTicketResponse = require('../models/response/cancel_matchmaking_ticket_response');
const MatchmakingTicket = require('../models/matchmaking_ticket');
const WaitingRoom = require('../models/waiting_room');
const ResponseCode = require('../response_code');

const userMatchStateKeyFormat = `user.matchState:%s`;
const matchmakingTicketKeyFormat = `matchmaking.ticket:%s`;
const gameRoomKeyFormat = `gameRoom:%s`;

const userMatchStateLockKeyFormat = `lock.user.matchState:%s`;

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

    if (await validateToMatchmaking(userId) !== true) {
        return res.json(new CreateMatchmakingTicketResponse(ResponseCode.INVALID_TO_MATCHMAKING, -1));
    }

    //  issue & save matchmakingTicket
    let matchmakingTicket;
    try {
        matchmakingTicket = issueMatchmakingTicket(userId, gameType, matchType, rating);
        global.redis.redisMulti.setex(util.format(matchmakingTicketKeyFormat, matchmakingTicket.ticketId), 60 * 10, JSON.stringify(matchmakingTicket));
        await global.redis.execMultiAsync();
    } catch (error) {
        console.error(error);
        return res.json(new CreateMatchmakingTicketResponse(ResponseCode.INVALID_TO_MATCHMAKING, -1));
    }

    //  update userMatchState
    let userMatchStateLock;
    const ttl = 3000;
    try {
        userMatchStateLock = await global.redis.redlock.lock(util.format(userMatchStateLockKeyFormat, userId), ttl);

        let userMatchState;
        const userMatchStateJson = await global.redis.getAsync(util.format(userMatchStateKeyFormat, userId));
        if (userMatchStateJson === null) {
            userMatchState = {};
        } else {
            userMatchState = JSON.parse(userMatchStateJson);
        }
        userMatchState.state = '';
        userMatchState.stateValue = '';
        userMatchState.matchmakingTicketId = matchmakingTicket.ticketId;

        await global.redis.setAsync(util.format(userMatchStateKeyFormat, userId), JSON.stringify(userMatchState));
    } catch (error) {
        console.error(error);
        return res.json(new CreateMatchmakingTicketResponse(ResponseCode.INVALID_TO_MATCHMAKING, -1));
    } finally {
        await userMatchStateLock.unlock();
    }

    //  join or create waitingRoom
    if (await joinOrCreateWaitingRoom(userId, matchmakingTicket) === true) {
        res.json(new CreateMatchmakingTicketResponse(ResponseCode.SUCCESS, matchmakingTicket.ticketId));
    }
    else {
        res.json(new CreateMatchmakingTicketResponse(ResponseCode.INVALID_TO_MATCHMAKING, -1));
    }
}

async function onCancelMatchmakingTicket(req, res) {
    const userId = req.params.userId;
    let userMatchStateLock;
    const ttl = 3000;
    try {
        userMatchStateLock = await global.redis.redlock.lock(util.format(userMatchStateLockKeyFormat, userId), ttl);

        let userMatchState;
        const userMatchStateJson = await global.redis.getAsync(util.format(userMatchStateKeyFormat, userId));
        if (userMatchStateJson === null) {
            return res.json(new CancelMatchmakingTicketResponse(ResponseCode.SUCCESS));
        } else {
            userMatchState = JSON.parse(userMatchStateJson);
        }
       
        switch (userMatchState.state) {
            case 'inWaitingRoom':
                leaveWaitingRoom(userId, userMatchState.stateValue);
                userMatchState.state = 'none';
                userMatchState.stateValue = '';
                userMatchState.matchmakingTicketId = '';
                await global.redis.setAsync(util.format(userMatchStateKeyFormat, userId), JSON.stringify(userMatchState));
                return res.json(new CancelMatchmakingTicketResponse(ResponseCode.SUCCESS));
            case 'inGameRoom':
                const gameRoomKey = util.format(gameRoomKeyFormat, userMatchState.stateValue);
                if (await global.redis.existsAsync(gameRoomKey) === 1) {
                    return res.json(new CancelMatchmakingTicketResponse(ResponseCode.UNKNOWN_ERROR));
                } else {
                    userMatchState.state = 'none';
                    userMatchState.stateValue = '';
                    userMatchState.matchmakingTicketId = '';
                    await global.redis.setAsync(util.format(userMatchStateKeyFormat, userId), JSON.stringify(userMatchState));
                    return res.json(new CancelMatchmakingTicketResponse(ResponseCode.SUCCESS));
                }
            default:
                return res.json(new CancelMatchmakingTicketResponse(ResponseCode.SUCCESS));
        }
    } catch (error) {
        console.error(error);
        return res.json(new CancelMatchmakingTicketResponse(ResponseCode.UNKNOWN_ERROR));
    } finally {
        await userMatchStateLock.unlock();
    }

    res.json(new CancelMatchmakingTicketResponse(ResponseCode.UNKNOWN_ERROR));
}

async function validateToMatchmaking(userId) {
    let userMatchStateLock;
    const ttl = 3000;
    try {
        userMatchStateLock = await global.redis.redlock.lock(util.format(userMatchStateLockKeyFormat, userId), ttl);

        let userMatchState;
        const userMatchStateJson = await global.redis.getAsync(util.format(userMatchStateKeyFormat, userId));
        if (userMatchStateJson === null) {
            return true;
        } else {
            userMatchState = JSON.parse(userMatchStateJson);
        }

        switch (userMatchState.state) {
            case 'inWaitingRoom':
                if (existsWaitingRoom(userMatchState.stateValue) === true) {
                    return false;
                } else {
                    userMatchState.state = 'none';
                    userMatchState.stateValue = '';
                    await global.redis.setAsync(util.format(userMatchStateKeyFormat, userId), JSON.stringify(userMatchState));
                    return true;
                }
            case 'inGameRoom':
                const gameRoomKey = util.format(gameRoomKeyFormat, userMatchState.stateValue);
                if (await global.redis.existsAsync(gameRoomKey) === 1) {
                    return false;
                } else {
                    userMatchState.state = 'none';
                    userMatchState.stateValue = '';
                    await global.redis.setAsync(util.format(userMatchStateKeyFormat, userId), JSON.stringify(userMatchState));
                    return true;
                }
            default:
                return true;
        }
    } catch (error) {
        console.error(error);
    } finally {
        await userMatchStateLock.unlock();
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
    matchmakingTicket.created = Date.now();

    return matchmakingTicket;
}

async function joinOrCreateWaitingRoom(userId, matchmakingTicket) {
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

    let userMatchStateLock;
    const ttl = 3000;
    try {
        userMatchStateLock = await global.redis.redlock.lock(util.format(userMatchStateLockKeyFormat, userId), ttl);

        let userMatchState;
        const userMatchStateJson = await global.redis.getAsync(util.format(userMatchStateKeyFormat, userId));
        if (userMatchStateJson === null) {
            userMatchState = {};
        } else {
            userMatchState = JSON.parse(userMatchStateJson);
        }

        userMatchState.state = 'inWaitingRoom';
        userMatchState.stateValue = waitingRoom.waitingRoomId;
        userMatchState.matchmakingTicketId = matchmakingTicket.ticketId;

        await global.redis.setAsync(util.format(userMatchStateKeyFormat, userId), JSON.stringify(userMatchState));
        waitingRoom.waitingPlayerList.push(userId);
     
        return true;
    } catch (error) {
        console.error(error);
        return false;
    } finally {
        await userMatchStateLock.unlock();
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

    for (const waitingPlayer of waitingRoom.waitingPlayerList) {
        let userMatchStateLock;
        const ttl = 3000;
        try {
            userMatchStateLock = await global.redis.redlock.lock(util.format(userMatchStateLockKeyFormat, waitingPlayer), ttl);

            const userMatchState = {
                state: 'inGameRoom',
                stateValue: response.gameRoomId,
                matchmakingTicketId: ''
            }
            await global.redis.setAsync(util.format(userMatchStateKeyFormat, waitingPlayer), JSON.stringify(userMatchState));
        } catch (error) {
            console.error(error);
            //  rollback (userMatchState, despawn game room)
        } finally {
            await userMatchStateLock.unlock();
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
