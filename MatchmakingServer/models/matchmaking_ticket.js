'use strict';

module.exports = class MatchmakingTicket {
    constructor() {
        this.ticketId = '';
        this.creator = '';
        this.gameType = '';
        this.matchType = '';
        this.rating = -1;
        this.created = -1;
    }
}
