import Notification from "../models/notificationModel.js";

export const getNotifications = async(req,res) =>{
    try{
        const userId = req.user.id;
        const  notification = await Notification.find({to: userId}).populate({
            path:"from",
            select:"username profileImg"  // it will show only usename 
        })

        await Notification.updateMany({to:userId},{read:true})   //once this route is called the notification is showen in the frontend


    }
    catch(err){
        console.log(`eoori in getNotification ${err}`)
        res.status(400),json(err)
    }
}



export const deletetNotifications = async(req,res) =>{
    try{}
    catch(err){
        console.log(`eoori in deletetNotifications ${err}`)
        res.status(400),json(err)
    }
}