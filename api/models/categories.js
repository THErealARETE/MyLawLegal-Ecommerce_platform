const mongoose = require("mongoose");

// schema is like the layout of the object for that ish
const CategoriesSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: { type: String, required: true , unique: true},
	description: { type: String, required: true },
	product : {type: mongoose.Schema.Types.ObjectId , ref: 'Product'}
	// name: { type: String, required: true },
	// price: { type: Number, required: true },
});

//model is the object is self or some sort of constructor

module.exports = mongoose.model("Categories", CategoriesSchema);
