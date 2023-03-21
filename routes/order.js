const express = require("express");
const router = express.Router();
const { protect, adminProtect } = require("../middleware/authMiddleware");
const {
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder,
    getAllOrders,
    getOrdersStatistics
} = require("../controllers/orderController");



// get order 
router.get("/find/:userId", protect, getOrder);


// create order
router.post("/", protect, createOrder);


// update order
router.patch("/:id", adminProtect, updateOrder);


// delete order
router.delete("/:id", protect, deleteOrder);


// get all orders 
router.get("/", adminProtect, getAllOrders);


// get orders statistics
router.get("/statistics", adminProtect, getOrdersStatistics);



module.exports = router;