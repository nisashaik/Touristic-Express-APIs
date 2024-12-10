const mongoose = require('mongoose');
const validtor = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { errorRes } = require('../../config/app.response');
const usersSchema = new mongoose.Schema({
    userName: {
        type: String,
        trim: true,
        lowercase: true,
        required: [true, "User name field is required"]
    },
    fullName: {
        type: String,
        trim: true,
        required: [true, "Full name field is required"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email field is requierd"],
        validate: [validtor.isEmail, "Please enter a valid email address"]
    },
    phone: {
        type: String,
        unique: true,
        validate: [validtor.isMobilePhone, "Please enter a valid phone number"]
    },
    password: {
        type: String,
        required: [true, "Password field is required"],
        minLength: [6, "Password must be at leat 6 characters long"],
        select: false
    },
    refreshToken: {
        type: String,
        select: false
    },
    role: {
        type: String,
        required: [true, "Role field is required"]
    }
    }, {
    timestamps: true
    });
// replacing space from username
usersSchema.pre('save', function (next) {
    if (this.userName)
        this.userName = this.userName.replace(/\s/g, '-');
    next();
});
// if changed saving new password
usersSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        next();
    this.password = await bcrypt.hash(this.password, 8);
});

// JWT access token
usersSchema.methods.getJwtWebToken = function()  {
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES
    });
}

// JWT refresh token
usersSchema.methods.getJwtRefreshToken = function()  {
    return jwt.sign({id: this._id}, process.env.JWT_REFRESH_TOKEN_SECRET_KEY, {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES
    });
}

// update refresh token
usersSchema.methods.updateJwtRefreshTokenToDb = async function() {
    try {
        this.refreshToken = this.getJwtRefreshToken();
        await this.save({ validateBeforeSave: false });
    } catch (error) {
        return errorRes(500, "SERVER ERROR", error);
    }
}

// camparing passowrd
usersSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
}

module.exports = mongoose.model("Users", usersSchema);