const mongoose = require('mongoose');
const paymentsSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Orders",
        required: [true, "Order Id is required"]
    },
    total: {
        type: String,
        required: [true, "Total amount is required"]
    },
    paymentIntentId: {
        type: String,
        required: [true, "Payment Intent field is required"]
    },
    qty: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true,
})
module.exports = mongoose.model("Payments", paymentsSchema);