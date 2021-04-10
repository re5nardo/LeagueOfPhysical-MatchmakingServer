'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userInfoSchema = new Schema({
    userId: String,
    friendlyRating: { type: Number, default: 1500 },
    rankRating: { type: Number, default: 1500 }
});

module.exports = mongoose.model('UserInfo', userInfoSchema);
