'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var matchmakingTicketSchema = new Schema({
    ticketId: String,
    creator: String,
    gameType: String,
    matchType: String,
    rating: Number,
    createdAt: {
        type: Date,
        expires: 60 * 10
    }
},
{
    timestamps: true,
});

module.exports = mongoose.model('MatchmakingTicket', matchmakingTicketSchema);
