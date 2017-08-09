// memo.js
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var MemoSchema = new Schema({
	memo_no : Number,
	memo_content : String
});

var Memo = db.model('Memo', MemoSchema);
module.exports = Memo;