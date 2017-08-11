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
	start_date : String,
	end_date : String,
    user_id : String,
    partner_id : String,
    hashtag : String,
    trip_list : [ Candidate ]
});


TripSchema.plugin(autoIncrement.plugin, { model : 'Trip', field : 'trip_no', startAt : 1, incrementBy : 1});

var Trip = db.model('Trip', TripSchema);
module.exports = Trip;


