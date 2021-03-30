'use strict';
const ResponseBase = require('./response_base');

module.exports = class CreateMatchmakingTicketResponse extends ResponseBase {
    constructor(code, ticketId) {
        super(code);
        this.ticketId = ticketId;
    }
}
