// memo.js
var mongoose = require('mongoose');
var db = require('./db');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(db);

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var NoticeSchema = new Schema({
	user_no : { type : Number, ref : 'User' },
	trip_no : { type : Number, ref : 'Trip' }
});


NoticeSchema.plugin(autoIncrement.plugin, { model : 'Notice', field : 'notice_no', startAt : 1, incrementBy : 1});

var Notice = db.model('Notice', NoticeSchema);
module.exports = Notice;