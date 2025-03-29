const express = require("express");
const router = express.Router();
const NotificationModel = require("../models/Notification-Model");

// 📌 2️⃣ Admin Sends Notification (Save & Real-Time)
router.post("/send-notification", async (req, res) => {
    try {
        const { message, img, link } = req.body;
        if (!message || !img || !link) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Save Notification in Database
        const notification = new NotificationModel({ message, img, link });
        await notification.save();

        // Broadcast Notification to All Connected Users
        req.io.emit("notification", { message, img, link });

        res.status(200).json({ success: true, message: "Notification sent and saved!" });
    } catch (error) {
        console.error("Error sending notification:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// 📌 3️⃣ Fetch All Notifications (For Frontend)
router.get("/notifications", async (req, res) => {
    try {
        const notifications = await NotificationModel.find().sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
