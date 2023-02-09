/* Imports */
const express = require("express");
const router = express.Router();
const {
    getAllUsers,
    getSingleUser,
    createNewUser,
    loginUser,
    updateUser,
    deleteUser
} = require('../controllers/usersController');
const { protect, adminProtect } = require("../middleware/authMiddleware");


// get all users
router.get("/", adminProtect, getAllUsers);


// get single user
router.get("/me", protect, getSingleUser);


// create new user(Register)
router.post("/register", createNewUser);


// Login user
router.post("/login", loginUser);

// update user
router.patch("/:id", protect, updateUser);


// delete user
router.delete("/:id", protect, deleteUser);



/*
Additionally, we can use the following approach for a cleaner code
use the route() func from express if we're calling multipule controllers on the same route and chain the controllers on the that route
router.route.('/').get(getAllUsers).post(createNewUser);
router.route.('/:id').get(getUserById).patch(updateUser).delete(deleteUser);
*/

module.exports = router;