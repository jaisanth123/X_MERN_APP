//const express = require("express")
import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js"
import connectDB from "./db/connectDB.js"
import cookieParser from "cookie-parser"


dotenv.config();
const PORT = process.env.PORT;
const app = express()
app.use(express.json());
app.use(cookieParser())



/*app.get("/",(req,res)=>{
    res.send("X_Clone MERN")
}) */
app.use("/api/auth", authRoutes);
/*app.get("/api/auth",(req,res)=>{
    res.send("Auth route is working")
})*/



app.listen(PORT,()=>{ // to confirm the app is runnign in port 3000
    console.log(`sever is running in port ${PORT} `);
    connectDB();
})