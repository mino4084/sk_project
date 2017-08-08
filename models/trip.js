/*// users.js
var mongoose = require('mongoose');
var db = require('./db');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Candidate = require('./candidate');

var TripSchema = new Schema({
	trip_title : String,
	start_date : { type : Date, default : Date.now },
	end_date : { type : Date, default : Date.now },
    user_id : String,
    partner_id : String,
    hashtag : { type : String, default : ' '},
    trip_list : [ Candidate ]
});

var TripModel = db.model('Trip', TripSchema);

module.exports = TripModel;*/