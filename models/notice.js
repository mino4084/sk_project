// memo.js
var mongoose = require('mongoose');
var moment = require('moment-timezone');
var time = moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm");
var db = require('./db');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(db);

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var NoticeSchema = new Schema({
	trip_no : Number,
	notice_trip : String,
	notice_partner : String,
	notice_image : String,
	notice_item : String,
	notice_type : Number, // 후보지 업로드 : 0, 후보지 체크 : 1, 후보지 체크 해제 : 2, 후보지 삭제 : 3
	notice_time : { type : String, default : time }
});

NoticeSchema.plugin(autoIncrement.plugin, { model : 'Notice', field : 'notice_no', startAt : 1, incrementBy : 1});

var Notice = db.model('Notice', NoticeSchema);

function formatDate(date){
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var i = date.getMinutes();
	var s = date.getSeconds();
	// yyyy-MM-dd hh:mm:ss 형태
	var day = y + '-' + (m > 9 ? m : "0" + m) + '-' + (d > 9 ? d : "0" + d) + ' ' + (h > 9 ? h : "0" + h) + ':' + (i > 9 ? i : "0" + i) + ':' + (s > 9 ? s : "0" + s);
	return day;
};

module.exports = Notice;