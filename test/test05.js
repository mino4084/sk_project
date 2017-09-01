// test05.js

/*var date = new Date();
date = formatDate(date)

console.log('date = ', date);

function formatDate(date){
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var i = date.getMinutes();
	var s = date.getSeconds();
	// yyyy-MM-dd hh:mm:ss 형태
	var day = y + '-' + (m > 9 ? m : "0" + m) + '-' + (d > 9 ? d : "0" + d) + ' ' + (h > 9 ? h : "0" + h) + ':' + (i > 9 ? i : "0" + i) + ':' + (s > 9 ? s : "0" + s);
	return day;
};*/
/*var moment = require('moment');
var m = moment();
var output = m.format("YYYY년MM월DD일 HH:mm:ss dddd");
console.log('output =', output);*/

var moment = require('moment-timezone');
var m = moment().tz("Asia/Seoul").format("YYYY년MM월DD일 HH:mm:ss");
console.log('m =', m);