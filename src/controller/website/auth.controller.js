const { errorRes, successRes } = require("../../config/app.response");
const { loginResponse } = require("../../config/login.response");
const jwt = require('jsonwebtoken');
const Customer = require("../../models/customers.model");
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

exports.registerCustomer = async (req, res) => {
    try {
         const {email, password} = req.body;
         const isEmailExists = await Customer.findOne({email}).countDocuments();
        //  if account already exists
        if(isEmailExists > 0) {
            return res.status(409).json(errorRes(
                409,
                "BAD REQUEST",
                "Account with this email already exists",
            ));
        }
        const customer = await Customer.create(req.body);
        res.status(200).json(successRes(
            200,
            "SUCCESS",
            "Account got created successfully!",
        ));
    } catch (error) {
        res.status(500).json(errorRes(
            500,
            "SERVER ERRORRR",
            error
        ));
    }
} 

exports.loginCustomer =  async (req, res) => {
    try {
        const {email, password} = req.body;
        const customer = await Customer.findOne({email}).select('+password +refreshToken');
        // User account exists?
        if(!customer) {
            return res.status(404).json(errorRes(
                404,
                "UNKNOWN ACCESS",
                "User with this credentials not exists"
            ))
        }
       
        // camparing password
        const isPasswordMatch = await customer.comparePassword(password);
        if(!isPasswordMatch) {
            return res.status(404).json(errorRes(
                404,
                "FAILED",
                "User credentials are incorrect"
            ));
        }

        const data = {
            fullName: customer.full_name,
            email: customer.email,
            createdAt: customer.createdAt,
            updatedAt: customer.updatedAt
        }
        loginResponse(res, customer, data, "User logged in successfully");
    } catch (error) {
        return res.status(500).json(errorRes(
            500,
            "SERVER ERROR",
            error
        ))
    }
}
// Todo: Logout Customer
exports.logoutUser = async (req, res) => {
    try {
        const updatedUser = await Customer.findByIdAndUpdate(
            req.customer._id,
            {
                $set: { refreshToken: "" }
            },
            { new: true }
        );
    
        if (!updatedUser) {
            return res.status(404).json(errorRes(404, "NOT FOUND", "Account not found"));
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
// Todo: Get customer profile
exports.getProfile = async (req, res) => {
    try {
        return res.status(200).json(successRes(
            200,
            "SUCCESS",
            "Profile details fetched successfully!",
            req.customer
        ));
    } catch(err) {
        return res.status(500).json(errorRes(
            500,
            "SERVER ERROR",
            err
        ));
    }
}
// Todo: Update Customer Profile
exports.updateProfile = async (req, res) => {
    try {
        const {email, new_password, current_password, ...updateData} = req.body;
        console.log(req.customer._id);
        const customer = await Customer.findById({_id: req.customer._id}).select('+password');
        if(new_password && current_password) {
            const isPasswordMatch = await customer.comparePassword(current_password);
            if(!isPasswordMatch) {
                return res.status(404).json(errorRes(
                    404,
                    "FAILED",
                    "Password didn't match!"
                ));
            }
            updateData.password = await bcrypt.hash(new_password, 8)
        }
        const updateUser = await Customer.updateOne({_id: req.customer.id}, updateData);
        if(!updateUser) {
            return res.status(409).json(errorRes(
                409,
                "UPDATE FAILED",
                "Failed to update profile!"
            ))
        }
        return res.status(200).json(successRes(
            200,
            "SUCCESS",
            "Profile details updated successfully",
        ))
    } catch (err) {
        return res.status(500).json(errorRes(
            500,
            "SERVER ERROR",
            err
        ))
    }
}
// Todo: Check refresh token validity
exports.isRefreshTokenValid = asyncHandler(async (req, res, next) => {
    try {
        // extracting refresh token from headers
        const token = req.cookies?.RefreshToken || req.headers.authorization?.split(' ')[1];
        if(!token) {
            return res.status(403).json(errorRes(
                403,
                "FORBIDDEN",
                "Access denied! no token provided"
            ))
        }
        // JWT token verification
        jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET_KEY, async(err, dec) => {
            if(err) {
                return res.status(401).json(errorRes(
                    401,
                    "TOKEN EXPIREDD",
                    // err
                    "Access denied! in-valid/expired token",
                    
                ));
            }
            const customer = await Customer.findById(dec.id).select("-password +refreshToken");
            if(!customer) {
                return res.status(403).json(errorRes(
                    403,
                    "UNKOWN ACCESS",
                    "Access denied! please logout & login again"
                ));
            }
            req.customer  = customer;
            req.refreshToken = token;
            next();
        });
    } catch(error) {
        return res.status(500).json(errorRes(
            500,
            "SERVER ERROR REFRESH TOKEN VALIDITY",
            error.message
        ));
    }
});
// Todo: Validating Refresh token & accessing a new token
exports.refreshToken = asyncHandler(async (req, res) => {
    try {
       const { customer, refreshToken } = req;
       if(!customer) {
            return  res.status(404).json(errorRes(
                    404,
                    "UNKOWN ACCESS",
                    "Account does not exist"
                ));
       }
       if(refreshToken !== customer?.refreshToken) {
           return  res.status(404).json(errorRes(
                404,
                "INVALID TOKEN",
                "Access Denined! Token validation failed",
            ));
       }
       loginResponse(res, customer, null, "Accesstoken refreshed successfuly!");
    } catch (error) {
        return res.status(200).json(errorRes(
            500,
            "SERVER ERROR REFRESH TOKEN",
            error.message
        ))
    }
});
// Todo: Middleware to authenticate user
exports.isAuthenticatedUser = asyncHandler(async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken  || req.headers.authorization?.split(' ')[1];  
        
        if(!token)
        {
            return res.status(403).json(
                errorRes(
                    403,
                    "FORBIDDEN",
                    "Access denied! No token provided"
                )
            )
        }
        
        // Verifying accesstoken
        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, dec) => {
            if(err) {
                return res.status(401).json(
                    errorRes(
                        401,
                        "TOKEN EXPIRED",
                        "Access denied! Please logout and login again!"
                    )
                )
            }
            const customer = await Customer.findById(dec.id).select('-password -refreshToken');
            if(!customer) {
                return res.status(404).json(
                    errorRes(
                        404,
                        "UNKOWN ACCESS",
                        "Access denied! Please logout and login again!"
                    )
                )
            }
            req.customer = customer;
            next();
        });
    } catch (error) {
        return res.status(500).json(errorRes(
            500,
            "SERVER ERRORR AUTHENTICATION",
            error
        ));
    }
});
