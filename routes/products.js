/* Imports */
const express = require("express");
const router = express.Router();
const { 
    getAllProducts,
    getProductById,
    createNewProduct,
    updateProduct,
    deleteProduct
 } = require('../controllers/productsController');



// get all products
router.get("/", getAllProducts);


// get single product
router.get("/:id", getProductById);


// create new product
router.post("/", createNewProduct);


// update product
router.patch("/:id", updateProduct);


// delete product
router.delete("/:id", deleteProduct);


/*
Additionally, we can use the following approach for a cleaner code
use the route() func from express if we're calling multipule controllers on the same route and chain the controllers on the that route
router.route.('/').get(getAllProducts).post(createNewProduct);
router.route.('/:id').get(getProductById).patch(updateProduct).delete(deleteProduct);
*/

module.exports = router;