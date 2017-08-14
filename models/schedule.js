// models/comment.js
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Item = require('./item');

var ScheduleSchema = new Schema({
	schedule_date : String, // 1일차 2일차 타입을 Date or String
	schedule_list : [Item]
});

module.exports = ScheduleSchema;