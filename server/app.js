const express = require("express");
const app = express();
const cookieParser = require("cookie-parser")
app.use(cookieParser()); // Enable cookie parsing
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Import Database Connection & Middleware
const Connection = require("./config/db");
const MovieModel = require("./models/Movie-Model");
const AuthRoutes = require("./routes/User-Routes");
const AmdinRoutes = require("./routes/Admin-Routes")
const VerifyToken = require("./middlewares/auth-middleware");
const Notification = require('./routes/Notification-Routes')
const NotificationModel = require("./models/Notification-Model");
const checkAdmin = require("./middlewares/Admin-Verify")
const session = require("express-session");

// Add session middleware
app.use(
    session({
        secret: process.env.JWT_SECRET, // Change this to a secure key
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Set true if using HTTPS
    })
);

// Initialize Database Connection
Connection();

// Load Environment Variables
dotenv.config();

// Create Server
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

// Middleware
app.use(express.json());
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"], allowedHeaders: ["Content-Type"] }));
app.use(express.static(path.join(__dirname, "public")));

// Set View Engine
app.set("view engine", "ejs");

// Pass `io` to the Notification Routes
app.use((req, res, next) => {
    req.io = io; // Attach `io` to `req`
    next();
});



app.use("/api",Notification)


// 📌 3️⃣ User Routes
app.get("/", async (req, res) => {
    try {
        const data = await MovieModel.find().lean();
        const TrendingMovies = data.filter((movie) => movie.position != "all");
        res.render("index", { movies: data, trending: TrendingMovies });
    } catch (error) {
        console.log(error);
    }
});

app.get("/auth", (req, res) => {
    res.render("pages/auth");
});

app.get("/profile", VerifyToken, (req, res) => {
    res.render("pages/profile");
});

app.get("/movies", async (req, res) => {
    try {
        const data = (await MovieModel.find()).filter((movie) => movie.position != "all");
        res.json(data);
    } catch (error) {
        console.log(error);
    }
});

// app.get("/movie/:id", async (req, res) => {
//     try {
//         const id = req.params.id;
//         const movie = await MovieModel.findOne({ _id: id });

//         if (!movie) {
//             return res.status(404).json({ message: "Movie not found" });
//         }

//         res.status(200).render("pages/description", { MovieData: movie });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// });


app.get("/movie/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const movie = await MovieModel.findOne({ _id: id });

        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        // ✅ If the request is AJAX/Fetch API, return JSON
        if (req.xhr || req.headers.accept.includes("application/json")) {
            return res.status(200).json({ success: true, data: movie });
        }

        // ✅ Otherwise, render the description page
        res.status(200).render("pages/description", { MovieData: movie });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


app.get("/inbox",VerifyToken ,async (req, res) => {
    const MsgData = await NotificationModel.find().sort({ createdAt: -1 });
    res.status(200).render("pages/inbox",{MsgData});
});

app.get('/get-all-movie',async(req,res)=>{
   try {
     const Allmovie = await MovieModel.find();
     res.json(Allmovie);
   } catch (error) {
        console.log(error)
   }
})

app.get("/movies/filter/:position", async (req, res) => {
    try {
      const { position } = req.params;
      let movies;
  
      if (position === "all") {
        movies = await MovieModel.find({position:"all"}); // Get all movies
      } else if(position === "none"){
        movies = await MovieModel.find()
      }else {
        movies = await MovieModel.find({ position:"trending" });
      }
  
      res.json(movies);
    } catch (error) {
      res.status(500).json({ error: "Failed to filter movies" });
    }
  });

app.use("/api",AuthRoutes);
app.use("/admin", (req, res, next) => {
    console.log("Admin Check Middleware Triggered:", req.session);
    checkAdmin(req, res, next);
}, AmdinRoutes);


// 📌 1️⃣ WebSocket Connection (Real-Time)
io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    // Handle Disconnect
    socket.on("disconnect", () => {
        console.log("User Disconnected:", socket.id);
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server Running on http://localhost:${PORT}`);
});
