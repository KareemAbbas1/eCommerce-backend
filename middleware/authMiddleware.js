const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");


const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Get the token from the header
            token = req.headers.authorization.split(' ')[1]

            // Verify the token
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);


            // Get the user from the token and add "user" to the req.body 
            req.user = await User.findById(decodedToken.id).select("-password");

            next();
        } catch (error) {
            console.log(error);
            res.status(401)
            throw new Error("You're not authorized");
        }
    }

    if (!token) {
        res.status(401)
        throw new Error("You're not authorized, no token")
    }
});


// Admin authorization
const adminProtect = asyncHandler(async (req, res, next) => {
    protect(req, res, () => {
        if (req.user && req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("Unauthorized, not an admin")
        }
    })
});


module.exports = { protect, adminProtect }