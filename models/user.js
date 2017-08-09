// users.js
var mongoose = require('mongoose');
var db = require('./db');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
	user_id : String,
	//push_id : String,
	user_pw : String,
	user_nick : { type : String, default : '닉네임을 설정해주세요.' },
	user_uuid : String,
	user_token : String,
	user_image : { type : String, default : 'default.jpg' }
});

var User = db.model('User', UserSchema);

module.exports = User;