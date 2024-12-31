import express from "express";
import {signup,login,logout} from "../controllers/authControllers.js"

const router = express.Router();

router.post("/signup",signup)
router.post("/login",signup)
router.post("/logout",signup)


export default router