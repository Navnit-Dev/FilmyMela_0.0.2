const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI,);
        console.log("✅ Database Connected Successfully");
    } catch (error) {
        console.log("❌ Database Connection Failed", error);
    }
}
module.exports = Connection;