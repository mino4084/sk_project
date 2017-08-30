// memo.js
var mongoose = require('mongoose');
var db = require('./db');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(db);

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var NoticeSchema = new Schema({
	trip_no : Number,
	notice_trip : String,
	notice_partner : String,
	notice_item : String,
	notice_type : Number, // 후보지 업로드 : 0, 후보지 체크 : 1, 후보지 체크 해제 : 2, 후보지 삭제 : 3
	notice_time : { type : Date, default : Date.now }
});


NoticeSchema.plugin(autoIncrement.plugin, { model : 'Notice', field : 'notice_no', startAt : 1, incrementBy : 1});

var Notice = db.model('Notice', NoticeSchema);
module.exports = Notice;