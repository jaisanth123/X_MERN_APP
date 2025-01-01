import express from "express";
import {signup,login,logout,getMe} from "../controllers/authControllers.js"
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login",login)
router.post("/logout",logout)
router.get("/me",protectRoute,getMe)
//where protectRoute is a middleware and getme is the function form authControllers


export default router;