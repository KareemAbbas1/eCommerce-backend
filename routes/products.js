/* Imports */
const express = require("express");
const router = express.Router();
const { 
    getAllProducts,
    getProductById,
    createNewProduct,
    updateProduct,
    deleteProduct,
    seedingDb
 } = require('../controllers/productsController');
 const { adminProtect } = require("../middleware/authMiddleware");



// get all products
router.get("/", getAllProducts);


// get single product
router.get("/:id", getProductById);


// create new product
router.post("/", adminProtect, createNewProduct);


// update product
router.patch("/:id", adminProtect, updateProduct);


// delete product
router.delete("/:id", adminProtect, deleteProduct);







// seeding
router.post("/seed", adminProtect, seedingDb);
/*
Additionally, we can use the following approach for a cleaner code
use the route() func from express if we're calling multipule controllers on the same route and chain the controllers on the that route
router.route.('/').get(getAllProducts).post(createNewProduct);
router.route.('/:id').get(getProductById).patch(updateProduct).delete(deleteProduct);
*/

module.exports = router;