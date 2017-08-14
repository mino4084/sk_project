// users.js
var mongoose = require('mongoose');
var db = require('./db');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(db);

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
	user_id : String,
	user_pw : String,
	user_nick : String,
	user_uuid : String,
	user_token : String,
	user_image : { type : String, default : 'default.jpg' },
	user_yn : { type : Number, default : 0 },
});


UserSchema.plugin(autoIncrement.plugin, { model : 'User', field : 'user_no', startAt : 1, incrementBy : 1});

var User = db.model('User', UserSchema);
module.exports = User;