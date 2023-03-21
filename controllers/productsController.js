const { request } = require("urllib");
const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const dotenv = require("dotenv");
dotenv.config();


// Route:  GET request -> api/products
// Description:  Get all products
// Access: Public
const getAllProducts = asyncHandler(async (req, res) => {
    /* There's a code fragment commented at the bottom of the file to explain how I fiquerd out this filtering approach  */


    // Check for queries in the url and Extracting them
    let urlQuery = req.query;
    const isQuery = Object.keys(urlQuery).length <= 0 ? false : true;

    // Check if there is a category to search in
    const searchInCategory = isQuery && urlQuery.category && urlQuery.category.length > 0 ? true : false;

    // declare the query sent to the DB
    let dbQuery = {};


    // adding queries to the dbQuery object dynamically based on the queries coming from the url if there is any.
    // The $in operator searchs for an element in an array
    if (urlQuery.brands && urlQuery.brands.length > 0) dbQuery.brand = { $in: urlQuery.brands.split(",") };
    if (urlQuery.colors && urlQuery.colors.length > 0) dbQuery.colors = { $in: urlQuery.colors.split(",") };
    if (urlQuery.sizes && urlQuery.sizes.length > 0) dbQuery.sizes = { $in: urlQuery.sizes.split(",") };
    if (urlQuery.types && urlQuery.types.length > 0) dbQuery.type = { $in: urlQuery.types.split(",") };
    if (urlQuery.state && urlQuery.state.length > 0) dbQuery.state = { $in: urlQuery.state.split(",") };
    if (urlQuery.category && urlQuery.category.length > 0) dbQuery.categories = { $in: urlQuery.category.split(",") };


    // function to filter products based on the category
    const filterProductsBasedOnCategory = (list, keywords, urlQueryPropToCheckFor, propToFilterFrom) => {

        return list.filter(x => {
            // here we're including the urlQueryPropToCheckFor and propToFilterFrom from the parameters because they're out of scope in the filter func and I don't know the reason why.
            x.propertyKey = propToFilterFrom;
            keywords.propertyValue = urlQueryPropToCheckFor;

            // here we're useing the $in operator as a key because we're extracting the category from the dbQuery which
            // is structured as {$in: ["men", "kids"]} due to the dynamic dbQuery we created above
            let arr = x.propertyKey.$in;
            // here we're checking if the property on the doucment coming from the DB includes any of the key word sent in the urlQuery
            return arr.some(y => keywords.propertyValue.split(",").includes(y))
        });
    };


    let products;
    // filtering based on the category
    if (isQuery && searchInCategory) {

        let productsToFilter = await Product.find(dbQuery);
        let filteredProductsInCategory = filterProductsBasedOnCategory(
            productsToFilter,/* List */
            urlQuery,/* keywords */
            urlQuery.category,/* urlQueryPropToCheckFor */
            dbQuery.categories/* propToFilterFrom */
        );
        products = filteredProductsInCategory;

    }
    // filtering based on the urlQuery with out category
    else if (isQuery) {

        let filteredProducts = await Product.find(dbQuery);
        products = filteredProducts;

    }
    else {
        products = await Product.find();
    }

    res.status(200).json(products);
});



// Route:  GET request -> api/products/:id
// Description:  Get product by id
// Access: Public
const getProductById = asyncHandler(async (req, res) => {
    // get product by id
    const product = await Product.findById(req.params.id)

    if (product) {
        res.status(200).json(product);
    } else {
        res.status(400)
        throw new Error("Product not found")
    }
});



// Route:  POST request -> api/products
// Description:  Create new product
// Access: Private
const createNewProduct = asyncHandler(async (req, res) => {
    // Extract the data from the req.body
    const {
        title,
        type,
        colors,
        sizes,
        brand,
        description,
        price,
        images,
        countInStock,
    } = req.body

    /* Start Validation */
    if (
        !title
        || !type
        || !colors
        || !sizes
        || !brand
        || !description
        || !price
        || !images
        || !countInStock
    ) {
        res.status(400)

        throw new Error("Please add all the required fields");
    }
    /* End Validation */


    // Create new product
    const newProduct = await Product.create(req.body);


    if (newProduct) {
        res.status(201).json(newProduct);
    } else {
        res.status(409)
        throw new Error("Failed to creat product, missing or invalid data. Please fill all the required fields with valid data and try again")
    }
});



// Route:  PATCH request -> api/products/:id
// Description:  Update product
// Access: Private
const updateProduct = asyncHandler(async (req, res) => {

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    if (updatedProduct) {
        res.status(201).json(updatedProduct);
    } else {
        res.status(409)
        throw new Error("Failed to update prodcut")
    }
});



// Route:  DELETE request -> api/products/:id
// Description:  Delete a product
// Access: Private
const deleteProduct = asyncHandler(async (req, res) => {
    // Check if the product exist
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(400)
        throw new Error("Product doesn't exist");
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(201).json({ message: `Product with the id: ${req.params.id} has been deleted successfully` })
});



// Route:  POST request -> api/products/seed
// Description:  Seeding database with multiple products
// Access: Private
const seedingDb = asyncHandler(async (req, res) => {

    const products = await Product.insertMany(req.body);

    if (products) {
        res.status(201).json(products);
    } else {
        res.status(409)
        throw new Error("Faild to seed the database with new products");
    }
});



