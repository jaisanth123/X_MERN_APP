import express from "express";
const router = express.Router();
import protectRoute from "../middleware/protectRoute.js";

import {
  getNotifications,
  deletetNotifications,
} from "../controllers/notificationController.js";

router.get("/", protectRoute, getNotifications);
router.delete("/", protectRoute, deletetNotifications);
export default router;
