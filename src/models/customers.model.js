const mongoose = require('mongoose');
const validtor = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { errorRes } = require('../config/app.response');
const customersSchema = new mongoose.Schema({
    full_name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email field is requierd"],
        validate: [validtor.isEmail, "Please enter a valid email address"]
    },
    phone: {
        type: String,
        validate: [validtor.isMobilePhone, "Please enter a valid phone number"]
    },
    password: {
        type: String,
        required: [true, "Password field is required"],
        minLength: [6, "Password must be at leat 6 characters long"],
        select: false
    },
    address_1: {
        type: String,
        trim: true,
    },
    address_2: {
        type: String,
        trim: true
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    postalCode: {
        type: String,
    },
    profileImage: {
        type: String,
    },
    refreshToken: {
        type: String,
        select: false
    },
    email_verified: {
        type: Date,
    }
    }, {
    timestamps: true
});
// If changed saving a new password
customersSchema.pre('save', async function(next) {
    if(!this.isModified('password')) 
        next();
    this.password = await bcrypt.hash(this.password, 8)
})
// JWT access token
customersSchema.methods.getJwtWebToken = function()  {
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES
    });
}
// JWT refresh token
customersSchema.methods.getJwtRefreshToken = function()  {
    return jwt.sign({id: this._id}, process.env.JWT_REFRESH_TOKEN_SECRET_KEY, {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES
    });
}
// update refresh token
customersSchema.methods.updateJwtRefreshTokenToDb = async function() {
    try {
        this.refreshToken = this.getJwtRefreshToken();
        await this.save({ validateBeforeSave: false });
    } catch (error) {
        return errorRes(500, "SERVER ERROR", error);
    }
}
// camparing passowrd
customersSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
}
module.exports = mongoose.model("Customers", customersSchema);