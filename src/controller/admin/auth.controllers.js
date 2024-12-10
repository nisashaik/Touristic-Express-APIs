const { errorRes, successRes } = require("../../config/app.response");
const { loginResponse } = require("../../config/login.response");
const User = require("../../models/admin/user.model");
const asyncHandler = require('express-async-handler')
// Todo: Create a new uesr
exports.registerUser  = async (req, res) => {
    try {
        const { userName, email } = req.body;
        const isUnameExists = await User.findOne({ userName});
        const isEmailExists = await User.findOne({ email });
        // check for username existance
        if(isUnameExists) {
            return res.status(409).json(errorRes(
                409,
                "BAD REQUEST",
                "User name already exists"
            ));
        }
        // check for email existance
        if(isEmailExists) {
            return res.status(409).json(errorRes(
                409,
                "BAD REQUEST",
                "Email already exists"
            ));
        }
        const user = await User.create(req.body);
        res.status(200).json(successRes(
            200,
            "SUCCESS",
            "User created successfully!",
            {
                userName: user.userName,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,
            }
        ));
    } catch (error) {
        res.status(500).json(errorRes(
            500,
            "SERVER ERRORRR",
            error
        ));
    }
}
// Todo: Authenticate User
exports.loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email}).select('+password +refreshToken');
        if(!user) {
            return res.status(404).json(errorRes(
                404,
                "UNKNOWN ACCESS",
                "User with this credentials not exists"
            ));
        }
        // camparing password
        const isPasswordMatch = await user.comparePassword(password);
        if(!isPasswordMatch) {
            return res.status(404).json(errorRes(
                404,
                "FAILED",
                "User credentials are incorrect"
            ));
        }
        const data = {
            userName: user.userName,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
        loginResponse(res, user, data, "User logged in successfully");
    } catch(error) {
        return res.status(500).json(errorRes(
            500,
            "SERVER ERRORR",
            error
        ))
    }
}

// Todo: Logout User
exports.logoutUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: { refreshToken: "" }
            },
            { new: true }
        );
    
        if (!updatedUser) {
            return res.status(404).json(errorRes(404, "NOT FOUND", "User not found"));
        }
    
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict'
        };
        return res
            .status(200)
            .clearCookie('AccessToken', options)
            .clearCookie('RefreshToken', options)
            .json(successRes(200, "SUCCESS", "Logged Out"));
    } catch (error) {
        console.error("Error resetting refresh token:", error); // Log the error
        return res.status(500).json(errorRes(500, "SERVER ERROR", error.message));
    }
};

// Todo: Validating Refresh token & accessing a new token
exports.refreshToken = asyncHandler(async (req, res) => {
    try {
       const { user, refreshToken } = req;
       if(!user) {
            return  res.status(404).json(errorRes(
                    404,
                    "UNKOWN ACCESS",
                    "User does not exist"
                ));
       }
       if(refreshToken !== user?.refreshToken) {
           return  res.status(404).json(errorRes(
                404,
                "INVALID TOKEN",
                "Access Denined! Token validation failed",
            ));
       }
       loginResponse(res, user, null, "Accesstoken refreshed successfuly!");
    } catch (error) {
        return res.status(200).json(errorRes(
            500,
            "SERVER ERROR REFRESH TOKEN",
            error.message
        ))
    }
});

