// db.js
var mongoose = require('mongoose');
var uri = 'mongodb://localhost/project'
var options = {
	server : { poolSize : 100 }
};
var db = mongoose.createConnection(uri, options);

db.once('open', function(){
	console.log('MongoDB Connect');
});

db.on('error', function(err){
	if(err) return console.log('db err =', err);
});

module.exports = db;