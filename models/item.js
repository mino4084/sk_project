// models/comment.js
var mongoose = require('mongoose');
var db = require('./db');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(db);

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ItemSchema = new Schema({
	item_no : Number,
	item_url :String,
	cate_no : { type : Number, default : 0, ref : 'Category' },
	item_lat : String,
	item_long : String,
	item_placeid : String,
	item_title : String,
	item_memo : String,
	item_check : { type : Number, default : 0 },
	item_time : String
});

ItemSchema.plugin(autoIncrement.plugin, { model : 'Item', field : 'item_no', startAt : 1, incrementBy : 1});
module.exports = ItemSchema;