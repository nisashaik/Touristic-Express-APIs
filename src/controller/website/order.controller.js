const asyncHandler = require('express-async-handler');
const Order = require('../../models/orders.model');
const Package = require('../../models/admin/packages.model');
const Payment = require('../../models/payments.model');
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
    const payment = await Payment.findOne({orderId: order._id});
    const package =  await Package.find({_id: order.packageId});
    return res.status(200).json(successRes(
        200,
        "SUCCESS",
        "Order details fetched successfully!",
        PackageListResource.collection(package),
        {
            package_type: order.packageType,
            payment_amount: payment.total,
            payment_id: payment.paymentIntentId
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
/**
 * Get all customer orders
*/
exports.getOrders = asyncHandler(async(req, res) => {
    try {
        const orders = await Order.find({customerId: req.customer._id}).populate(['packageId']);
        if(!orders) {
            return res.status(404).json(errorRes(
                404,
                "RESOUCE NOT FOUND",
                "Issue with retrieving customer orders"
            ));
        }
        const ordersList =  await Promise.all(
            orders.map(async (order) => {
                const payment = await Payment.findOne({orderId: order._id});
                return {
                    _id: order._id,
                    package_type: order.packageType,
                    customer_id:  order.customerId,
                    package_title: order.packageId.package_title,
                    package_slug: order.packageId.package_slug,
                    number_of_days: order.packageId.number_of_days,
                    number_of_nights: order.packageId.number_of_nights,
                    createdAt: order.createdAt,
                    payment: payment
                }
            })
        )
        return res.status(200).json(successRes(
            200,
            "SUCCESS",
            "Order details fethed successfully",
            ordersList
        ));
    } catch(err) {
        return res.status(500).json(errorRes(
            500,
            "SERVER ERROR",
            err
        ))
    }
})