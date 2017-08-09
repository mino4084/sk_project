// category.js
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CategorySchema = new Schema({
	cate_no : Number,
	cate_name : String
});

var Category = db.model('Category', CategorySchema);
module.exports = Category;