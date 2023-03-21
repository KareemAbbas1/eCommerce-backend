const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const User = require("../models/User");




// Route:  GET request -> api/order/userId
// Description:  Get user orders
// Access: Private
const getOrder = asyncHandler(async (req, res) => {

    // get orders by userId
    const orders = await Order.find({ userId: req.params.userId })

    if (orders) {
        res.status(200).json(orders);
    } else {
        res.status(400)
        throw new Error("No orders are found")
    }
});



// Route:  POST request -> api/order
// Description:  Carete order
// Access: Private
const createOrder = asyncHandler(async (req, res) => {

    // Extract the data from the req.body
    const { userId } = req.body;
    const user = await User.findById(userId);


    /* Start Validation */
    if (!user) {
        res.status(400)

        throw new Error("This user doesn't exist");
    }
    /* End Validation */


    // Create new order
    const newOrder = await Order.create(req.body);


    if (newOrder) {
        res.status(201).json(newOrder);
    } else {
        res.status(409)
        throw new Error("Failed to creat a new Order")
    }
});



// Route:  PATCH request -> api/order/:id
// Description:  Update order
// Access: Private(admin)
const updateOrder = asyncHandler(async (req, res) => {

    // Update Order
    const updatedOrder = await Cart.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    if (updatedOrder) {
        res.status(201).json(updatedOrder);
    } else {
        res.status(409)
        throw new Error("Failed to update Order")
    }
});


// Route:  DELETE request -> api/order/:id
// Description:  Delete order
// Access: Private(admin)
const deleteOrder = asyncHandler(async (req, res) => {

    // Check if the order exist
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(400)
        throw new Error("Order doesn't exist");
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(201).json({ message: `Order with the id: ${req.params.id} has been deleted successfully` })
});




// Route:  GET request -> api/order
// Description:  GET all orders
// Access: Private(admin only)
const getAllOrders = asyncHandler(async (req, res) => {

    // get all orders
    const allOrders = await Order.find();

    if (allOrders && allOrders.length !== 0) {
        console.log(allOrders)
        res.status(200).json(allOrders);
    } else {
        res.status(400)
        throw new Error("No Orders are found")
    }
});




/*-------------- Start orders statistics-------------- */

// Route:  GET request -> api/order/statistics
// Description:  GET orders statistics
// Access: Private(admin only)
const getOrdersStatistics = asyncHandler(async (req, res) => {

    // get the last two months dates
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const monthBeforeTheLast = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    /* Get orders statistics per month */
    //--- Grouping items(orders) using mongoDB aggregate method
    const incomeStatistics = await Order.aggregate([
        // here we define the condition of which the aggregation is based on
        // the condition is the createdAt property on the order document
        {
            $match: {
                createdAt: { $gte: monthBeforeTheLast /* we're specifying that the createdAt date should be greater($gte) than monthBeforeTheLast and lessthan today to get the last two months statistics */ }
            }
        },

        // here we append a new $project operator to the aggregation pipeline(basically, grouping orders by the month of their creation)
        {
            $project: {
                // here we declare a month variable and set it to the month number in the createdAt date property on the order document
                month: { $month: "$createdAt" },
                // here we're getting the amount spent on each order, and then when we group our element below we're going to sum the mounts of all orders per month
                sales: "$amount"
            }
        },

        // here where the actual grouping happens after defining the conditoin($match) and the operator($project) of which the projection is based on
        {
            $group: {
                // here we're grouping orders by the $month variable we declared above and assigning it to an _id variable(the month number is the id of its group)
                _id: "$month",
                // here we're geting the total amount spent on all the orders created on the specified month using the $sum method to sum the $sales variable we declared above
                totalAmount: { $sum: "$sales" /* sum all the amounts spent on all the orders per the specified month */}
            }
        }
    ]);

    if (incomeStatistics && incomeStatistics.length !== 0) {
        res.status(200).json(incomeStatistics);
    } else {
        res.status(400)
        throw new Error("Faild to get income statistics");
    };
});

/*-------------- End orders statistics-------------- */


module.exports = {
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder,
    getAllOrders,
    getOrdersStatistics
};