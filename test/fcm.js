
/*
 * GET home page.
 */
var FCM = require('fcm').FCM;
var apiKey = 'AAAAApY-fKs:APA91bFiNW_RPPDNJg4W3J4kVaTZUDezHsQYCPoR21ebrcQs38auq7Xh1Dp3DLdeqRBSUQJ3PziltPCy1ggfVXuY7w17J9e11KvTWHnNwCe2IM-u3AM4yhmbKXLaSbI6bgW8YnUkcD_N';
var fcm = new FCM(apiKey);

exports.index = function(req, res){
  res.render('index', { title: 'Push Server' });
};

exports.sendPush = function(req, res){
  console.log(req.body.token, req.body.msg);

// FCM =========================================================
  // 메시지 구성
  var message =
  {   // 유저의 등록된 ID -> 푸시를 받고자 하는 유저 ID -> 유저의 token
      registration_id: req.body.token, // required
      collapse_key: '' + Math.floor(Math.random()*1000),
      data:JSON.stringify({body:req.body.msg, title:req.body.title})
  };
  // 전송
  fcm.send(message, function(err, messageId){
	  res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
      if (err) {
    	  res.end("<script>alert('전송실패:"+err+"');history.back();</script>");
          //console.log("Something has gone wrong!");
      } else {
    	  res.end("<script>alert('전송성공:"+messageId+"');history.back();</script>");
          //console.log("Sent with message ID: ", messageId);
      }
  });
//FCM =========================================================
};
