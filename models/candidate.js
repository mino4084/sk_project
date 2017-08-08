/*// models/comment.js
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Item = require('./item');

var CandidateSchema = new Schema({
	cand_date : String, // 1일차 2일차 타입을 Date or String
	cand_list : [Item]
});

module.exports = CandidateSchema;*/