const asyncHandler = require('express-async-handler');
require("dotenv").config();
const { errorRes, successRes } = require('../../config/app.response');
const Payment = require('../../models/payments.model');
const Order = require('../../models/orders.model');
const stripe = require("stripe")(process.env.STRIPE_SECRET);
exports.paymentIntent = asyncHandler(async(req, res) => {
    try {
        const {amount, package_id, price_type} = req.body;
        const order = await Order.create({
            packageId: package_id,
            customerId: req.customer._id,
            packageType: price_type
        });
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round((parseFloat(amount) * 0.012) * 100), // Convert amount to Dollar & making it a smaller unit Pennis 
            currency: 'USD',
            description: "Touristic Payment",
            automatic_payment_methods: {
                enabled: true,
            },
        });
        const payment = await Payment.create({
            orderId: order._id,
            paymentIntentId: paymentIntent.id,
            total: amount,
            qty: 1
        });
        return res.status(200).json(successRes(
            200,
            "SUCCESS",
            "Payment intent created successfully",
            {client_secret: paymentIntent.client_secret, order_id: order._id}
        ))
    } catch (err) {
        return res.status(500).json(errorRes(
            500,
            "SERVER ERROR",
            err
        ));
    }
})