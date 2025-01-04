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
import path from "path"
dotenv.config();
const PORT = process.env.PORT;
const app = express();
const __dirname = path.resolve()

app.use(express.json({
  limit : "10mb"
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



app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);



// to execute both frontend and backend 
if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname,"/frontend/build")))
  app.use("*",(req,res)=>{
    res.sendFile
  })
  // it will convert all the frontend file into a single static file which is going to be stored inside __dirbame/frontend/build

}

app.listen(PORT, () => {
  // to confirm the app is runnign in port 3000
  console.log(`sever is running in port ${PORT} `);
  connectDB();
});


