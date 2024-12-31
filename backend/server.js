//const express = require("express")
import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js"
import connectDB from "./db/connectDB.js"



dotenv.config();
const PORT = process.env.PORT;
const app = express()



/*app.get("/",(req,res)=>{
    res.send("X_Clone MERN")
}) */
app.use(express.json())
app.use("/api/auth",authRoutes)

app.listen(PORT,()=>{ // to confirm the app is runnign in port 3000
    console.log(`sever is running in port ${PORT} `);
    connectDB();
})