const express = require("express");
const bodyParser = require("body-parser");
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
app.get('/', testController);

// Admin Routes
app.use('/api/v1', adminAuthRoutes);
// Admin other routes
app.use('/api/v1', adminRoutes);
// Frontend Routes
app.use('/api/v1', websiteRoutes);

// route not found handler
app.use(routeNotFound)

// server error handler
app.use(errorHandler);

// default export ~ app
module.exports = app;