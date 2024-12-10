const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    package_title: {
        type: String,
        trim: true,
        required: [true, "Package title is required"],
    },
    package_slug: {
        type: String,
        trim: true,
        unique: true,
    },
    package_desc: {
        type: String,
        trim: true,
    },
    number_of_days: {
        type: Number,
        required: [true, "Number of days is required"],
    },
    number_of_nights: {
        type: Number,
        required: [true, "Number of nights is required"],
    },
    price_deluxe: {
        type: Number,
        required: [true, "Package deluxe price is required"],
    },
    price_super_deluxe: {
        type: Number,
        required: [true, "Package super deluxe price is required"]
    },
    pax_count: {
        type: Number,
    },
    package_inclusions: {
        type: Array,
    },
    package_itinerary: {
        type: Object,
        required: [true, "Package itinerary is required"],
    },
    featured_image: {
        type: String,
        required: [true, "Featured image is required"],
    },
    gallery_images: {
        type: Array,
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categories",
        required: [true, "Category is required"],
    },
    from_date: {
        type: Date,
        required: [true, "From date is required"],
    },
    to_date: {
        type: Date,
        required: [true, "To date is required"],
    },
    dir_unique_id: {
        type: String,
    },
    status: {
        type: Boolean,
        default: 1
    }
},
{
    timestamps: true,
}); 
module.exports = mongoose.model("Packages", packageSchema);

