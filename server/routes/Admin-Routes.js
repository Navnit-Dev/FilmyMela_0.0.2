const express = require("express");
const router = express.Router();
const MovieModel = require("../models/Movie-Model");
const UserModel = require("../models/User-Model");
const NotificationModel = require("../models/Notification-Model");

router.get('/',async (req,res) => {
    try {
        const AllMovie = await MovieModel.find().sort({ year: -1 }).lean();
        const AllUserNumber = await (UserModel.find()).length
        const AllNotificationNumber =  await (NotificationModel.find()).length
        res.status(200).render('pages/adminDashboard',{movie:AllMovie,users:AllUserNumber,notifications:AllNotificationNumber})
        
    } catch (error) {
        console.log(error)
    }
})


router.post("/delete-movies", async (req, res) => {
    try {
        const { movieIds } = req.body;

        if (!movieIds || movieIds.length === 0) {
            return res.status(400).json({ message: "No movie IDs provided" });
        }

        // Delete movies from database
        await MovieModel.deleteMany({ _id: { $in: movieIds } });

        res.json({ message: "Movies deleted successfully", deletedIds: movieIds });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
router.post("/add-movie", async (req, res) => {
    try {
        const movieCount = await MovieModel.countDocuments();

        // Add sequence = movieCount + 1
        const newMovie = new MovieModel({
            title: req.body.name,
            posterUrl: req.body.posterUrl,
            description:req.body.description,
            rating: req.body.rating,
            category: req.body.categories,
            languages:req.body.languages,
            actors:req.body.actors,
            industry: req.body.industry,
            screenshots: req.body.screenshotsUrl,
            downloadLinks: req.body.downloadLinks,
            watch: req.body.watchOnlineUrl,
            position: req.body.position,
            sequence: movieCount + 1 // Setting sequence dynamically
        });

        await newMovie.save();

        console.log("Movie added successfully!"); // Confirmation log
        res.status(200).json({ message: "Movie added successfully!",action:"added" });

    } catch (error) {
        console.error("Error adding movie:", error); // Log full error
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Update movie details
router.put("/update-movie/:id", async (req, res) => {
    const id = req.params.id; // ✅ Correctly extract movie ID
    const updateData = req.body; // ✅ Get updated movie details

    try {
        // Check if the movie exists
        const movie = await MovieModel.findById(id);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        // Update the movie with new data
        const updatedMovie = await MovieModel.findByIdAndUpdate(id, updateData, {
            new: true, // Return updated movie
            runValidators: true, // Ensure validation rules are applied
        });

        res.status(200).json({
            message: "Movie updated successfully",
            movie: updatedMovie,
            action:"updated"
        });
    } catch (error) {
        console.error("Error updating movie:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Analytics Page

router.get('/analytics',async (req,res) => {
    
    res.render("pages/adminAnalytics")    
})



module.exports = router