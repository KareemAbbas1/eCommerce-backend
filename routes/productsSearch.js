const express = require("express");
const router = express.Router();
const { 
    productsSearch,
    // autocompleteProductsSearch,
 } = require('../controllers/productsController');



// Search products
router.get("/", productsSearch);


// to add autocomplete search keyword check https://www.youtube.com/watch?v=Z05rVI5mhzE
// Autocomplete product search
// router.get("/autocompletesearch", autocompleteProductsSearch);


module.exports = router;