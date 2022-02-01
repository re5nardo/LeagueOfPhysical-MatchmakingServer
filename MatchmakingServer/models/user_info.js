'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userInfoSchema = new Schema({
    userId: String,
    nickname: { type: String, default: '' },
    masterExp: { type: Number, default: 0 },
    friendlyRating: { type: Number, default: 1500 },
    rankRating: { type: Number, default: 1500 },
    goldCoin: { type: Number, default: 100 },
    gem: { type: Number, default: 10 }
});

module.exports = mongoose.model('UserInfo', userInfoSchema);
