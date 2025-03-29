const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.cookies?.token; // Get token from cookies

    if (!token) {
        return res.redirect("/auth"); // Redirect if no token is found
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        req.user = decoded; // Attach user info to request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

module.exports = verifyToken;
