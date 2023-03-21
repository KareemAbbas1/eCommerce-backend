/* Imports */
const express = require("express");
const router = express.Router();
const {
    getCart,
    createCart,
    updateCart,
    deleteCart,
    getAllUsersCarts
} = require('../controllers/cartController');
const { protect, adminProtect } = require("../middleware/authMiddleware");



// get cart 
router.get("/find/:userId", protect, getCart);


// create cart
router.post("/", protect, createCart);


// update cart
router.patch("/:id", protect, updateCart);


// delete cart
router.delete("/:id", protect, deleteCart);


// get all users' carts
router.get("/", adminProtect, getAllUsersCarts);



module.exports = router;