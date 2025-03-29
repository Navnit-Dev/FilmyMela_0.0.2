const UserModel = require("../models/User-Model");

const checkAdmin = async (req, res, next) => {
    try {
        if (!req.session) req.session = {}; // Ensure session exists

        const userId = req.cookies.user; // Get user ID from cookies

        if (!userId) {
            console.log("Admin Check Failed: No User ID Found");
            return res.status(401).redirect('/auth');
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            console.log("Admin Check Failed: User Not Found");
            return res.status(404).json({ message: "User not found" });
        }

        req.session.adminSession = user.isAdmin; // Store admin status in session

        console.log("Checking Admin Middleware: Admin Status ->", req.session.adminSession);

        if (!user.isAdmin) {
            console.log("Admin Check Failed: Not an Admin");
            return res.status(403).json({ message: "Access Denied: You are not an admin" });
        }

        next();
    } catch (error) {
        console.error("Error in checkAdmin middleware:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = checkAdmin;
