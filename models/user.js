// users.js
var mongoose = require('mongoose');
var db = require('./db');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(db);

var UserSchema = new Schema({
	user_id : String,
	//push_id : String,
	user_pw : String,
	user_nick : { type : String, default : '닉네임을 설정해주세요.' },
	user_uuid : String,
	user_token : String,
	user_image : { type : String, default : 'default.jpg' }
});

/*UserSchema.virtual('myregdate')
	.get(function(){
		return formatDate(this.regdate);
});*/
UserSchema.plugin(autoIncrement.plugin, { model : 'User', field : 'user_no', startAt : 1, incrementBy : 1});

var User = db.model('User', UserSchema);
module.exports = User;

/*function formatDate(date){
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var i = date.getMinutes();
	var s = date.getSeconds();
	// yyyy-MM-dd hh:mm:ss 형태
	var day = y + '-' + (m > 9 ? m : "0" + m) + '-' + (d > 9 ? d : "0" + d) + ' ' + (h > 9 ? h : "0" + h) + ':' + (i > 9 ? i : "0" + i) + ':' + (s > 9 ? s : "0" + s);
	return day;
};*/