var express = require('express');
var router = express.Router();
var moment = require('moment');
// var bcrypt = require('bcrypt-node');
var UserModel = require('../models/user');
var TripModel = require('../models/trip');
var ScheduleModel = require('../models/schedule');

/* GET home page. */
router.get('/', function(req, res, next) {
	var user_id = req.session.user_id;
	//var id = req.body.id; 비회원일 경우 uuid나 토큰으로 저장
	console.log('user_id =', user_id);
  	res.render('index', { title: user_id });
});

//프로필 조회
router.get('/profile', function(req, res, next){
	res.render('profileform', {title : "profile"});
});

router.post('/profile', function(req, res, next) {
  	var id = req.session.user_id;
  	//var id = req.body.id; 비회원일 경우 uuid나 토큰으로 저장
  	var code = 1;
  	var message = "OK";
  	var result = {};
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

// 로그인
router.get('/login', function(req, res, next){
	res.render('loginform', {title : "login"});
});

router.post('/login', function(req, res, next){
	console.log('req.body =', req.body);
	var id = req.body.user_id;
	var pw = req.body.user_pw;
	var code = 1;
	var message = "OK";
	var result = {};
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
			doc.user_yn = 0;
			console.log('req.session.user_id =', req.session.user_id);
			check.result = doc;
		}
		else{
			check.code = 0;
			check.message = '로그인 실패';
		}
		res.json(check);
	});
});
// 로그인



