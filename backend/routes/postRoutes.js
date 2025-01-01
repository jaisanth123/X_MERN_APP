import express from "express";
import protectRoute from "../middleware/protectRoute.js";

import {
  createPost,
  deletePost,
  createComment,
  likeUnlikePost,
  getAllPosts,
  getLikedPost,
  getFollowingPosts,
  getUserPosts,
} from "../controllers/postController.js";
const router = express.Router();
router.get("/all", protectRoute, getAllPosts); // get all posts
router.get("/following", protectRoute, getFollowingPosts); // get the post posted by the follwoing people
router.get("/user/:id", protectRoute, getUserPosts); // get the post posted by the user itself
router.post("/create", protectRoute, createPost); // create a post
router.post("/like/:id", protectRoute, likeUnlikePost); // like and unlike a post
router.post("/comment/:id", protectRoute, createComment); //comment a on a post
router.delete("/:postId", protectRoute, deletePost); // delete a post
router.get("/likes/:id", protectRoute, getLikedPost); // get the post that have been liked by the user

export default router;
