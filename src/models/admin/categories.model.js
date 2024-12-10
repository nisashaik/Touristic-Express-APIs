const mongoose = require('mongoose');

const categoryScheme = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Category name is required"],
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
},
{
    timestamps: true,
});

module.exports = mongoose.model("Categories", categoryScheme);