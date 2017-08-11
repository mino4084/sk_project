var express = require('express');
var router = express.Router();
// var bcrypt = require('bcrypt-node');
var UserModel = require('../models/user');
var TripModel = require('../models/trip');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Tripco Main Page' });
});

router.get('/login', function(req, res, next){
	res.render('loginform', {title : "login"});
});

router.post('/login', function(req, res, next){
	console.log('req.body =', req.body);
	var id = req.body.id;
	var pw = req.body.pw;
	var code = 1;
	var message = "OK";
	var check = {
		code : code,
		message : message,
	};

	UserModel.findOne({user_id : id, user_pw : pw}, function(err, doc){
		if(err) {
			console.log('err =', err);
			data.code = 0;
			data.message = err;
		}

		console.log('doc =', doc); // 실패할 경우 null
		if(doc){
			//req.session.user_id = id;
			// res.send('<script>location.href="/users/";</script>');
		}
		else{
			data.code = 0;
			data.message = err;
			// res.send('<script>alert("로그인 실패.");history.back();</script>');
		}
		res.json(check);
	});
});

router.get('/join', function(req, res, next){
	res.render('joinform', {title : "회원가입"});
});

router.post('/join', function(req, res, next){
	console.log('req body =', req.body);
	var user_id = req.body.id;
	var user_pw = req.body.pw;
	var user_token = req.body.token;
	var user_uuid = req.body.uuid;
	var user_nick = req.body.nick;
	var code = 1;
	var message = "OK";
	// var hash = bcrypt.hashSync(user_pw);
	console.log('user_pw = ', user_pw);

	var data = {
		user_id : user_id,
		user_pw : user_pw,
		user_token : user_token,
		user_uuid : user_uuid,
		user_nick : user_nick
	};
	var check = {
		code : code,
		message : message
	};
	// res.json(data);
	var user = new UserModel(data);
	user.save(function(err, doc){
		if(err){
			check.code = 0;
			data.message = err;
			return next(err);
		}
		console.log('doc =', doc);
		res.json(check);
	});
	/*res.json(data, function(err){
		if(err){
			code = 0;
			res.json(data);
		}
		code = 1;
		res.json(data);
	});*/

});

router.get('/findpw', function(req, res, next){
	res.render('findpw', {title : "findpw"});
});

router.post('/findpw', function(req, res, next){
	console.log('req.body =', req.body);
	var id = req.body.id;
	var pw = '';
	var code = 1;
	var message = "OK";
	var check = {
		code : code,
		message : message,
		pw : pw
	};

	UserModel.findOne({user_id : id}, function(err, doc){
		if(err) {
			console.log('err =', err);
			check.code = 0;
			check.message = err;

		}

		console.log('doc =', doc); // 실패할 경우 null
		if(doc){
			check.pw = doc.user_pw;
			//req.session.user_id = id;
			// res.send('<script>location.href="/users/";</script>');
		}
		else{
			check.code = 0;
			check.message = err;
			check.pw = '존재하지 않는 아이디입니다.';
			// res.send('<script>alert("로그인 실패.");history.back();</script>');
		}
		res.json(check);
	});
});

router.get('/nick', function(req, res, next){
	res.render('nick', {title : "nick"});
});

router.post('/nick', function(req, res, next){
	console.log('req.body =', req.body);
	var id = req.body.id;
	var nick = req.body.nick;
	var nickname = '';
	var code = 1;
	var message = "OK";
	var check = {
		code : code,
		message : message,
		nickname : nickname
	};

	UserModel.updateOne({user_id : id}, {$set : {user_nick : nick}}, {safe : true, upsert : true, new : true}, function(err, doc){
		if(err) {
			console.log('err =', err);
			check.code = 0;
			check.message = err;
		}
		if(doc){
			check.nickname = nick;
		}
		else{
			check.code = 0;
			check.message = '존재하지 아이디이거나 오류';
		}
		console.log('doc =', doc);
		res.json(check);
	});
});

router.get('/changepw', function(req, res, next){
	res.render('changepw', {title : "change pw"});
});

router.post('/changepw', function(req, res, next){
	console.log('req.body =', req.body);
	var id = req.body.id;
	var pw = req.body.pw;
	var password = '';
	var code = 1;
	var message = "OK";
	var check = {
		code : code,
		message : message,
		password : password
	};

	UserModel.updateOne({user_id : id}, {$set : {user_pw : pw}}, function(err, doc){
		if(err) {
			console.log('err =', err);
			check.code = 0;
			check.message = err;
		}
		if(doc){
			check.password = pw;
		}
		else{
			check.code = 0;
			check.message = '존재하지 아이디이거나 오류';
		}
		console.log('doc =', doc);
		res.json(check);
	});
});

router.get('/find_partner/:trip_no', function(req, res, next){
	var trip_no = req.params.trip_no;
	console.log('trip_no =', trip_no);
	UserModel.findOne({trip_no : trip_no}, function(err, doc){
		console.log('read doc =', doc);
		res.render('find_partner', {title : "find_partner", doc : doc}); //web
	});
});

router.get('/create_trip', function(req, res, next){
	res.render('create_trip', {title : "create_trip"});
});

router.post('/create_trip', function(req, res, next){
	console.log('req body =', req.body);
	var trip_title = req.body.title;
	var start_date = req.body.start;
	var end_date = req.body.end;
	var user_id = req.body.id;
	var hashtag = req.body.tag;
	var code = 1;
	var message = "OK";
	var result = {};

	var data = {
		trip_title : trip_title,
		start_date : start_date,
		end_date : end_date,
		user_id : user_id,
		hashtag : hashtag
	};

	var check = {
		code : code,
		message : message,
		result : result
	};

	var trip = new TripModel(data);
	trip.save(function(err, doc){
		if(err){
			check.code = 0;
			check.message = err;
			return next(err);
		}
		check.result = doc;
		console.log('doc =', doc);
		res.json(check);
	});


});

module.exports = router;
