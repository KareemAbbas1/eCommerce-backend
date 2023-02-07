const asyncHandler = require("express-async-handler"); 

// Route:  GET request -> api/users
// Description:  Get all users
// Access: Private
const getAllUsers = asyncHandler(async (req, res) => {
    res.status(200).json({ message: "Get all users" })
});



// Route:  GET request -> api/users/:id
// Description:  Get user by id
// Access: Private
const getUserById = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `Get user ${req.params.id}` })
});



// Route:  POST request -> api/users
// Description:  Create new user
// Access: Private
const createNewUser = asyncHandler(async (req, res) => {
    if(!req.body.user) {
        res.status(400);

        throw new Error('Please add data')
    };

    res.status(201).json({ message: "Create new user" })
});



// Route:  PATCH request -> api/users/:id
// Description:  Update user
// Access: Private
const updateUser = asyncHandler(async (req, res) => {
    res.status(201).json({ message: `Update user ${req.params.id}` })
});



// Route:  DELETE request -> api/users/:id
// Description:  Delete a user
// Access: Private
const deleteUser = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `Delete user ${req.params.id}` })
});



module.exports = {
    getAllUsers,
    getUserById,
    createNewUser,
    updateUser,
    deleteUser
};