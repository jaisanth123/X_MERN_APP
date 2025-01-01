import express from 'express';
import protectRoute from '../middleware/protectRoute.js';

import { createPost ,deletePost,createComment ,likeUnlikePost ,getAllPosts,getLikedPost,getFollowingPosts} from '../controllers/postController.js';
const router = express.Router();
router.get("/all",protectRoute,getAllPosts)
router.get("/following",protectRoute,getFollowingPosts)
router.post("/create",protectRoute,createPost)
router.post("/like/:id",protectRoute,likeUnlikePost)
router.post("/comment/:id",protectRoute,createComment)
router.delete("/:postId",protectRoute,deletePost)
router.get("/likes/:id",protectRoute,getLikedPost)






export default router;