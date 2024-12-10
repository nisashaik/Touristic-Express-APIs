const mongoose = require('mongoose');

const rolesScheme = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Role name is required"],
    },
    },
    {
        timestamps: true,
    });

module.exports = mongoose.model("Roles", rolesScheme);
