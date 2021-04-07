'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userMatchStateSchema = new Schema({
    userId: String,
    state: String,
    stateValue: String,
    matchmakingTicketId: String
});

module.exports = mongoose.model('UserMatchState', userMatchStateSchema);
