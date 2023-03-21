/* Main Imports */
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { errorHandler } = require("./middleware/errorMiddleware");
const cors = require("cors");

const { upsertSearchIndex } = require("./controllers/productsController")

// Routes Imports
const productsRoute = require("./routes/products.js");
const productsSearchRoute = require('./routes/productsSearch.js');
const usersRoute = require("./routes/users.js");
const cartsRoute = require("./routes/cart.js");
const ordersRoute = require("./routes/order.js");
const stripeRoute = require("./routes/stripe.js");
/* End Imports */

// configure dotenv
dotenv.config();


/* Initialize the server */
const app = express();

// Use body parser middleware
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));


/* End intialize server */

// Connecting the database
mongoose
    // eslint-disable-next-line no-undef
    .connect(process.env.MONGO_URL)
    .then(() => console.log("DB Connected Successfully"))
    .then(() => upsertSearchIndex())
    .catch((error) => { console.log(error) });




// Assigning the routes
app.use("/api/products", productsRoute);
app.use("/api/products-search", productsSearchRoute);
app.use("/api/users", usersRoute);
app.use("/api/carts", cartsRoute);
app.use("/api/orders", ordersRoute);
app.use("/api/checkout", stripeRoute);

// add middleware
app.use(errorHandler)


/* Start the server */
//-- get the port
// eslint-disable-next-line no-undef
const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server is runnig successfully on port: ${port}`);
});

