import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
    from:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : "User"
    },
    to:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : "User"
    },
    type:{
        type: String,
        required: true,
        enum :['follow','like','comment']  // it will to send notifications when we choose either follow or like
    },
    read:{
        type: Boolean,
        default: false
    }
},{timestamps: true});

const Notification = mongoose.model("Notification",notificationSchema);

export default Notification;