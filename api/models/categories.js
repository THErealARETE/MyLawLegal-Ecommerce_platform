const mongoose = require("mongoose");

const CategoriesSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: { type: String, required: true , unique: true},
	description: { type: String, required: true },
	product : {type: mongoose.Schema.Types.ObjectId , ref: 'Product'}

});


module.exports = mongoose.model("Categories", CategoriesSchema);
