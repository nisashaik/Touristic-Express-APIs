const mongoose  = require("mongoose");

const favouriteSchema = new mongoose.Schema({
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customers",
        required: [true, "Customer ID is required"]
    },
    package_slug: {
        type: String,
        required: [true, "Package Slug is required"]
    }
},{
    timestamps: true,
})

module.exports = mongoose.model("Favourites", favouriteSchema)