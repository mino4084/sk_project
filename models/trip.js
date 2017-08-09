// trip.js
var mongoose = require('mongoose');
var db = require('./db');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Candidate = require('./candidate');

var TripSchema = new Schema({
	trip_no : Number,
	trip_title : String,
	start_date : { type : Date, default : Date.now },
	end_date : { type : Date, default : Date.now },
    user_no : { type : Number, ref : 'User' },
    partner_no : { type : Number, ref : 'User' },
    hashtag : { type : String, default : ' '},
    trip_list : [ Candidate ]
});
var Trip = db.model('Trip', TripSchema);
module.exports = Trip;