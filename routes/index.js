var express = require('express');
var router = express.Router();
var moment = require('moment');
var bcrypt = require('bcrypt-node');
var UserModel = require('../models/user');
var TripModel = require('../models/trip');
var NoticeModel = require('../models/notice');
var FCM = require('fcm-push');
var serverKey = 'AAAAkn8Pa7w:APA91bFRQVUYGjvvugJokF6-yUAKUZM2sFFiprSqo-PFsPLvbDKZwShLnrls7X8GbzNkWufDz_MZuScFtzI1KfW5DoXvzRUBKZ5tAItKbfe-kM7oaztVmJdQ0Jgy151I9jLhSuu2PByO';
var fcm = new FCM(serverKey);


/* GET home page. */
router.get('/', function(req, res, next) {
  	res.render('index', { title: user_id });
});

//프로필 조회
router.get('/simple', function(req, res, next){
	res.render('simple', {title : "simple"});
});

router.post('/simple', function(req, res, next) {
	console.log('req.body =', req.body);
  	var id = req.body.user_id; //비회원일 경우 uuid나 토큰으로 저장

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
  		if(doc){
  			console.log('doc =', doc);
  			check.result = doc;
  		}
  		else{
  			check.code = 0;
  			check.message = '로그인 접속이 끊겼거나 아이디가 존재하지 않습니다.';
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

	UserModel.findOne({user_id : id}, function(err, doc){
		if(err) {
			console.log('err =', err);
			check.code = 0;
			check.message = err;
		}

		if(doc){
			console.log('doc =', doc);
			var hash = doc.user_pw;
			var login_data = bcrypt.compareSync(pw, hash);

			// 비밀번호 체크
			if(login_data){
				doc.user_yn = 0;
				check.result = doc;
			}
			else{
				check.code = 0;
				check.message = '비밀번호가 틀렸습니다.';
			} // 비밀번호 체크
		}
		else{
			check.code = 0;
			check.message = '아이디가 존재하지 않습니다.';
		}
		res.json(check);
	});
});
// 로그인

//로그아웃
/*router.post('/logout', function(req, res, next){
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
});*/
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
	//bcrypt 사용
	var hash = bcrypt.hashSync(user_pw);

	var code = 1;
	var message = "OK";
	var result = {};

	var data = {
		user_id : user_id,
		user_pw : hash,
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
	UserModel.findOne({user_id : user_id}, function(err, doc){
		if(err) {
			console.log('err =', err);
			check.code = 0;
			check.message = err;
			res.json(check);
		}
		if(doc){
			check.code = 0;
			check.message = '동일한 이메일 아이디가 존재합니다.';
			res.json(check);
		}
		else{
			user.save(function(err, doc){
				if(err){
					check.code = 0;
					check.message = err;
					return next(err);
				}
				console.log('doc =', doc);
				check.result = doc;
				res.json(check);
			});
		}
	});
});
//회원가입

// 비밀번호 찾기
router.get('/find_pw', function(req, res, next){
	res.render('find_pw', {title : "findpw"});
});

router.post('/find_pw', function(req, res, next){
	console.log('req.body =', req.body);
	var id = req.body.user_id; // 비회원일 경우 uuid나 토큰으로 저장

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
		if(doc){
			console.log('doc =', doc);
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
	var id = req.body.user_id; // 비회원일 경우 uuid나 토큰으로 저장
	var nick = req.body.user_nick;
	var user_pw = req.body.user_pw;

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
		if(doc){
			console.log('doc =', doc);
		}
		else{
			check.code = 0;
			check.message = '존재하지 아이디이거나 오류';
		}
		res.json(check);
	});
});
// 닉네임 설정

// 비밀번호 변경(1차 확인)
router.get('/check_pw', function(req, res, next){
	res.render('check_pw', {title : "check pw"});
});

