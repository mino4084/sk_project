var express = require('express');
var router = express.Router();
var UserModel = require('../models/user');

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
			data.meesage = err;
		}

		console.log('doc =', doc); // 실패할 경우 null
		if(doc){
			//req.session.user_id = id;
			// res.send('<script>location.href="/users/";</script>');
		}
		else{
			data.code = 0;
			data.meesage = err;
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
			data.meesage = err;
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
			data.code = 0;
			data.meesage = err;

		}

		console.log('doc =', doc); // 실패할 경우 null
		if(doc){
			check.pw = doc.user_pw;
			//req.session.user_id = id;
			// res.send('<script>location.href="/users/";</script>');
		}
		else{
			data.code = 0;
			data.meesage = err;
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
	var nick = req.body.nick;
	var nick = '';
	var code = 1;
	var message = "OK";
	var check = {
		code : code,
		message : message,
		nick : nick
	};

	UserModel.updateOne({user_nick : nick}, function(err, doc){
		if(err) {
			console.log('err =', err);
			data.code = 0;
			data.meesage = err;
		}
		console.log('doc =', doc);
		check.nick = doc.user_nick;
		res.json(check);
	});
});

module.exports = router;
