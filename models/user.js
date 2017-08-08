// users.js
var mongoose = require('mongoose');
var db = require('./db');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserShcema = new Schema({
	user_id : String,
	user_pw : String,
	user_nick : String,
	user_uuid : String,
	user_token : String,
	del_yn : { type : String, default : 'N'}
});

var UserModel = db.model('User', UserShcema);

module.exports = UserModel;