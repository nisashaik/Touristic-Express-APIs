const asyncHandler = require("express-async-handler");
const Category = require("../../models/admin/categories.model");
const { errorRes, successRes } = require('../../config/app.response');


exports.listCategories = asyncHandler( async(req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(successRes(
            200,
            "SUCCESS",
            "Categories fetched successfully",
            categories
        ));
    } catch (error) {
        return res.status(500).json(errorRes(
            500,
            "SERVER ERROR",
            error
        ))
    }
});

exports.createCategory = asyncHandler( async(req, res) => {
    try {
        const { name, status } = req.body;
        const isNameExists = await Category.findOne({name});
        if(isNameExists) {
            return res.status(422).json(errorRes(
                422,
                "UNPROCESSABLE CONTENT",
                "Category name already exists"
            ));
        }
        const category = await Category.create(req.body);
        return res.status(200).json(successRes(
            200,
            "SUCCESS",
            "Category created successfully!"
        ))
    } catch(error) {
        return res.status(500).json(errorRes(
            500,
            "SERVER ERROR",
            error
        ))
    }
})
// TODO: Update category details
exports.updateCategory = asyncHandler (async(req, res) => {
    try {
        const {name,status} = req.body;
        const category = await Category.findById(req.params.id);
        if(!category) {
            return res.status(400).json(errorRes(
                400,
                "FAILED",
                "Failed to fetch record with the given ID"
            ));
        }
        await Category.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    name: name,
                    status: status
                }
            }
        );
        return res.status(200).json(successRes(
            200,
            "SUCCESS",
            "Category updated successfully!"
        ));
    } catch(error) {
        return res.status(500).json(errorRes(
            500,
            "SERVER ERROR UPDATE CATEGORY",
            error
        ))
    }
});
// TODO: Delete a category
exports.deleteCategory = asyncHandler(async(req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if(!category) {
            return res.status(400).json(errorRes(
                400,
                "FAILED",
                "Failed to fetch record with the given ID"
            ));
        }
        // const foundUsers = await User.where({'role': role.name }).countDocuments();
        // if(foundUsers > 0 ) {
        //     return res.status(400).json(errorRes(
        //         400,
        //         "FAILED",
        //         "Failed Can't delete role users are associated with this role"
        //     ));
        // }
        await Category.deleteOne({_id: req.params.id});
        return res.status(200).json(successRes(
            200,
            "SUCCESS",
            "Category deleted successfully!"
        ));
    } catch(error) {
        return res.status(500).json(errorRes(
            500,
            "SERVER ERROR DELETE CATEGORY",
            error
        ));
    }
}); 
