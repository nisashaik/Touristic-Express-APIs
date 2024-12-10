const asyncHandler = require('express-async-handler');
const Order = require('../../models/orders.model');
const Package = require('../../models/admin/packages.model');
const { errorRes, successRes } = require('../../config/app.response');
const PackageListResource = require('../../resources/package.list.resource');
exports.getOrder = asyncHandler(async(req, res) => {
    try {
        const orderId = req.params.id;
        console.log(orderId);
        if(!orderId) {
            return res.status(404).json(errorRes(
                400,
                "FAILED",
                "Requested resource not found!"
            ))
        }
    const order = await Order.findOne({_id: orderId});
    const package =  await Package.find({_id: order.packageId});
    return res.status(200).json(successRes(
        200,
        "SUCCESS",
        "Order details fetched successfully!",
        PackageListResource.collection(package),
        {
            package_type: order.packageType
        }
    ))
    } catch (err) {
        return res.status(500).json(errorRes(
            500,
            "SERVER ERROR",
            err
        ))
    }
});