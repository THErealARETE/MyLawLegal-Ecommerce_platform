const express = require('express');
const router = express.Router()
const mongoose = require('mongoose');
const Categories = require('../models/categories')
const checkAuth = require("../check-auth/check-auth-as-admin");

const categoriesController = require('../controllers/categories')


// get request for all categories
 router.get('/' , categoriesController.GETRequestForAllCategories)   

//get request for specific category
 router.get('/:ID' , categoriesController.GETRequestForASpecificCategory)
 


//post request for a new category
 router.post("/", checkAuth, categoriesController.POSTRequestForNewCategory);


//patch request for specific category
 router.patch('/:ID' , checkAuth, categoriesController.PATCHRequestForAnExistingCategory)


    // delete request for a specific category 
 router.delete("/:ID", checkAuth, categoriesController.DELETERequestForCategory);    

module.exports = router