const asyncHandler = require("express-async-handler");
const Cart = require("../models/Cart");
const User = require("../models/User");




// Route:  GET request -> api/cart/userId
// Description:  Get cart
// Access: Private
const getCart = asyncHandler(async (req, res) => {
    
    // get cart by userId
    const cart = await Cart.findOne({userId: req.params.userId})

    if (cart) {
        res.status(200).json(cart);
    } else {
        res.status(400)
        throw new Error("Cart not found")
    }
});



// Route:  POST request -> api/cart
// Description:  Carete cart
// Access: Private
const createCart = asyncHandler(async (req, res) => {
    // Extract the data from the req.body
    const { userId } = req.params;
    const user = await User.findById(userId);


    /* Start Validation */
    if (!user) {
        res.status(400)

        throw new Error("This user doesn't exist");
    }
    /* End Validation */


    // Create new cart
    const newCart = await Cart.create(req.body);


    if (newCart) {
        res.status(201).json(newCart);
    } else {
        res.status(409)
        throw new Error("Failed to creat a new Cart")
    }
});



// Route:  PATCH request -> api/cart/:id
// Description:  Update cart
// Access: Private
const updateCart = asyncHandler(async (req, res) => {

    // Update Cart
    const updatedCart = await Cart.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    if (updatedCart) {
        res.status(201).json(updatedCart);
    } else {
        res.status(409)
        throw new Error("Failed to update Cart")
    }
});


// Route:  DELETE request -> api/cart/:id
// Description:  Delete cart
// Access: Private
const deleteCart = asyncHandler(async (req, res) => {
    
    // Check if the Cart exist
    const cart = await Cart.findById(req.params.id);

    if (!cart) {
        res.status(400)
        throw new Error("Cart doesn't exist");
    }

    await Cart.findByIdAndDelete(req.params.id);

    res.status(201).json({ message: `Cart with the id: ${req.params.id} has been deleted successfully` })
});




// Route:  GET request -> api/cart
// Description:  GET all users carts
// Access: Private(admin only)
const getAllUsersCarts = asyncHandler(async (req, res) => {
    
    // get all carts
    const allCarts = await Cart.find();

    if(allCarts) {
        res.status(200).json(allCarts);
    } else {
        res.status(400)
        throw new Error("No carts are found")
    }
});



module.exports = {
    getCart,
    createCart,
    updateCart,
    deleteCart,
    getAllUsersCarts
};