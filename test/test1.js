// test1.js
// console.log("aaa");
var UserModel = require('../models/user');

var data = {
	user_id : "user_id",
	user_pw : "hash_pw",
	user_token : "user_token",
	user_uuid : "user_uuid",
	user_nick : "user_nick"
};
var check = {
	code : "code",
	message : "message"
};
var user = new UserModel(data);
user.save(function(err, doc){
	if(err){
		check.code = 0;
		data.message = err;
		return console.log(err);
	}
	console.log('doc =', doc);
});