//로그아웃
router.post('/logout', function(req, res, next){
	var id = req.session.user_id;
	//var id = req.body.id; 비회원일 경우 uuid나 토큰으로 저장
	var code = 1;
	var message = "OK";
	var result = {};
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
	var user_id = req.body.user_id;
	var user_pw = req.body.user_pw;
	var user_token = req.body.user_token;
	var user_uuid = req.body.user_uuid;
	var user_nick = req.body.user_nick;
	var code = 1;
	var message = "OK";
	var result = {};

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
	var result = {};
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
	var nick = req.body.user_nick;
	var nickname = '';
	var code = 1;
	var message = "OK";
	var result = {};
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
router.get('/change_pw', function(req, res, next){
	res.render('change_pw', {title : "change pw"});
});

router.post('/change_pw', function(req, res, next){
	console.log('req.body =', req.body);
	var id = req.session.user_id;
	//var id = req.body.id; 비회원일 경우 uuid나 토큰으로 저장
	var pw = req.body.user_pw;
	var code = 1;
	var message = "OK";
	var result = {};
	var check = {
		code : code,
		message : message,
		result : result
	};

	UserModel.updateOne({user_id : id}, {$set : {user_pw : pw}}, function(err, doc){
		if(err) {
			console.log('err =', err);
			check.code = 0;
			check.message = err;
		}
		console.log('doc =', doc);
		if(doc){
			check.result = pw;
		}
		else{
			check.code = 0;
			check.message = '존재하지 아이디이거나 오류';
		}
		res.json(check);
	});
});
// 비밀번호 변경

//회원 탈퇴
router.get('/stop', function(req, res, next){
	res.render('stop', {title : "stop"});
});

router.post('/stop', function(req, res, next){
	console.log('req.body =', req.body);
	var id = req.session.user_id;
	//var id = req.body.id; 비회원일 경우 uuid나 토큰으로 저장
	var stop = 1;
	var code = 1;
	var message = "OK";
	var result = {};
	var check = {
		code : code,
		message : message,
		result : result
	};

	UserModel.updateOne({user_id : id}, {$set : {user_yn : stop}}, function(err, doc){
		if(err) {
			console.log('err =', err);
			check.code = 0;
			check.message = err;
		}
		console.log('doc =', doc);
		if(doc){
			check.result = doc.user_yn;
			req.session.destroy(function(err){
				if(err){
					return console.log('err =', err);
				}
				console.log('logout req.session =', req.session);
			});
		}
		else{
			check.code = 0;
			check.message = '존재하지 아이디이거나 오류';
		}
		res.json(check);
	});
});
//회원 탈퇴

// 여행 생성
router.get('/create_trip', function(req, res, next){
	res.render('create_trip', {title : "create_trip"});
});

router.post('/create_trip', function(req, res, next){
	console.log('req body =', req.body);
	var id = req.session.user_id;
	//var id = req.body.id; 비회원일 경우 uuid나 토큰으로 저장
	var trip_title = req.body.trip_title;
	var start_date = req.body.start_date;
	var end_date = req.body.end_date;
	var user_id = id;
	var partner_id = req.body.partner_id;
	var hashtag = req.body.hashtag;
	var code = 1;
	var message = "OK";
	var result = {};

	var data = {
		trip_title : trip_title,
		start_date : start_date,
		end_date : end_date,
		user_id : user_id,
		partner_id : partner_id,
		hashtag : hashtag
	};

	var check = {
		code : code,
		message : message,
		result : result
	};

	// DB에 trip 생성
	var trip = new TripModel(data);
	trip.save(function(err, doc){
		if(err){
			check.code = 0;
			check.message = err;
			return next(err);
		}
		console.log('doc =', doc);
		console.log('trip_no =', doc.trip_no);
		//DB에 schedule 생성
		var day1 = moment(start_date);
		var day2 = moment(end_date);
		console.log('day1 =', day1);
		console.log('day2 =', day2);
		var num = day2.diff(day1, 'days');
		console.log('num =', num);
		for (var i = 1; i <= num + 1; i++) {
			console.log('i =', i);
			var scheduleDate = {
				schedule_date : i
			};
			TripModel.findOneAndUpdate({trip_no : doc.trip_no}, {$push : {"trip_list" : scheduleDate}},
				{safe : true, upsert : true, new : true}, function(err, doc){
				if(err) return next(err);
				console.log('schedule update doc =', doc);
			});
		}
		check.result = doc;
		res.json(check);
	});
});
// 여행 생성

// 파트너 찾기
///////////////
//
//자기 자신 파트너 방지하기 기능 추가해야함
//
//
///////////////
router.get('/find_partner', function(req, res, next){
	res.render('find_partner', {title : "find_partner"});
});

router.post('/find_partner', function(req, res, next){
	console.log('req body =', req.body);

	var partner_id = req.body.partner_id;
	var code = 1;
	var message = "OK";
	var result = {};
	var check = {
		code : code,
		message : message,
		result : result
	};

	UserModel.findOne({user_id : partner_id}, function(err, doc){
		if(err) {
			console.log('err =', err);
			check.code = 0;
			check.message = err;
		}
		console.log('doc =', doc); // 실패할 경우 null
		if(doc){
			check.result = doc.user_id;
		}
		else{
			check.code = 0;
			check.message = "아이디가 존재하지 않습니다.";
		}
		res.json(check);
	});

});
// 파트너 찾기

// 여행 파트너 끊기
router.get('/cut_partner', function(req, res, next){
	res.render('cut_partner', {title : "cut_partner"});
});

router.post('/cut_partner', function(req, res, next){
	console.log('req.body =', req.body);
	var trip_no = req.body.trip_no;
	var stop = 1;
	var code = 1;
	var message = "OK";
	var result = {};
	var check = {
		code : code,
		message : message,
		result : result
	};

	TripModel.findOneAndUpdate({trip_no : trip_no}, {partner_id: ""}, function(err, doc){
		if(err) {
			console.log('err =', err);
			check.code = 0;
			check.message = err;
		}
		console.log('doc =', doc);
		if(doc){
			check.result = doc.trip_no;
		}
		else{
			check.code = 0;
			check.message = '실패';
		}

		res.json(check);
	});
});
// 여행 파트너 끊기

// 여행 리스트 조회
router.get('/list_trip', function(req, res, next){
	res.render('list_trip', {title : "list_trip"});
});

router.post('/list_trip', function(req, res, next){
	console.log('req body =', req.body);
	var id = req.session.user_id;
	//var id = req.body.id; 비회원일 경우 uuid나 토큰으로 저장

	var code = 1;
	var message = "OK";
	var result = {};
	var check = {
		code : code,
		message : message,
		result : result
	};

	TripModel.find({$or: [{ user_id: id }, { partner_id : id } ]}, null, {sort : {trip_no : -1}}, function(err, docs){
		if(err) return next(err);
		console.log('list docs =', docs);
		check.result = docs;
		res.json(check);  //json으로 하면 모바일이 된다.
		//res.render('list_trip', {title : "list_trip", docs : docs}); //웹서버
	});
});
// 여행 리스트 조회

// 여행 수정
router.get('/update_trip', function(req, res, next){
	res.render('update_trip', {title : "update_trip"});
});

router.post('/update_trip', function(req, res, next){
	console.log('req.body = ', req.body);

	var trip_no = req.body.trip_no;
	var trip_title = req.body.trip_title;
	var start_date = req.body.start_date;
	var end_date = req.body.end_date;
	var hashtag = req.body.hashtag;

	var code = 1;
	var message = "OK";
	var result = {};

	var check = {
		code : code,
		message : message,
		result : result
	};


	TripModel.updateOne({trip_no : trip_no}, {$set : {trip_title : trip_title, start_date : start_date, end_date : end_date, hashtag : hashtag}}, function(err, doc){
		if(err) {
			console.log('err =', err);
			check.code = 0;
			check.message = err;
		}
		if(doc){
			check.result = "수정 성공";

		}
		else{
			check.code = 0;
			check.message = '여행 수정 실패';
		}
		console.log('doc =', doc);
		res.json(check);
	});
});
// 여행 수정

// 여행 삭제
router.get('/delete_trip', function(req, res, next){
	res.render('delete_trip', {title : "delete_trip"});
});

router.post('/delete_trip', function(req, res, next){
	console.log('req.body = ', req.body);
	var trip_no = req.body.trip_no;
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
			check.result = "삭제 성공";

		}
		else{
			check.code = 0;
			check.message = '삭제 실패';
		}
		console.log('doc =', doc);
		res.json(check);
	});
});
// 여행 삭제

