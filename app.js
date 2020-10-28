// initial import of express and an instance of express as app
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
require("dotenv").config();

// require the new routes
const categoriesRoute = require('./api/routes/categories')
const productsRoute = require('./api/routes/products')
const adminRoute = require('./api/routes/admin')
const userRoute = require('./api/routes/user')

//define the route links
const apiCategories = '/categories'
const apiProducts = '/products'
const apiAdmin = '/admin'
const apiUser = '/user'
const apiDefault = '/'

// morgan for seeing call to route
app.use(morgan('dev'))

// makes the upload folder available to everyone
app.use('/uploads', express.static('uploads'))

//body parser for making incoming request readable                                                       
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


mongoose.connect(
	"mongodb+srv://node-project:" +
		process.env.MONGO_ATLAS_PW +
		"@cluster0.o8j8n.mongodb.net/<dbname>?retryWrites=true&w=majority",
	{ useNewUrlParser: true , useUnifiedTopology: true,  useCreateIndex: true }
);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*' ) 
    res.header( 
        'Access-Control-Allow-Request', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization '
    )
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT,POST,DELETE,GET,PATCH')   
        return res.status(200).json({})                                                   
    }

    next()
})


//use both the links and the routes in the app
app.use(apiCategories ,categoriesRoute)
app.use(apiProducts , productsRoute)
app.use(apiAdmin , adminRoute)
app.use(apiUser,userRoute )

// home page
app.use("/", (req, res, next) => {
	res.status(200).json({
        message1 :"Welcome to MyLawLegal ECommerce Assesment Project ",
        message2:   " Some available routes are /products, /categories/ user etc"
    })
});
// error handeling 
app.use((req,res,next)=>{
    const error = new Error('not found')
    error.status = 400
    next(error)
})

app.use((error, req, res, next ) =>{
    res.status(error.status || 500)
    res.json({
        error : {
            message: error.message
        }
    })
})

//export the app out 
module.exports = app 