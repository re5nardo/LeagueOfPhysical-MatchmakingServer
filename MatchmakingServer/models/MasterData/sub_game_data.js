'use strict';

module.exports = class SubGameData {
    constructor() {
        this.subGameId = '';
        this.minPlayerCount = 2;
        this.maxPlayerCount = 8;
        this.availableMatchTypeList = [];
    }
}