// 후보지 리스트 조회
router.get('/list_item', function(req, res, next){
	res.render('list_item', {title : "list_item"});
});

router.post('/list_item', function(req, res, next){
	console.log('req body =', req.body);
	var id = req.session.user_id;
	//var id = req.body.id; 비회원일 경우 uuid나 토큰으로 저장
	var trip_no = req.body.trip_no;
	var schedule_date = req.body.schedule_date;
	var code = 1;
	var message = "OK";
	var result = {};
	var check = {
		code : code,
		message : message,
		result : result
	};

	TripModel.findOne({$or: [{ trip_no: trip_no }, { schedule_date : schedule_date } ]}, null,
		{sort : {trip_no : -1}}, function(err, docs){
		if(err) return next(err);
		console.log('list docs =', docs);
		check.result = docs;
		res.json(check);  //json으로 하면 모바일이 된다.
		//res.render('list_trip', {title : "list_trip", docs : docs}); //웹서버
	});
});

// 후보지 리스트 조회


// 후보지 URL 단순 생성
router.get('/create_item_url', function(req, res, next){
	res.render('create_item_url', {title : "create_item_url"});
});

const day1 = moment('2017-08-14');
const day2 = moment('2017-08-17');

router.post('/create_trip', function(req, res, next){
	console.log('req body =', req.body);
	var id = req.session.user_id;
	//var id = req.body.id; 비회원일 경우 uuid나 토큰으로 저장
	var trip_title = req.body.trip_title;
	var start_date = req.body.start_date;
	var end_date = req.body.end_date;
	var user_id = id;
	var partner_id = req.body.partner_id;
	var hashtag = req.body.hashtag;
	var code = 1;
	var message = "OK";
	var result = {};

	var data = {
		trip_title : trip_title,
		start_date : start_date,
		end_date : end_date,
		user_id : user_id,
		partner_id : partner_id,
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


// 후보지 URL 단순 생성

module.exports = router;