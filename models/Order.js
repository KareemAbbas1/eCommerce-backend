const mongoose = require("mongoose");


const OrderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    products: [
        {
            productId: String,
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],
    amount: {
        type: Number,
        required: true
    },
    address: {
        type: String, /* change it to Object in production */
        required: true
    },
    status: {
        type: String,
        default: "pending"
    }
}, {timestamps: true});



module.exports = mongoose.model("Order", OrderSchema);
// export default mongoose.models.Order || mongoose.model("Order", OrderSchema);