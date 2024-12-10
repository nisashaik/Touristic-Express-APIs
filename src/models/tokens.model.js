const mongoose = require("mongoose");

const tokensSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, "Uesr Id field is required"]
    },
    action: {
        type: String,
        required: [true, "Action name field is required"],
    },
    token: {
        type: String,
        required: [true, "token field is required"]
    },
    expires_at: {
        type: Date,
        required: [true, "Token expiration field is required"],
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Tokens", tokensSchema);