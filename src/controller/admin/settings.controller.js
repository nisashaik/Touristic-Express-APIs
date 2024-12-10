const asyncHandler = require('express-async-handler');
const { errorRes, successRes } = require('../../config/app.response');
const User = require('../../models/admin/user.model');
const bcrypt = require('bcryptjs');
exports.updateProfile = asyncHandler(async(req, res) => {
    try {
        const {email, fullName, phone, current_password, new_password} = req.body;
        if(!email && !fullName && !phone) {
            return res.status(422).json(errorRes(
                422,
                "UNPROCESSABLE CONTENT",
                "Email Full Name & phone number field can't be empty"
            ));
        }
        const user = await User.findOne({email}).select('+password');
        if(req.user.email !== email) {
            if(user) {
                return res.status(422).json(errorRes(
                    422,
                    "UNPROCESSABLE CONTENT",
                    "User with this email address already exists!"
                ))
            }
        }
        let updateData = {email, fullName, phone};
        const isPasswordMatch = await user.comparePassword(current_password);
        if(current_password && new_password && !isPasswordMatch) {
            return res.status(404).json(errorRes(
                404,
                "FAILED",
                "Password didn't match!"
            ));
        }
        updateData.password = await bcrypt.hash(new_password, 8)
        const updateUser = await User.updateOne(updateData);
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
            "Profile Updated!",
            {email, fullName, phone, current_password, new_password}
        ));
    } catch(error) {
        return res.status(500).json(errorRes(
            500,
            "SERVER ERROR",
            error
        ))
    }
});