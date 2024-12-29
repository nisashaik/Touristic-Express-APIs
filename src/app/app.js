const express = require("express");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary").v2;
const cookieParser = require("cookie-parser");
const crossOrigin = require("cors");
const env = require("dotenv");

const corsOptions = require("../config/cors.config");
const { routeNotFound, errorHandler } = require("../middleware/error.handler");
const adminAuthRoutes = require('../routes/admin/auth.routes');
const adminRoutes = require('../routes/admin/admin.routes');
const websiteRoutes = require('../routes/website/website.routes');
const testController = require("../controller/testController");
// initialize express app
const app = express();

// load environment varaibles from env config
env.config(); 
// connect to database
const connectMongooDb = require("../config/db.config");
connectMongooDb();

// Cloudinary Configurations
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// allow corss origin request sharing
app.use(crossOrigin(corsOptions))

// parse cookies from request
app.use(cookieParser());

// parse body from request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// parser only request that has content-Type ~ application/json 
app.use(express.json({limit: '10mb'}));

// parse request of content-Type ~ application/x-www-form-urlencoded
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// sets static folder
app.use(express.static('public'));
// Default Route
const BASE_URI = process.env.APP_STATE == 'production' ? process.env.BASE_URI_PROD : process.env.BASE_URI_DEV;
app.get(BASE_URI, testController);

// Admin Routes
app.use(`${BASE_URI}api/v1`, adminAuthRoutes);
// Admin other routes
app.use(`${BASE_URI}api/v1`, adminRoutes);
// Frontend Routes
app.use(`${BASE_URI}api/v1`, websiteRoutes);

// route not found handler
app.use(routeNotFound)

// server error handler
app.use(errorHandler);

// default export ~ app
module.exports = app;