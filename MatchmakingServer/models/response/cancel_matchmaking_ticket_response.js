'use strict';
const ResponseBase = require('./response_base');

module.exports = class CancelMatchmakingTicketResponse extends ResponseBase {
    constructor(code) {
        super(code);
    }
}
