const mongoose = require('mongoose');
require("dotenv").config();
const connectionString = process.env.MONGO_URI;
const connectMongooDb = () => {
    try {
        const conn = mongoose.connect(connectionString)
        console.log("Database connected successfully");
    } catch (error) {
        console.log(error)
    }
}
module.exports = connectMongooDb;
