const mongoose = require('mongoose');
const ordersSchema = new mongoose.Schema({
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Packages",
        required: [true, "Package Id is required"]
    },
    packageType: {
        type: String,
        required: [true, "Required package type"]
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customers",
        required: [true, "Customer Id is required"]
    }
},{
    timestamps: true,
});

module.exports = mongoose.model("Orders", ordersSchema);
