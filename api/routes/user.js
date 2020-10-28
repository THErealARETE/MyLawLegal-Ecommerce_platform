const express = require("express");
const router = express.Router();


const usercontrollers = require("../controllers/user");

router.post("/signup", usercontrollers.PostUserSignupController);

router.post("/login", usercontrollers.PostUserLoginController);

router.delete("/:adminId", usercontrollers.deleteUserController);

module.exports = router;
