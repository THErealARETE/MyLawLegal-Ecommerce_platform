const Admin = require("../models/admin");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



exports.PostAdminSignupController = (req, res, next) => {
	Admin.find({ email: req.body.email })
		.exec()
		.then((admin) => {
			if (admin.length >= 1) {
				return res.status(409).json({
					message: "Mail exists",
				});
			} else {
				bcrypt.hash(req.body.password, 10, (err, hash) => {
					if (err) {
						return res.status(500).json({
							error: err,
						});
					} else {
						const admin = new Admin({
							_id: new mongoose.Types.ObjectId(),
							email: req.body.email,
							password: hash,
						});
						admin
							.save()
							.then((result) => {
								console.log(result);
								res.status(201).json({
									message: "Admin created",
								});
							})
							.catch((err) => {
								console.log(err);
								res.status(500).json({
									error: err,
								});
							});
					}
				});
			}
		});
};


exports.PostAdminLoginController = (req, res, next) => {
	Admin.find({ email: req.body.email })
		.exec()
		.then((admin) => {
			if (admin.length < 1) {
				return res.status(401).json({
					message: "Unauthorized ",
				});
			}
			bcrypt.compare(req.body.password, admin[0].password, (err, result) => {
				if (err) {
					return res.status(401).json({
						message: "The password is wrong",
					});
				}
				if (result) {
					const token = jwt.sign(
						{
							email: admin[0].email,
							adminId: admin[0]._id,
						},
						process.env.JWT_KEY,
						{
							expiresIn: "1h",
						}
					);
					return res.status(200).json({
						message: "Login successful as Admin",
						token: token,
					});
				}
				res.status(401).json({
					message: "Login failed",
				});
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err,
			});
		});
};


exports.deleteAdminController = (req, res, next) => {
	Admin.remove({ _id: req.params.adminId })
		.exec()
		.then((result) => {
			res.status(200).json({
				message: "Admin deleted",
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err,
			});
		});
};