// models/comment.js
var mongoose = require('mongoose');


var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Memo = require('./memo');

var ItemSchema = new Schema({
	item_no : Number,
	item_url :String,
	cate_no : { type : Number, ref : 'Category' },
	latitude : String,
	longitude : String,
	item_location : String,
	item_title : String,
	item_memo : [ Memo ],
	my_check : { type : Number, default : 0 },
	your_check : { type : Number, default : 0 },
	final_status : Boolean,
	item_time : String
});

var Item = db.model('Item', ItemSchema);
module.exports = Item;