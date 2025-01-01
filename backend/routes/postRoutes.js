import express from 'express';
import protectRoute from '../middleware/protectRoute.js';

import { createPost ,deletePost,createComment ,likeUnlikePost ,getAllPosts} from '../controllers/postController.js';
const router = express.Router();
router.get("/all",protectRoute,getAllPosts)
router.post("/create",protectRoute,createPost)
router.post("/like/:id",protectRoute,likeUnlikePost)
router.post("/comment/:id",protectRoute,createComment)
router.delete("/:postId",protectRoute,deletePost)






export default router;