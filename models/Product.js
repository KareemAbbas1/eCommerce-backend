const mongoose = require("mongoose");


const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    type: {
        type: String,
        required: true
    },
    colors: {
        type: Array,
        required: true
    },
    sizes: {
        type: Array,
        required: true
    },
    categories: { type: Array },
    brand: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    oldPrice: {
        type: Number,
        default: null
    },
    images: [String],
    rate: {
        type: Number,
        default: null
    },
    state: {
        type: String,
        default: "new-arrival"
    },
    countInStock: {
        type: Number,
        required: true
    },
    reviews: [
        {
            userName: {
                type: String,
                required: true
            },
            userImage: String,
            rate: {
                type: Number,
                required: true
            },
            date: {
                type: Date,
                required: true
            },
            comment: String
        }
    ]
}, { timestamps: true });



module.exports = mongoose.model("Product", ProductSchema);
// export default mongoose.models.Product || mongoose.model("Product", ProductSchema);