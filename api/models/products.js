const mongoose = require('mongoose')


// schema is like the layout of the object for that ish
const productSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: { type: String, required: true },
	price: { type: Number, required: true },
    quantity: { type: Number, required: true , default: 1},
    productImage: {type: String },
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Categories",
		required: true,
	},
});      

//model is the object is self or some sort of constructor

module.exports = mongoose.model('Product', productSchema)
