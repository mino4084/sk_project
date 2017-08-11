// trip.js
var mongoose = require('mongoose');
var db = require('./db');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(db);

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Candidate = require('./candidate');

var TripSchema = new Schema({
	trip_title : String,
	start_date : { type : Date, default : Date.now },
	end_date : { type : Date, default : Date.now },
    user_id : String,
    partner_id : String,
    hashtag : String,
    trip_list : [ Candidate ]
});

TripSchema.virtual('start_date')
	.get(function(){
		return formatDate(this.start_date);
	});
TripSchema.virtual('end_date')
	.get(function(){
		return formatDate(this.end_date);
	});

TripSchema.set('toJSON', { virtuals : true });

TripSchema.plugin(autoIncrement.plugin, { model : 'Trip', field : 'trip_no', startAt : 1, incrementBy : 1});

var Trip = db.model('Trip', TripSchema);
module.exports = Trip;

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
};