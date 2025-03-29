const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    message:{type:String,required:true},
    link:{type:String,required:true},
    img:{type:String,required:true},
    // time: { type: Date, default: Date.now }   
})

const Notification = new mongoose.model('notification',NotificationSchema);

module.exports = Notification