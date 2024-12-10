const jwt = require('jsonwebtoken');
const User = require('../../models/admin/user.model');
const { errorRes, successRes } = require('../../config/app.response');
const asyncHandler = require('express-async-handler')

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
            const user = await User.findById(dec.id).select('-password -refreshToken');
            if(!user) {
                return res.status(404).json(
                    errorRes(
                        404,
                        "UNKOWN ACCESS",
                        "Access denied! Please logout and login again!"
                    )
                )
            }
            req.user = user;
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
            const user = await User.findById(dec.id).select("-password +refreshToken");
            if(!user) {
                return res.status(403).json(errorRes(
                    403,
                    "UNKOWN ACCESS",
                    "Access denied! please logout & login again"
                ));
            }
            req.user  = user;
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