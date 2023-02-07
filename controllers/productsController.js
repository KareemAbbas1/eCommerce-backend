const asyncHandler = require("express-async-handler");


// Route:  GET request -> api/products
// Description:  Get all products
// Access: Public
const getAllProducts = asyncHandler(async (req, res) => {
    res.status(200).json({ message: "Get all products" });
});



// Route:  GET request -> api/products/:id
// Description:  Get product by id
// Access: Public
const getProductById = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `Get product ${req.params.id}` })
});



// Route:  POST request -> api/products
// Description:  Create new product
// Access: Private
const createNewProduct = asyncHandler(async (req, res) => {
    res.status(201).json({ message: "Create new product" })
});



// Route:  PATCH request -> api/products/:id
// Description:  Update product
// Access: Private
const updateProduct = asyncHandler(async (req, res) => {
    res.status(201).json({ message: `Update product ${req.params.id}` })
});



// Route:  DELETE request -> api/products/:id
// Description:  Delete a product
// Access: Private
const deleteProduct = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `Delete product ${req.params.id}` })
});


module.exports = {
    getAllProducts,
    getProductById,
    createNewProduct,
    updateProduct,
    deleteProduct
};