const { errorRes, successRes } = require("../../config/app.response")
const Role = require("../../models/admin/role.model");
const User = require("../../models/admin/user.model");
const asyncHandler = require("express-async-handler");
// TODO: Create new role
exports.createRole = async (req, res ) => {
    try {
        const { name } = req.body;
        const isNameExists = await Role.findOne({name: name});
        if(isNameExists) {
            return res.status(500).json(errorRes(
                500,
                "SERVER ERROR",
                "Role name already exists"
            ));
        }
        const role = await Role.create(req.body); 
        return res.status(200).json(successRes(
            200,
            "SUCCESS",
            "Role created successfully",
            {
                name: role.name
            }
        ));
    } catch (error) {
        return res.status(500).json(errorRes(
            500,
            "SERVER ERROR ROLE",
            error
        ));
    }
}
// TODO: Update role name
exports.updateRole = asyncHandler (async(req, res) => {
    try {
        const {name} = req.body;
        const role = await Role.findById(req.params.id);
        if(!role) {
            return res.status(400).json(errorRes(
                400,
                "FAILED",
                "Failed to fetch record with the given ID"
            ));
        }
        await User.findOneAndUpdate({
                role: role.name,
            },
            {
                $set: {
                    role: name
                }
            }
        );
        await Role.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    name: name
                }
            }
        );
        return res.status(200).json(successRes(
            200,
            "SUCCESS",
            "Role updated successfully!"
        ));
    } catch(error) {
        return res.status(500).json(errorRes(
            500,
            "SERVER ERROR UPDATE ROLE",
            error
        ))
    }
});
// TODO: Delete a role
exports.deleteRole = asyncHandler(async(req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if(!role) {
            return res.status(400).json(errorRes(
                400,
                "FAILED",
                "Failed to fetch record with the given ID"
            ));
        }
        const foundUsers = await User.where({'role': role.name }).countDocuments();
        if(foundUsers > 0 ) {
            return res.status(400).json(errorRes(
                400,
                "FAILED",
                "Failed Can't delete role users are associated with this role"
            ));
        }
        await Role.deleteOne({_id: req.params.id});
        return res.status(200).json(successRes(
            200,
            "SUCCESS",
            "Role deleted successfully!"
        ));
    } catch(error) {
        return res.status(500).json(errorRes(
            500,
            "SERVER ERROR DELETE ROLE",
            error
        ));
    }
}); 
// TODO: List all roles
exports.listRoles = asyncHandler( async(_, res) => {
    try {
        const roles = await Role.find().select('-__v');
        return res.status(200).json(successRes(
            200,
            "SUCCESS",
            null,
            roles
        ))
    } catch(error) {
        return res.status(500).json(errorRes(
            500,
            "SERVER ERROR LIST ROLE",
            error
        ));
    }
});
// Helper function
async function checkRoleIdExists(res, id) {
    try {
        const role = await Role.findById(id);
        if(!role) {
            return res.status(400).json(errorRes(
                400,
                "FAILED",
                "Failed to fetch record with the given ID"
            ));
        }
        return role;
    } catch(error) {
        return res.status(500).json(errorRes(
            500,
            "SERVER ERROR ID NOT EXISTS",
            error
        ))
    }
}