/*-------Start Search Products----------- */
// defining variables for atlas search url
const ATLAS_API_BASE_URL = "https://cloud.mongodb.com/api/atlas/v1.0";
// eslint-disable-next-line no-undef
const ATLAS_PROJECT_ID = process.env.MONGO_ATLAS_PROJECT_ID;
// eslint-disable-next-line no-undef
const ATLAS_CLUSTER_NAME = process.env.MONGO_ATLAS_CLUSTER;
const ATLAS_CLUSTER_API_URL = `${ATLAS_API_BASE_URL}/groups/${ATLAS_PROJECT_ID}/clusters/${ATLAS_CLUSTER_NAME}`;
const ATLAS_SEARCH_INDEX_API_URL = `${ATLAS_CLUSTER_API_URL}/fts/indexes`;


// eslint-disable-next-line no-undef
const ATLAS_API_PUBLIC_KEY = process.env.MONGO_ATLAS_PUBLIC_KEY;
// eslint-disable-next-line no-undef
const ATLAS_API_PRIVATE_KEY = process.env.MONGO_ATLAS_PRIVATE_KEY;
const DIGEST_AUTH = `${ATLAS_API_PUBLIC_KEY}:${ATLAS_API_PRIVATE_KEY}`;

const PRODUCT_SEARCH_INDEX_NAME = 'product_search';
// const PRODUCT_AUTOCOMPLETE_SEARCH_INDEX_NAME = 'product_autocomplete_search';
const MONGODB_COLLECTION = 'products';


// Route:  GET request -> api/products/search
// Description:  Searching products
// Access: Public
const productsSearch = asyncHandler(async (req, res) => {
    const searchQuery = req.query.query;

    if (!searchQuery || searchQuery.length < 2) {
        res.json([])
        return
    }

    const pipeline = [];

    pipeline.push({
        $search: {
            index: 'product_search',
            text: {
                query: searchQuery,
                path: ['title', 'type', 'colors', 'sizes', 'brand', 'description', 'state'],
                fuzzy: {},
            },
        },
    })


    pipeline.push({
        $project: {
            _id: -1,
            score: { $meta: 'searchScore' },
            title: 1,
            type: 1,
            colors: 1,
            sizes: 1,
            categories: -1,
            brand: 1,
            description: 1,
            price: -1,
            oldPrice: -1,
            images: -1,
            rate: -1,
            state: 1,
            countInStock: -1,
            reviews: -1,
            createdAt: 1,
        }
    })

    const products = await Product.aggregate(pipeline).sort({ score: -1 });

    if (products && products.length > 0) {
        res.status(200).json(products);
    } else {
        res.status(400)
        throw new Error("No products found")
    }
});

async function findIndexByName(indexName) {
    const allIndexesResponse = await request(
        `${ATLAS_SEARCH_INDEX_API_URL}/test/${MONGODB_COLLECTION}`,
        {
            dataType: 'json',
            contentType: 'application/json',
            method: 'GET',
            digestAuth: DIGEST_AUTH,
        }
    )

    return (allIndexesResponse.data).find((i) => i.name === indexName)
}



async function upsertSearchIndex() {
    const productSearchIndex = await findIndexByName(PRODUCT_SEARCH_INDEX_NAME)

    if (!productSearchIndex) {

        await request(ATLAS_SEARCH_INDEX_API_URL, {
            data: {
                name: PRODUCT_SEARCH_INDEX_NAME,
                database: "test",
                collectionName: MONGODB_COLLECTION,
                // https://www.mongodb.com/docs/atlas/atlas-search/index-definitions/#syntax
                mappings: {
                    dynamic: true,
                },
            },
            dataType: 'json',
            contentType: 'application/json',
            method: 'POST',
            digestAuth: DIGEST_AUTH
        })
    }
}
/*-------End Search Products----------- */



// Route:  GET request -> api/products/autocompletesearch
// Description:  Searching products
// Access: Public
// const autocompleteProductsSearch = asyncHandler(async (req, res) => { });

module.exports = {
    getAllProducts,
    getProductById,
    createNewProduct,
    updateProduct,
    deleteProduct,
    productsSearch,
    // autocompleteProductsSearch,
    upsertSearchIndex,
    seedingDb
};



// qState = req.query.state
    // qCategory = req.query.category

    // console.log(isQuery)
    // console.log(urlQuery.state.split(","))
    // console.log(qState.split(",").length)
    // console.log(qCategory.split(",").length)
    // qBrand
    // qType

/*
query coming from the client
let urlQuery = {
    "brands":["Zara","H&M", "American Eagle"],
    "colors":["Red","Balck"],
    "sizes":["M", "L", "XL"],
    "types":["Jacket", "Jeans"],
    "state": "",
    "category": ["men", "women"],
};
query to send to the DB
let dbQuery = {
    brand,
    colors,
    sizes,
    type,
    state(sort),
    categories
};

res.filter(item => {

})
*/
   // let filteredProducts = productsToFilter.filter(product => {
   //     const arr = product.categories;
   //     return arr.some(y => urlQuery.category.split(",").includes(y))
   // });


   // Checking for queried and if there's queries, which is required
   // if (qState) {
   //     products = await Product.find({ state: qState });
   // } else if (qCategory) {
   //     products = await Product.find({
   //         categories: {
   //             // The $in operator searchs for an element in an array
   //             $in: [qCategory]
   //         }
   //     });
   // } else {
   //     products = await Product.find();
   // }