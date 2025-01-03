//const express = require("express")
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import cloudinary from "cloudinary";
import postRoutes from "./routes/postRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import cors from "cors"
dotenv.config();
const PORT = process.env.PORT;
const app = express();


app.use(express.json({
  limit : "5mb"
}));
//limit to 10mb for image and also secure from attackers to send large palods
  //! default : 100kbb

app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,//allow the client to send cookies
}));

app.use(express.urlencoded({
  extended: true, // support parsing of application/x-www-form-urlencoded
 //limit to 10mb for image and also secure from attackers to send large palods
}));

/*app.get("/",(req,res)=>{
    res.send("X_Clone MERN")
}) */

//! config cloudinary
cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,  
});

// cloudinary.config({
//   cloud_name:'dvetod3lv',
//   api_key: '317467139159717',
//   api_secret: 'LMX0UpESeefftniBt-qsdPYEx6Q',  
// });

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

app.listen(PORT, () => {
  // to confirm the app is runnign in port 3000
  console.log(`sever is running in port ${PORT} `);
  connectDB();
});


