const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");




// Route:  GET request -> api/users
// Description:  Get all users
// Access: Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find();

    res.status(200).json(users)
});



// Route:  GET request -> api/users/me
// Description:  Get single user
// Access: Private
const getSingleUser = asyncHandler(async (req, res) => {

    try {
        await User.findById(req.user.id);
        const { _id, username, email, isAdmin } = await User.findById(req.user.id);

        res.status(200).json({
            id: _id,
            username,
            email,
            isAdmin
        });
    } catch (err) {
        res.status(400)
        throw new Error(`User does not exist, ${err.message}`);
    }

});



/*------------------ Start Authentication -------------------- */

// Route:  POST request -> api/users
// Description:  Create new user(Register)
// Access: Public
const createNewUser = asyncHandler(async (req, res) => {

    // Extract data from the request body
    const {
        username,
        email,
        password
    } = req.body


    /* Start Validation */
    // Check for all the required fields
    if (
        !username
        || !email
        || !password
    ) {
        res.status(400);

        throw new Error('Please add all the required fields');
    };

    // Check if the username exists
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
        res.status(400)
        throw new Error('This username is taken, please choose another username');
    };

    // check if the email exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
        res.status(400)
        throw new Error('This email already exists, login instead');
    };
    /* End Validation */



    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    // create new user 
    const newUser = await User.create({
        username: username,
        email: email,
        password: hashedPassword
    });


    if (newUser) {
        res.status(201).json({
            _id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            token: generateToken(newUser._id, newUser.isAdmin)
        });
    } else {
        res.status(400)
        throw new Error('Invalid user data');
    }
});



// Route:  POST request -> api/users/login
// Description:  Login user
// Access: Public
const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    // Check for email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id, user.isAdmin)
        });
    } else {
        res.status(400)
        throw new Error('Invalid credentials');
    };
});


// Generate JWT
const generateToken = (id, isAdmin) => {
    return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

/*------------------ End Authentication -------------------- */




// Route:  PATCH request -> api/users/:id
// Description:  Update user
// Access: Private
const updateUser = asyncHandler(async (req, res) => {

    // Check if the user exists
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(400)
        throw new Error('User does not exist');
    };


    // Check authorizatoin
    if (req.params.id !== req.user.id && !req.user.isAdmin) {
        res.status(401)
        throw new Error("You are not authorized to edit this user's profile")
    }


    // Update user
    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    ).select("-password");

    res.status(201).json(updatedUser);
});



// Route:  DELETE request -> api/users/:id
// Description:  Delete a user
// Access: Private
const deleteUser = asyncHandler(async (req, res) => {

    // Check if the user exists
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(400)
        throw new Error('User does not exist');
    };
    // if the above approach didn't work, try the below approach
    // Also, the below approach returns the database errors
    // try {
    //     await User.findById(req.params.id);
    // } catch (err) {
    //     res.status(400)
    //     throw new Error(`User does not exist, ${err.message}`);
    // }


    // Check authorizatoin
    if (req.params.id !== req.user.id && !req.user.isAdmin) {
        res.status(401)
        throw new Error("You are not authorized to delete this user")
    }

    await User.findByIdAndDelete(req.params.id)

    res.status(201).json({ message: `User with the id: ${req.params.id} has been deleted successfully` });
});



module.exports = {
    getAllUsers,
    getSingleUser,
    createNewUser,
    loginUser,
    updateUser,
    deleteUser
};