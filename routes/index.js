var express = require('express');
var router = express.Router();
var moment = require('moment');
// var bcrypt = require('bcrypt-node');
var UserModel = require('../models/user');
var TripModel = require('../models/trip');

/* GET home page. */
router.get('/', function(req, res, next) {
	var user_id = req.session.user_id;
	//var id = req.body.id; 비회원일 경우 uuid나 토큰으로 저장
	console.log('user_id =', user_id);
  	res.render('index', { title: user_id });
});

// 로그인
router.get('/login', function(req, res, next){
	res.render('loginform', {title : "login"});
});

router.post('/login', function(req, res, next){
	console.log('req.body =', req.body);
	var id = req.body.id;
	var pw = req.body.pw;
	var code = 1;
	var message = "OK";
	var result = [];
	var check = {
		code : code,
		message : message,
		result : result
	};

	UserModel.findOne({user_id : id, user_pw : pw}, function(err, doc){
		if(err) {
			console.log('err =', err);
			check.code = 0;
			check.message = err;
		}

		console.log('doc =', doc); // 실패할 경우 null
		if(doc){
			req.session.user_id = id;
			console.log('req.session.user_id =', req.session.user_id);
			check.result = doc;
		}
		else{
			data.code = 0;
			data.message = '로그인 실패';
		}
		res.json(check);
	});
});
// 로그인

//프로필 조회
router.get('/profile', function(req, res, next){
	res.render('profileform', {title : "profile"});
});

router.post('/profile', function(req, res, next) {
  	var id = req.session.user_id;
  	//var id = req.body.id; 비회원일 경우 uuid나 토큰으로 저장
  	var code = 1;
  	var message = "OK";
  	var result = [];
  	var check = {
  		code : code,
  		message : message,
  		result : result
  	};

  	UserModel.findOne({user_id : id}, function(err, doc){
  		if(err) {
  			console.log('err =', err);
  			check.code = 0;
  			check.message = err;
  		}

  		console.log('doc =', doc); // 실패할 경우 null
  		if(doc){
  			req.session.user_id = id;
  			check.result = doc;
  			console.log('req.session.user_id =', req.session.user_id);
  		}
  		else{
  			check.code = 0;
  			check.message = '로그인 실패';
  		}
  		res.json(check);
  	});
});
//프로필 조회

//로그아웃
router.post('/logout', function(req, res, next){
	var id = req.session.user_id;
	//var id = req.body.id; 비회원일 경우 uuid나 토큰으로 저장
	var code = 1;
	var message = "OK";
	var result = [];
	var check = {
		code : code,
		message : message,
		result : result
	};
	req.session.destroy(function(err){
		if(err){
			check.code = 0;
			check.message = 'err';
			return console.log('err =', err);
		}
		console.log('logout req.session =', req.session);
		res.json(check);
	});
});
//로그아웃

