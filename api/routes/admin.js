const express = require("express");
const router = express.Router();   

const admincontrollers = require("../controllers/admin");

router.post("/signup", admincontrollers.PostAdminSignupController);


router.post("/login", admincontrollers.PostAdminLoginController);

router.delete("/:adminId", admincontrollers.deleteAdminController);


module.exports = router;