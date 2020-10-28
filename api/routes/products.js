const express = require("express");
const router = express.Router();
const multer = require('multer')
const checkAuth = require('../check-auth/check-auth-as-admin')


const ordersController = require('../controllers/products')


const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./uploads/");
	},
	filename: function (req, file, cb) {
		cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
	},
});

const fileFilter = (req, file, cb) => {
	// reject a file
	if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 3,
	},
	fileFilter: fileFilter,
});


// get request for all products
router.get("/", ordersController.productsGetAll );

//get request for specific product	
router.get("/:ID", ordersController.getProductsById);


//get request for products in a specific category
 router.get('/category/:categoryOf' , ordersController.GETRequstForProductsInACategory)

//post request for a new product
router.post("/",checkAuth , upload.single('productImage'), ordersController.PostRequestForProducts);

//patch request for specific product
router.patch("/:ID", checkAuth, ordersController.PatchRequestForProducts);

// delete request for a specific product
router.delete("/:ID", checkAuth, ordersController.deleteRequestForProducts);

module.exports = router;
