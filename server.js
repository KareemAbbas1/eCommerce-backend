/* Main Imports */
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { errorHandler } = require("./middleware/errorMiddleware")

// Routes Imports
const productsRoute = require("./routes/products.js");
const usersRoute = require("./routes/users.js");
/* End Imports */

// configure dotenv
dotenv.config();


/* Initialize the server */
const app = express();

// Use body parser middleware
app.use(express.json());


/* End intialize server */

// Connecting the database
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("DB Connected Successfully"))
    .catch((error) => { console.log(error) });





// Assigning the routes
app.use("/api/products", productsRoute);
app.use("/api/users", usersRoute);

// add middleware
app.use(errorHandler)


/* Start the server */
//-- get the port
const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server is runnig successfully on port: ${port}`);
});

