const Product = require("../models/products");
const Categories = require("../models/categories");
const mongoose = require("mongoose");
var ObjectId = require("mongodb").ObjectID;


exports.productsGetAll = (req, res, next) => {
	Product.find().select('name quantity category productImage price _id').populate('category' , 'name')
	.exec() 
	.then(doc =>{
		console.log("GET for all the products" ,doc);
		const response = {
			count : doc.length , 
			products: doc.map(docs=>{
				return {
					// ...doc ,
					productImage: docs.productImage , 
					category: docs.category,
					name: docs.name , 
					price: docs.price, 
					_id: docs._id, 
					request: {
						type: 'GET',
						url: "http://localhost:3000/products/" + docs._id
					}
				}
			})
		}
		res.status(200).json(response)
	})
	.catch( err =>{
		console.log(err);
		res.status(500).json({error: err})
	})
}

exports.getProductsById = (req, res, next) => {
	const id = req.params.ID;
	Product.findById(id)
		.populate("category")
		.select("name quantity category productImage price _id")
		.exec()
		.then((result) => {
			console.log("from database", result);
			if (result) {
				res.status(200).json({ message: result });
			} else {
				res
					.status(404)
					.json({ message: "no valid entry found in database ith thi id" });
			}
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ error });
		});
};

exports.GETRequstForProductsInACategory = (req, res, next) => {
	//  const categoryId = req.params.category;
	const name = req.params.categoryOf;
	Product.find({ category: ObjectId(name) })
		.exec()
		.then((result) => {
			console.log("from database", result);
			if (result) {
				res.status(200).json({
					count: result.length,
					products: result.map((individualResult) => {
						return {
							// ...doc ,
							// category: result.category,
							name: individualResult.name,
							price: individualResult.price,
							quantity: individualResult.quantity,
							_id: individualResult._id,
							request: {
								type: "GET",
								url: "http://localhost:3000/products/" + individualResult._id,
							},
						};
					}),
				});
			} else {
				res.status(404).json({
					message: "no valid entry found in database with this id",
				});
			}
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ error });
		});
};


exports.PostRequestForProducts = (req, res, next) => {
	console.log(req.file);
	Categories.findById(req.body.categoryId).then((category) => {
		//model call for creating new object
		if (!category) {
			return res.status(404).json({
				message: "category doesn't exist",
			});
		}
		const product = new Product({
			_id: new mongoose.Types.ObjectId(),
			name: req.body.name,
			price: req.body.price,
			quantity: req.body.quantity,
			productImage: req.file.path,
			category: req.body.categoryId,
		});
		// saving new product object and attaching a promise to it
		return product
			.save()
			.then((result) => {
				console.log("new post request", {
					name: result.name,
					price: result.price,
					category: result.category,
					quantity: result.quantity,
					_id: result._id,
					request: {
						type: "GET",
						url: "http://localhost:3000/products/" + result._id,
					},
				});
				res.status(200).json({
					name: result.name,
					price: result.price,
					// productImage: productImage,
					category: result.category,
					quantity: result.quantity,
					_id: result._id,
					request: {
						type: "GET",
						url: "http://localhost:3000/products/" + result._id,
					},
				});
			})
			.catch((err) => {
				console.log("the post error", err);
				res.status(500).json({
					error: err,
				});
			});
	});
};

exports.PatchRequestForProducts = (req, res, next) => {
	const id = req.params.ID;
	const updateOps = {};
	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}
	Product.update({ _id: id }, { $set: updateOps })
		.exec()
		.then((doc) => {
			console.log(doc);
			res.status(200).json({
                message: "update was successful", 
                doc});
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ error });
		});
};

exports.deleteRequestForProducts = (req, res, next) => {
	const id = req.params.ID;
	Product.deleteOne({ _id: id })
		.exec()
		.then((result) => {
			res.status(200).json({
                message: "successfully deleted product",
                result});
		})
		.catch((error) => {
			console.log("error on delete request", error);
			error;
		});
};