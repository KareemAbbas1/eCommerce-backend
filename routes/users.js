/* Imports */
const express = require("express");
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    createNewUser,
    updateUser,
    deleteUser
} = require('../controllers/usersController');



// get all users
router.get("/", getAllUsers);


// get user by id
router.get("/:id", getUserById);


// create new user
router.post("/", createNewUser);


// update user
router.patch("/:id", updateUser);


// delete user
router.delete("/:id", deleteUser);



/*
Additionally, we can use the following approach for a cleaner code
use the route() func from express if we're calling multipule controllers on the same route and chain the controllers on the that route
router.route.('/').get(getAllUsers).post(createNewUser);
router.route.('/:id').get(getUserById).patch(updateUser).delete(deleteUser);
*/

module.exports = router;