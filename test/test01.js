var moment = require('moment');


var day1 = moment('2017-08-01');
var day2 = moment('2017-08-05');
schedule = day2.diff(day1, 'days');
console.log('schedule =', schedule);