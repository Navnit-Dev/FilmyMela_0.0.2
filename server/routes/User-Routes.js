const router = require("express").Router();
const User = require("../models/User-Model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


router.post('/signup', async (req, res) => {
    try {
        const {username,email,password} = req.body;
        console.log("Received Data:", req.body); // Debugging: Log incoming data
        const UserExists  = await User.findOne({ email });  // Check if user already exists
        if (UserExists) {
            return res.status(400).json({ error: "User Already Exists" });
        }
        const HashedPass = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password:HashedPass });
        await user.save();
        const Token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2d' });
        res.status(200).json({ message: "Signup Successful" ,user, Token});
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.post('/login', async (req,res)=>{
    try {
        const { email, password } = req.body;

        const UserExists = await User.findOne({ email });
        if (!UserExists) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const PasswordMatch = await bcrypt.compare(password, UserExists.password);
        if (!PasswordMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const Token = jwt.sign({ id: UserExists._id }, process.env.JWT_SECRET, { expiresIn: '2d' });

         // Set session storage
         if (!req.session) req.session = {}; 
         req.session.adminSession = UserExists.isAdmin;
 
         console.log("Admin Session:", req.session.adminSession);
 
         // Redirect based on UserExists role
         if (UserExists.isAdmin) {
             return res.status(200).json({ message: "Admin Login Successful",user:UserExists , Token,adminSession:true,redirectTo:"/admin" });
         }
        res.status(200).json({ message: "Login Successful", user: UserExists, Token,redirectTo:"/"})

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})


router.get('/user/:id', async (req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        if(!user){
            return res.status(404).json({error:"User Not Found"});
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Get User Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

module.exports = router;
