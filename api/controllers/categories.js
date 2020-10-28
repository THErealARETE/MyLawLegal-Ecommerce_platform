const mongoose = require("mongoose");
const Categories = require("../models/categories");


exports.GETRequestForAllCategories = (req,res,next) => {
     	Categories.find()
				.select("name description products _id")
				.exec()
				.then((doc) => {
					console.log("GET for all the categories", doc);
					const response = {
						count: "yoy have " +doc.length + " categories" ,
						categories: doc.map((docs) => {
							return {
								// ...docs,
								name: docs.name,
								description: docs.description,
								_id: docs._id,
								request: {
									type: "GET",
									url: "https://limitless-earth-51432.herokuapp.com/categories/" + docs._id,
								},
							};
						}),
					};
					res.status(200).json(response);
				})
				.catch((err) => {
					console.log(err);
					res.status(500).json({ error: err });
				});
}

exports.GETRequestForASpecificCategory = (req, res, next) => {
	const id = req.params.ID;
	Categories.findById(id)
		.select("name description products _id")
		.exec()
		.then((result) => {
			console.log("from database", result);
			if (result) {
				res.status(200).json({ message: result });
			} else {
				res
					.status(404)
					.json({ message: "no valid entry found in database with this id" });
			}
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ error });
		});
};

exports.POSTRequestForNewCategory = (req, res, next) => {
	const category = new Categories({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		description: req.body.description,
		products: req.body.productsId,
	});
	// saving new category object and attaching a promise to it
	category
		.save()
		.then((newCategory) => {
			console.log("new POST request", {
				name: newCategory.name,
				description: newCategory.description,
				products: newCategory.products,
				_id: newCategory._id,
				request: {
					type: "GET",
					url: "https://limitless-earth-51432.herokuapp.com/categories/" + newCategory._id,
				},
			});
			res.status(200).json({
                message: "here is your new category",
                newCategory});
		})
		.catch((err) => {
			console.log("the POST error", err);
			res.status(500).json({
				error: err,
			});
		});
};


exports.PATCHRequestForAnExistingCategory = (req, res, next) => {
	const id = req.params.ID;
	const updateOps = {};
	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}
	Categories.update({ _id: id }, { $set: updateOps })
		.exec()
		.then((doc) => {
			console.log(doc);
			res.status(200).json({
                message: "category update successful",
                doc});
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ error });
		});
};

exports.DELETERequestForCategory = (req, res, next) => {
	const id = req.params.ID;
	Categories.remove({ _id: id })
		.exec()
		.then((result) => {
			res.status(200).json({
                message: "category deleted successfully",
                result});
		})
		.catch((error) => {
			console.log("error on delete request", error);
			error;
		});
};