router.post('/check_pw', function(req, res, next){
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

	UserModel.findOne({user_id : id}, function(err, doc){
		if(err) {
			console.log('err =', err);
			check.code = 0;
			check.message = err;
		}
		console.log('doc =', doc);
		var hash = doc.user_pw;
		var login_data = bcrypt.compareSync(pw, hash);
		// 비밀번호 체크
		if(login_data){
			doc.user_yn = 0;
		}
		else{
			check.code = 0;
			check.message = '비밀번호가 틀렸습니다.';
		}// 비밀번호 체크

		res.json(check);
	});
});
// 비밀번호 변경(1차 확인)

// 비밀번호 변경
router.get('/change_pw', function(req, res, next){
	res.render('change_pw', {title : "change pw"});
});

router.post('/change_pw', function(req, res, next){
	console.log('req.body =', req.body);
	var user_id = req.body.user_id; // 비회원일 경우 uuid나 토큰으로 저장
	var user_pw = req.body.user_pw;
	//bcrypt 사용
	var hash = bcrypt.hashSync(user_pw);

	var code = 1;
	var message = "OK";
	var result = {};
	var check = {
		code : code,
		message : message,
		result : result
	};

	UserModel.updateOne({user_id : user_id}, {$set : {user_pw : hash}}, function(err, doc){
		if(err) {
			console.log('err =', err);
			check.code = 0;
			check.message = err;
		}
		if(doc){
			console.log('doc =', doc);
		}
		else{
			check.code = 0;
			check.message = '로그인 접속 오류';
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
	var id = req.body.user_id; // 비회원일 경우 uuid나 토큰으로 저장

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
		if(doc){
			console.log('doc =', doc);
		}
		else{
			check.code = 0;
			check.message = '로그인 접속 오류';
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
	var id = req.body.user_id; // 비회원일 경우 uuid나 토큰으로 저장
	var trip_title = req.body.trip_title;
	var start_date = req.body.start_date;
	var end_date = req.body.end_date;
	var user_id = req.body.user_id;
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
			console.log('err =', err);
			check.code = 0;
			check.message = err;
		}

		if(doc){
			console.log('doc =', doc);
			var day1 = moment(start_date);
			var day2 = moment(end_date);
			var num = day2.diff(day1, 'days');
			for (var i = 0; i <= num; i++) {
				var scheduleDate = { schedule_date : i };
				TripModel.findOneAndUpdate({trip_no : doc.trip_no}, {$push : {"trip_list" : scheduleDate}},
					{safe : true, upsert : true, new : true}, function(err, doc){
					if(err) return next(err);
				});
			}
			check.result = doc;
		}
		else{
			check.code = 0;
			check.message = '여행생성 실패';
		}
		res.json(check);
	});
});
// 여행 생성

// 파트너 찾기
router.get('/find_partner', function(req, res, next){
	res.render('find_partner', {title : "find_partner"});
});

router.post('/find_partner', function(req, res, next){
	console.log('req body =', req.body);

	var user_id = req.body.user_id;
	var partner_id = req.body.partner_id;
	var code = 1;
	var message = "OK";
	var result = {};
	var check = {
		code : code,
		message : message,
		result : result
	};

	// 검색한 파트너가 자신과 동일할때
	if(user_id == partner_id){
		check.code = 0;
		check.message = "파트너는 자신을 제외한 사용자이어야 합니다.";
		res.json(check);
	};

	// 검색한 파트너가 자신과 동일하지 않을때
	if(user_id !== partner_id){
		UserModel.findOne({user_id : partner_id}, function(err, doc){
			if(err) {
				console.log('err =', err);
				check.code = 0;
				check.message = err;
			}
			if(doc){
				console.log('doc =', doc);
				check.result = doc;
			}
			else{
				check.code = 0;
				check.message = "아이디가 존재하지 않습니다.";
			}
			res.json(check);
		});
	}
});
// 파트너 찾기

// 여행 파트너 끊기
/*router.get('/cut_partner', function(req, res, next){
	res.render('cut_partner', {title : "cut_partner"});
});

router.post('/cut_partner', function(req, res, next){
	console.log('req.body =', req.body);
	var trip_no = req.body.trip_no;
	var	user_id = req.body.user_id;
	var stop = 1;
	var code = 1;
	var message = "OK";
	var result = [];
	var check = {
		code : code,
		message : message,
		result : result
	};
	TripModel.findOne({trip_no : trip_no}, function(err, doc){
		if(err) {
			console.log('err =', err);
			check.code = 0;
			check.message = err;
		}
		if(doc){
			console.log('doc =', doc);
			if(doc.user_id == user_id){
				TripModel.findOneAndUpdate({trip_no : trip_no}, {partner_id: null}, function(err, doc){
					if(err) {
						console.log('err =', err);
						check.code = 0;
						check.message = err;
					}
					if(doc){
						console.log('doc =', doc);
					}
					else{
						check.code = 0;
						check.message = '실패';
					}
					res.json(check);
				});
			}
			if(doc.partner_id == user_id){

			}
		}
		else{
			check.code = 0;
			check.message = '실패';
		}
	});
});*/
// 여행 파트너 끊기

// 여행 리스트 조회
router.get('/list_trip', function(req, res, next){
	res.render('list_trip', {title : "list_trip"});
});

router.post('/list_trip', function(req, res, next){
	console.log('req body =', req.body);
	var id = req.body.user_id; // 비회원일 경우 uuid나 토큰으로 저장

	var code = 1;
	var message = "OK";
	var result = {};
	var check = {
		code : code,
		message : message,
		result : result
	};

	TripModel.find({$or: [{ user_id: id }, { partner_id : id } ]}, null, {sort : {trip_no : -1}}, function(err, docs){
		var arr = {};
		if(err){
			console.log('err =', err);
			check.code = 0;
			check.message = err;
		}
		console.log('list docs =', docs);
		check.result = docs;
		res.json(check);
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
	var pre_start = '';
	var pre_end = '';

	var code = 1;
	var message = "OK";
	var result = {};
	var check = {
		code : code,
		message : message,
		result : result
	};

	TripModel.findOne({trip_no : trip_no}, function(err, doc){
		if(err){
			console.log('err =', err);
			check.code = 0;
			check.message = err;
		}
		console.log('doc =', doc);
		var num = doc.trip_list.length;
		var bStart = moment(doc.start_date);
		var bEnd = moment(doc.end_date);
		var bDays = bEnd.diff(bStart, 'days');

		var aStart = moment(start_date);
		var aEnd = moment(end_date);
		var aDays = aEnd.diff(aStart, 'days');
		// 수정한 여행일자와 현재 여행일자가 같을때
		if(bDays == aDays){
			TripModel.updateOne({trip_no : trip_no}, {$set : {trip_title : trip_title, start_date : start_date, end_date : end_date, hashtag : hashtag}}, function(err, doc){
				if(err) {
					console.log('err =', err);
					check.code = 0;
					check.message = err;
				}
				if(doc){
					console.log('doc =', doc);
				}
				else{
					check.code = 0;
					check.message = '여행 수정 실패';
				}

			});
		}

		// 수정한 여행일자와 현재 여행일자가 다를때
		else{
			TripModel.updateOne({trip_no : trip_no}, {$set : {trip_title : trip_title, start_date : start_date, end_date : end_date, hashtag : hashtag}}, function(err, doc){
				if(err) {
					console.log('err =', err);
					check.code = 0;
					check.message = err;
				}
				if(doc){
					console.log('doc =', doc);
				}
				else{
					check.code = 0;
					check.message = '여행 수정 실패';
				}
			});
			// 수정한 여행일자가 현재 여행일자보다 클 때
			if(bDays < aDays){
				var difference = aDays - bDays;
				for (var i = num; i <= num + difference - 1; i++) {
					var scheduleDate = { schedule_date : i };
					TripModel.findOneAndUpdate({trip_no : doc.trip_no}, {$push : {"trip_list" : scheduleDate}},
						{safe : true, upsert : true, new : true}, function(err, doc){
						if(err){
							check.code = 0;
							check.message = err;
							return next(err);
						}
					});
				}
			}
			// 수정한 여행일자가 현재 여행일자보다 작을 때
			if(bDays > aDays){
				TripModel.findOne({trip_no : doc.trip_no}, function(err, doc){
					if(err){
						check.code = 0;
						check.message = err;
						return next(err);
					}
					for (var i = num; i >= aDays + 1; i--) {
						console.log('i = ', i);
						doc.trip_list.splice(i, 1);
					}
					doc.save(function(err, result){
						if(err){
							check.code = 0;
							check.message = err;
							return next(err);
						}
					});
				});
			}
		}
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
	var result = [];
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
			console.log('doc =', doc);
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

// 후보지 URL 단순 생성
router.get('/create_item_url', function(req, res, next){
	res.render('create_item_url', {title : "create_item_url"});
});

router.post('/create_item_url', function(req, res, next){
	console.log('req body =', req.body);
	var user_id = req.body.user_id;
	var trip_no = req.body.trip_no;
	var schedule_date = req.body.schedule_date;
	var item_url = req.body.item_url;
	var user_token = '';
	var token = { user_token : user_token};

	var code = 1;
	var message = "OK";
	var result = {};
	var data = {
		item_url : item_url,
		item_lat : null,
		item_long : null,
		item_placeid : null,
		item_title : null,
		item_memo : null
	};

	var check = {
		code : code,
		message : message,
		result : result
	};

	TripModel.findOne({trip_no : trip_no, "trip_list.schedule_date" : schedule_date}, function(err, doc){
		if(err) {
			console.log('err =', err);
			check.code = 0;
			check.message = err;
		}
		if(user_id == doc.partner_id){

			console.log('파트너가 후보지 생성함');
			UserModel.findOne({user_id : user_id}, function(err, doc){
				if(err) {
					console.log('err =', err);
					check.code = 0;
					check.message = err;
				}
				console.log('토큰 값 찾기');
				console.log('doc =', doc);
				token.user_token = doc.user_token;
			});
			console.log('user_token =', token.user_token);
			var message = {
			    to: token.user_token,
			    collapse_key: 'test_collapse_key',
			    data: {
			        your_custom_data_key: 'test_custom_data_value'
			    },
			    notification: {
			        title: doc.partner_id + '님의 ' + '에 <후보지 제목>을 업로드하였습니다.',
			        body: doc.partner_id + '님이 ' + doc.trip_title + '에 <후보지 제목>을 업로드하였습니다.'
			    }
			};
			console.log('doc =', doc);
			for(var i = 0; i < doc.trip_list.length; i++) {
				if(doc.trip_list[i].schedule_date == schedule_date) {
					check.result = doc.trip_list[i];
					doc.trip_list[i].schedule_list.push(data);
				};
			};// for
			doc.save(function(err, result){
				if(err) console.log('err=', err);
				res.json(check);
			});
			fcm.send(message, function(err, response){
			    if (err) {
			        console.log("Push Fail!");
			    } else {
			        console.log("Push Success : ", response);
			        var notice_data = {
			        	notice_trip : trip_title,
			        	notice_partner : partner_id,
			        	notice_item : item_title
			        };
			        var notice = new NoticeModel(notice_data);
			        notice.save(function(err, doc){
			        	if(err) next(err);

			        });
			    }
			});
		}

		else{
			console.log('doc =', doc);
			for(var i = 0; i < doc.trip_list.length; i++) {
				if(doc.trip_list[i].schedule_date == schedule_date) {
					check.result = doc.trip_list[i];
					doc.trip_list[i].schedule_list.push(data);
				};
			};// for
			doc.save(function(err, result){
				if(err) console.log('err=', err);
				res.json(check);
			});
		}

	});
});
// 후보지 URL 단순 생성

// 후보지 기본 생성
router.get('/create_item', function(req, res, next){
	res.render('create_item', {title : "create_item"});
});

router.post('/create_item', function(req, res, next){
	console.log('req body =', req.body);
	var trip_no = req.body.trip_no;
	var schedule_date = req.body.schedule_date;
	var item_url = req.body.item_url;
	var cate_no = req.body.cate_no;
	var item_lat = req.body.item_lat;
	var item_long = req.body.item_long;
	var item_placeid = req.body.item_placeid;
	var item_title = req.body.item_title;
	var item_memo = req.body.item_memo;

	if(req.body.cate_no == ""){ // 입력하는 칸에 아무것도 입력하지 않았을 때
		var cate_no = 0;
	}
	else{ // 입력한 경우
		var cate_no = req.body.cate_no;
	}

	if(req.body.item_lat == ""){
		var item_lat = null;
	}
	else{
		var item_lat = req.body.item_lat;
	}

	if(req.body.item_long == ""){
		var item_long = null;
	}
	else{
 		var item_long = req.body.item_long;
	}

	if(req.body.item_placeid == ""){
		var item_placeid = null;
	}
	else{
		var item_placeid = req.body.item_placeid;
	}

	if(req.body.item_title == ""){
		var item_title = null;
	}
	else{
		var item_title = req.body.item_title;
	}

	if(req.body.item_memo == ""){
		var item_memo = null;
	}
	else{
		var item_memo = req.body.item_memo;
	}

	var code = 1;
	var message = "OK";
	var result = {};

	var data = {
		item_url : item_url,
		cate_no : cate_no,
		item_lat : item_lat,
		item_long : item_long,
		item_placeid : item_placeid,
		item_title : item_title,
		item_memo : item_memo
	};

	var check = {
		code : code,
		message : message,
		result : result
	};

	TripModel.findOne({trip_no : trip_no, "trip_list.schedule_date" : schedule_date}, function(err, doc){
		if(err) {
			console.log('err =', err);
			check.code = 0;
			check.message = err;
		}
		console.log('doc =', doc);
		for(var i = 0; i < doc.trip_list.length; i++) {
			if(doc.trip_list[i].schedule_date == schedule_date) {
				check.result = doc.trip_list[i];
				doc.trip_list[i].schedule_list.push(data);
			};
		};// for
		doc.save(function(err, result){
			if(err) console.log('err=', err);
			res.json(check);
		})
	});
});
// 후보지 기본 생성

// 후보지 지도 검색 생성
router.get('/create_item_map', function(req, res, next){
	res.render('create_item_map', {title : "create_item"});
});

router.post('/create_item_map', function(req, res, next){
	console.log('req body =', req.body);
	var trip_no = req.body.trip_no;
	var schedule_date = req.body.schedule_date;
 	var item_lat = req.body.item_lat;
 	var item_long = req.body.item_long;
 	var item_placeid = req.body.item_placeid;

	var code = 1;
	var message = "OK";
	var result = {};

	var data = {
		item_url : null,
		item_lat : item_lat,
		item_long : item_long,
		item_placeid : item_placeid,
		item_title : null,
		item_memo : null
	};

	var check = {
		code : code,
		message : message,
		result : result
	};

	TripModel.findOne({trip_no : trip_no, "trip_list.schedule_date" : schedule_date}, function(err, doc){
		if(err) {
			console.log('err =', err);
			check.code = 0;
			check.message = err;
		}
		console.log('doc =', doc);
		for(var i = 0; i < doc.trip_list.length; i++) {
			if(doc.trip_list[i].schedule_date == schedule_date) {
				check.result = doc.trip_list[i];
				doc.trip_list[i].schedule_list.push(data);
			};
		};// for
		doc.save(function(err, result){
			if(err) console.log('err=', err);
			res.json(check);
		})
	});
});
// 후보지 지도 검색 생성

// 후보지 리스트 조회
router.get('/list_item', function(req, res, next){
	res.render('list_item', {title : "list_item"});
});

router.post('/list_item', function(req, res, next){
	console.log('req body =', req.body);
	var trip_no = req.body.trip_no;
	var schedule_date = req.body.schedule_date;

	var code = 1;
	var message = "OK";
	var result = {};
	var arr = [];
	var check = {
		code : code,
		message : message,
		result : result
	};

	TripModel.findOne({trip_no : trip_no, "trip_list.schedule_date" : schedule_date}, function(err, doc){
		if(err) {
			console.log('err =', err);
			check.code = 0;
			check.message = err;
		}
		console.log('doc =', doc);
		arr = doc.trip_list[schedule_date].schedule_list;
		check.result = arr;
		res.json(check);
	});
});
// 후보지 리스트 조회

// 후보지 지도 조회
router.get('/map_item', function(req, res, next){
	res.render('map_item', {title : "map_item"});
});

router.post('/map_item', function(req, res, next){
	console.log('req body =', req.body);
	var trip_no = req.body.trip_no;
	var schedule_date = req.body.schedule_date;

	var code = 1;
	var message = "OK";
	var result = {};
	var arr = {};
	var check = {
		code : code,
		message : message,
		result : result
	};

	TripModel.findOne({trip_no : trip_no, "trip_list.schedule_date" : schedule_date}, function(err, doc){

		if(err) {
			check.code = 0;
			check.message = err;
			return next(err);
		}
		arr = doc.trip_list[schedule_date].schedule_list;
		console.log('doc =', doc);
		for(var i = arr.length - 1; i >= 0; i--) {
			if(arr[i].item_placeid == null){
				arr.splice(i, 1);
			}
		};
		check.result = arr;
		res.json(check);
	});
});
// 후보지 지도 조회

//후보지 수정
router.get('/update_item', function(req, res, next){
	res.render('update_item', {title : "update_item"});
});

router.post('/update_item', function(req, res, next){
	console.log('req body =', req.body);
	var _id =  req.body._id;
	//5995003689e021714ada80a9
	var trip_no = req.body.trip_no;
	var schedule_date = req.body.schedule_date;
	var cate_no = req.body.cate_no;
	var item_lat = req.body.item_lat;
	var item_long = req.body.item_long;
	var item_placeid = req.body.item_placeid;
	var item_title = req.body.item_title;
	var item_memo = req.body.item_memo;
	var item_check = req.body.item_check;
	var update_schedule_date = req.body.update_schedule_date;

	var code = 1;
	var message = "OK";
	var result = {};

	var check = {
		code : code,
		message : message,
		result : result
	};

	if(schedule_date !== update_schedule_date){
		TripModel.findOne({trip_no : trip_no, "trip_list.schedule_date" : schedule_date}, function(err, doc){
			var index = 0;
			var arr = {};
			if(err) {
				console.log('err =', err);
				check.code = 0;
				check.message = err;
			}
			console.log('doc =', doc);
			for(var i = 0; i < doc.trip_list.length; i++) {
				if(doc.trip_list[i].schedule_date == schedule_date) {
					for (var j = 0; j < doc.trip_list[i].schedule_list.length; j++) {
						if(doc.trip_list[i].schedule_list[j]._id == _id){
							index = j;
						}
					}
				};
			};// for
			for(var i = 0; i < doc.trip_list.length; i++) {
				if(doc.trip_list[i].schedule_date == schedule_date) {
					arr = doc.trip_list[i].schedule_list.splice(index, 1);
				};
			};// for
			for(var i = 0; i < doc.trip_list.length; i++) {
				if(doc.trip_list[i].schedule_date == update_schedule_date) {
					arr[0].cate_no = cate_no;
					arr[0].item_lat = item_lat;
					arr[0].item_long = item_long;
					arr[0].item_placeid = item_placeid;
					arr[0].item_title = item_title;
					arr[0].item_memo = item_memo;
					arr[0].item_check = item_check;
					doc.trip_list[i].schedule_list.push(arr[0]);
				};
			};// for
			doc.save(function(err, result){
				if(err) {
					console.log('err =', err);
					check.code = 0;
					check.message = err;
				}
				res.json(check);
			});
		});
	}
	else{
		TripModel.findOne({trip_no : trip_no, "trip_list.schedule_date" : schedule_date}, function(err, doc){
			if(err) {
				console.log('err =', err);
				check.code = 0;
				check.message = err;
			}
			console.log('doc =', doc);
			for(var i = 0; i < doc.trip_list.length; i++) {
				if(doc.trip_list[i].schedule_date == schedule_date) {
					for (var j = 0; j < doc.trip_list[i].schedule_list.length; j++) {
						if(doc.trip_list[i].schedule_list[j]._id == _id){
							doc.trip_list[i].schedule_list[j].cate_no = cate_no;
							doc.trip_list[i].schedule_list[j].item_lat = item_lat;
							doc.trip_list[i].schedule_list[j].item_long = item_long;
							doc.trip_list[i].schedule_list[j].item_placeid = item_placeid;
							doc.trip_list[i].schedule_list[j].item_title = item_title;
							doc.trip_list[i].schedule_list[j].item_memo = item_memo;
							doc.trip_list[i].schedule_list[j].item_check = item_check;
						}
					}
				};
			};// for
			doc.save(function(err, result){
				if(err) {
					console.log('err =', err);
					check.code = 0;
					check.message = err;
				}
				res.json(check);
			});
		});
	}
});
//후보지 수정

// 후보지 삭제
router.get('/delete_item', function(req, res, next){
	res.render('delete_item', {title : "delete_item"});
});

router.post('/delete_item', function(req, res, next){
	console.log('req body =', req.body);
	//var id = req.body.id; 비회원일 경우 uuid나 토큰으로 저장
	var _id =  req.body._id;
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

	TripModel.findOne({trip_no : trip_no, "trip_list.schedule_date" : schedule_date}, function(err, doc){
		var index = 0;
		if(err) {
			console.log('err =', err);
			check.code = 0;
			check.message = err;
		}
		console.log('doc =', doc);
		for(var i = 0; i < doc.trip_list.length; i++) {
			if(doc.trip_list[i].schedule_date == schedule_date) {
				for (var j = 0; j < doc.trip_list[i].schedule_list.length; j++) {
					if(doc.trip_list[i].schedule_list[j]._id == _id){
						index = j;
					}
				}
			};
		};// for

		for(var i = 0; i < doc.trip_list.length; i++) {
			if(doc.trip_list[i].schedule_date == schedule_date) {
				doc.trip_list[i].schedule_list.splice(index, 1);
			};
		};// for
		doc.save(function(err, result){
			if(err) {
				console.log('err =', err);
				check.code = 0;
				check.message = err;
			}
			res.json(check);
		});
	});
});
// 후보지 삭제

// 후보지 체크
router.get('/check_item', function(req, res, next){
	res.render('check_item', {title : "check_item"});
});

router.post('/check_item', function(req, res, next){
	console.log('req body =', req.body);
	var _id =  req.body._id;
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

	TripModel.findOne({trip_no : trip_no, "trip_list.schedule_date" : schedule_date}, function(err, doc){
		if(err) {
			console.log('err =', err);
			check.code = 0;
			check.message = err;
		}
		console.log('doc =', doc);
		for(var i = 0; i < doc.trip_list.length; i++) {
			if(doc.trip_list[i].schedule_date == schedule_date) {
				for (var j = 0; j < doc.trip_list[i].schedule_list.length; j++) {
					if(doc.trip_list[i].schedule_list[j]._id == _id){
						if(doc.trip_list[i].schedule_list[j].item_check == 1){
							doc.trip_list[i].schedule_list[j].item_check = 0;
						}
						else{
							doc.trip_list[i].schedule_list[j].item_check = 1;
						}
					}
				}
			};
		};// for
		doc.save(function(err, result){
			if(err) console.log('err=', err);
			res.json(check);
		});
	});
});
// 후보지 체크

// 최종일정 리스트 조회
router.get('/list_final', function(req, res, next){
	res.render('list_final', {title : "list_final"});
});

router.post('/list_final', function(req, res, next){
	console.log('req body =', req.body);

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

	TripModel.findOne({trip_no : trip_no, "trip_list.schedule_date" : schedule_date}, function(err, doc){
		var arr = {};
		if(err) {
			console.log('err =', err);
			check.code = 0;
			check.message = err;
		}
		console.log('doc =', doc);
		arr = doc.trip_list;
		for(var i = 0; i < arr.length; i++) {
			if(arr[i].schedule_date == schedule_date) {
				arr = arr[i];
			};
		};
		for(var i = arr.schedule_list.length - 1; i >= 0; i--) {
			if(arr.schedule_list[i].item_check == 0){
				arr.schedule_list.splice(i, 1);
			}
		};
		check.result = arr;
		res.json(check);
	});
});
// 최종일정 리스트 조회

// 최종일정 지도 조회
router.get('/map_final', function(req, res, next){
	res.render('map_final', {title : "list_final"});
});

router.post('/map_final', function(req, res, next){
	console.log('req body =', req.body);

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

	TripModel.findOne({trip_no : trip_no, "trip_list.schedule_date" : schedule_date}, function(err, doc){
		var arr = {};
		if(err) {
			console.log('err =', err);
			check.code = 0;
			check.message = err;
		}
		console.log('doc =', doc);
		arr = doc.trip_list;
		for(var i = 0; i < arr.length; i++) {
			if(arr[i].schedule_date == schedule_date) {
				arr = arr[i];
			};
		};
		for(var i = arr.schedule_list.length - 1; i >= 0; i--) {
			if(arr.schedule_list[i].item_check == 0){
				arr.schedule_list.splice(i, 1);
			}
		};
		check.result = arr;
		res.json(check);
	});
});
// 최종일정 지도 조회

// 최종일정 시간 입력
router.get('/time_final', function(req, res, next){
	res.render('time_final', {title : "time_final"});
});

router.post('/time_final', function(req, res, next){
	console.log('req body =', req.body);

	var _id =  req.body._id;
	//5995003689e021714ada80a9
	var trip_no = req.body.trip_no;
	var schedule_date = req.body.schedule_date;
	var item_time = req.body.item_time;

	var code = 1;
	var message = "OK";
	var result = {};

	var check = {
		code : code,
		message : message,
		result : result
	};

	TripModel.findOne({trip_no : trip_no, "trip_list.schedule_date" : schedule_date}, function(err, doc){
		if(err) {
			console.log('err =', err);
			check.code = 0;
			check.message = err;
		}
		console.log('doc =', doc);

		for(var i = 0; i < doc.trip_list.length; i++) {
			if(doc.trip_list[i].schedule_date == schedule_date) {
				for (var j = 0; j < doc.trip_list[i].schedule_list.length; j++) {
					if(doc.trip_list[i].schedule_list[j]._id == _id){
						doc.trip_list[i].schedule_list[j].item_time = item_time;
					}
				}
			};
		};// for
		doc.save(function(err, result){
			if(err) {
				console.log('err =', err);
				check.code = 0;
				check.message = err;
			}
			res.json(check);
		});
	});
});
// 최종일정 시간 입력

// 알림

// 알림
// express-validator 사용

////////////////////////////////////////////////////
//알림 디비 수정

/*	var notice = new NoticeModel(data);
	notice.save(function(err, doc){
		if(err){
			console.log('err =', err);
			return next(err);
		}
		console.log('notice data =', doc);
		res.json(check);
	});*/

//callback style
/*
var message = {
    to: doc.user_token,
    collapse_key: 'test_collapse_key',
    data: {
        your_custom_data_key: 'test_custom_data_value'
    },
    notification: {
        title: 'Title of your push notification',
        body: 'Body of your push notification'
    }
};




fcm.send(message, function(err, response){
    if (err) {
        console.log("Push Fail!");
    } else {
        console.log("Push Success : ", response);
        var notice_data = {
        	notice_trip : trip_title,
        	notice_partner : partner_id,
        	notice_item : item_title
        };
        var notice = new NoticeModel(notice_data);
        notice.save(function(err, doc){
        	if(err) next(err);

        });
    }
});*/
module.exports = router;