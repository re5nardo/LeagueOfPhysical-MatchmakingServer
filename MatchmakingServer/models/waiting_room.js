'use strict';
const util = require("util");

const waitingRoomKeyFormat = `waitingRoom:%s`;

module.exports = class WaitingRoom {
    constructor() {
        this.waitingRoomId = '';
        this.gameType = '';
        this.matchType = '';
        this.targetRating = -1;
        this.created = -1;
        this.waitingPlayerList = [];
        this.matchmakingTicketList = [];
        this.maxWaitngTime = -1;
        this.minPlayerCount = -1;
        this.maxPlayerCount = -1;
        this.status = 'waitingPlayers';   //  waitingPlayers, waitingGameRoom, ...

        this.timerId = setInterval(this.alive.bind(this), 7 * 1000);
    }

    isFull() {
        return this.waitingPlayerList.length === this.maxPlayerCount;
    }

    clear() {
        clearInterval(this.timerId);
    }

    async alive() {
        await global.redis.setexAsync(util.format(waitingRoomKeyFormat, this.waitingRoomId), 10, Date.now());
    }
}