// 회원가입
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
	var result = [];

	//bcrypt 사용
	// var hash = bcrypt.hashSync(user_pw);
	//console.log('user_pw = ', user_pw);

	var data = {
		user_id : user_id,
		user_pw : user_pw,
		user_token : user_token,
		user_uuid : user_uuid,
		user_nick : user_nick
	};
	var check = {
		code : code,
		message : message,
		result : result
	};
	var user = new UserModel(data);
	user.save(function(err, doc){
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
//회원가입

// 비밀번호 찾기
router.get('/find_pw', function(req, res, next){
	res.render('find_pw', {title : "findpw"});
});

router.post('/find_pw', function(req, res, next){
	console.log('req.body =', req.body);
	var id = req.session.user_id;
	//var id = req.body.id; 비회원일 경우 uuid나 토큰으로 저장
	var code = 1;
	var message = "OK";
	var result = [];
	var check = {
		code : code,
		message : message,
		result : result
	};

	UserModel.findOne({user_id : id}, function(err, doc){
		if(err) {
			console.log('err =', err);
			check.code = 0;
			check.message = err;
		}
		console.log('doc =', doc); // 실패할 경우 null
		if(doc){
			check.result = doc.user_pw;
		}
		else{
			check.code = 0;
			check.message = err;
		}
		res.json(check);
	});
});
//비밀번호 찾기

// 닉네임 설정
router.get('/nick', function(req, res, next){
	res.render('nick', {title : "nick"});
});

router.post('/nick', function(req, res, next){
	console.log('req.body =', req.body);
	var id = req.session.user_id;
	//var id = req.body.id; 비회원일 경우 uuid나 토큰으로 저장
	var nick = req.body.nick;
	var nickname = '';
	var code = 1;
	var message = "OK";
	var result = [];
	var check = {
		code : code,
		message : message,
		result : result
	};

	UserModel.updateOne({user_id : id}, {$set : {user_nick : nick}}, {safe : true, upsert : true, new : true}, function(err, doc){
		if(err) {
			console.log('err =', err);
			check.code = 0;
			check.message = err;
		}
		console.log('doc =', doc);
		if(doc){
			check.result = nick;
		}
		else{
			check.code = 0;
			check.message = '존재하지 아이디이거나 오류';
		}
		res.json(check);
	});
});
// 닉네임 설정

// 비밀번호 변경
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

// 파트너 찾기
router.get('/find_partner/:trip_no', function(req, res, next){
	var trip_no = req.params.trip_no;
	console.log('trip_no =', trip_no);
	TripModel.findOne({trip_no : trip_no}, function(err, doc){
		console.log('read doc =', doc);
		res.render('find_partner', {title : "find_partner", doc : doc}); //web
	});
});

router.post('/find_partner', function(req, res, next){
	console.log('req body =', req.body);
	var trip_no = req.body.trip_no;
	var partner_id = req.body.partner;
	var code = 1;
	var message = "OK";
	var result = {};
	var check = {
		code : code,
		message : message,
		result : result
	};

	TripModel.updateOne({trip_no : trip_no}, {$set : {partner_id : partner_id}}, {safe : true, upsert : true, new : true}, function(err, doc){
		if(err) {
			console.log('err =', err);
			check.code = 0;
			check.message = err;
		}
		if(doc){
			check.result = doc;
		}
		else{
			check.code = 0;
			check.message = '파트너를 찾는데에 실패했습니다.';
		}
		console.log('doc =', doc);
		res.json(check);
	});

});

// 여행 생성
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

// 여행 리스트 조회
router.get('/list_trip', function(req, res, next){
	console.log('req body =', req.body);
	var code = 1;
	var message = "OK";
	var result = {};
	var check = {
		code : code,
		message : message,
		result : result
	};
	TripModel.find({}, null, {sort : {trip_no : -1}}, function(err, docs){
		if(err) return next(err);
		console.log('list docs =', docs);
		check.result = docs;
		res.json(check);  //json으로 하면 모바일이 된다.
		//res.render('list_trip', {title : "list_trip", docs : docs}); //웹서버
	});

	//res.render('list_trip', {title : "list_trip"});
});

// 여행 수정
router.get('/update_trip/:trip_no', function(req, res, next){
	var trip_no = req.params.trip_no;
	console.log('trip_no =', trip_no);
	TripModel.findOne({trip_no : trip_no}, function(err, doc){
		if(err) {
			console.log('err =', err);
			res.send('<script>alert("실패");history.back();</script>');
		}

		console.log('doc =', doc); // 실패할 경우 null
		if(doc){
			res.render('update_trip', {title : "update_trip", doc : doc});
		}
		else{
			res.send('<script>alert("실패");history.back();</script>');
		}
	});

});

router.post('/update_trip', function(req, res, next){
	console.log('req.body = ', req.body);
	var trip_title = req.body.trip_title;
	var start_date = req.body.start_date;
	var end_date = req.body.end_date;
	var partner_id = req.body.partner_id;
	var hashtag = req.body.hashtag;
	var code = 1;
	var message = "OK";
	var result = {};

	var schedule = 0;

	var check = {
		code : code,
		message : message,
		result : result
	};

	TripModel.update({trip_title : trip_title, start_date : start_date, end_date : end_date, partner_id : partner_id, hashtag : hashtag}, function(err, doc){
		if(err) {
			console.log('err =', err);
			check.code = 0;
			check.message = err;
		}
		if(doc){
			schedule = moment(doc.end_date).diff(moment(doc.start_date), 'days');
			console.log('schedule =', schedule);
			check.result = doc;
		}
		else{
			check.code = 0;
			check.message = '실패';
		}
		console.log('doc =', doc);
		res.json(check);
	});
});

// 여행 삭제
router.get('/delete_trip/:trip_no', function(req, res, next){
	var trip_no = req.params.trip_no;
	console.log('trip_no =', trip_no);
	TripModel.findOne({trip_no : trip_no}, function(err, doc){
		if(err) {
			console.log('err =', err);
			res.send('<script>alert("실패");history.back();</script>');
		}

		console.log('doc =', doc); // 실패할 경우 null
		if(doc){
			res.render('delete_trip', {title : "delete_trip", doc : doc});
		}
		else{
			res.send('<script>alert("실패");history.back();</script>');
		}
	});

});

router.post('/delete_trip', function(req, res, next){
	console.log('req.body = ', req.body);
	var trip_no = req.body.trip_no;
	var trip_title = req.body.trip_title;
	var start_date = req.body.start_date;
	var end_date = req.body.end_date;
	var partner_id = req.body.partner_id;
	var hashtag = req.body.hashtag;
	var code = 1;
	var message = "OK";
	var result = {};
	var check = {
		code : code,
		message : message,
		result : result
	};

	TripModel.deleteOne({trip_no : trip_no}, function(err, doc){
		if(err) {
			console.log('err =', err);
			check.code = 0;
			check.message = err;
		}
		if(doc){
			check.result = doc;
		}
		else{
			check.code = 0;
			check.message = '실패';
		}
		console.log('doc =', doc);
		res.json(check);
	});
});

// 후보지 URL 단순 생성
router.get('/create_item_url', function(req, res, next){
	res.render('create_item_url', {title : "create_item_url"});
});

module.exports = router;
