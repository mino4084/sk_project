// models/comment.js
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ItemSchema = new Schema({
	item_url :String,
	cate_no : { type : Number, default : 0, ref : 'Category' },
	item_lat : String,
	item_long : String,
	item_placeid : { type : Number, default : 0 },
	item_title : String,
	item_memo : String,
	item_check : { type : Number, default : 0 },
	item_time : String
});

module.exports = ItemSchema;