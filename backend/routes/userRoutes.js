import express from "express"
import protectRoute from "../middleware/protectRoute.js"
import { getProfile ,followUnfollowUser    } from "../controllers/userController.js"

const router = express.Router()


router.get("/profile/:username",protectRoute,getProfile)
router.get("/profile/:id",protectRoute,followUnfollowUser)



export default router