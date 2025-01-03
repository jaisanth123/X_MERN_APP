import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import cloudinary from "cloudinary";
import Notification from "../models/notificationModel.js";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString(); // Convert ObjectId to string
    const user = await User.findOne({ _id: userId });

    // Ensure user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate the presence of text or image
    if (!text && !img) {
      return res.status(400).json({ message: "Text or image are required" });
    }

		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

    // Create new post object
    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    // Save post to the database
    await newPost.save();

    // Return successful response with the created post
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error in creating post:", error.message, error.stack || error);
    res.status(500).json({ error: "Error while creating post" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      // only the owners of the post can delete it . for that check
      return res
        .status(404)
        .json({ message: "Unauthorized to delete this post" });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    await Post.findByIdAndDelete({ _id: postId });
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(`Error in deleting post: ${error}`);
    res.status(500).json({ error: `Error while deleting post ${error}` });
  }
};

export const createComment = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id; //id of the post created
    //! or const {id} = req.params
    const userId = req.user._id.toString(); // id of the user loggined

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = {
      user: userId, // to sure what have put the comment
      text, // the comment txt the the user have writed
    };

    post.comments.push(comment);
    await post.save();
    res.status(200).json(post);

    //! notification
    const newNotification = new Notification({
      type: "comment",
      from: req.user._id,
      to: post.user,
    });

    await newNotification.save();
  } catch (err) {
    console.error(`Error in creating comment: ${error}`);
    res.status(500).json({ error: "Error while creating comment" });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      //unlike post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      //like the post
      await Post.updateOne({ _id: postId }, { $push: { likes: userId } });
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });

      res.status(200).json({ message: "Post liked successfully" });
    }
    //!Notification
    const newnotification = new Notification({
      from: userId,
      to: post.user, //which is the owner of th post
      type: "like",
    });
    await newnotification.save();
  } catch (err) {
    console.error(`Error in liking/unliking post: ${err}`);
    res.status(500).json({ error: "Error while liking/unliking post" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",

        // or . populate(user) it will also work but .seleict("-password") will not work with this type
      }) // show all the posts in the decending order of creation
      .populate({
        path: "comments.user", // it will populate and filter the info of the user object in the comment section array
        select: [
          "-password",
          "-email",
          "-following",
          "-followers",
          "-bio",
          "-link",
        ],
      });
    if (posts.length === 0) {
      return res.status(404).json([]); // if no post is found then return error message 404 not found ^^
    }

    res.status(200).json(posts);
  } catch (err) {
    console.error(`Error in getting all posts: ${err}`);
    res.status(500).json({ error: "Error while getting all posts" });
  }
};

export const getLikedPost = async (req, res) => {
  try {
    const userId = req.params.id;
    // if we go to our account it will show which post we liked
    // if we go to other accounts it will which posts they liked
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const likedPosts = await Post.find({
      _id: { $in: user.likedPosts },
    }).populate({
      path: "comments.user",
      select: [
        "-password",
        "-email",
        "-following",
        "-followers",
        "-bio",
        "-link",
      ],
    });
    //here likedPost will have the current user liked posts id . by using that id . we will fetch the entire post obj from post db

    res.status(200).json(likedPosts); // it will return all the posts which are liked by the user with all the comments of each post ^^
  } catch (err) {
    console.error(`Error in getting liked posts: ${err}`);
    res.status(500).json({ error: "Error while getting liked posts" });
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    //not params.id becaue we not use following/:id
   // console.log(userId);
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const followingUserIds = user.following;
    const feedPosts = await Post.find({ user: { $in: followingUserIds } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: ["-password"],
      });
    //user is the feild in the post schema in that first we getting the users that he follows in follwoingusersIds with that use includes $in in the users of hte post and if the follwoinguserId is the user of hte id then fetch it

    // sort it and pruplate it the according User model objects

    res.status(200).json(feedPosts); // it will return all the posts which are created by the users that he follows with all the comments of each post ^^
  } catch (err) {
    console.error(`Error in getting following posts: ${err}`);
    res.status(500).json({ error: "Error while getting following posts" });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const posts = await Post.find({ user: user.id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: ["-password"],
      }); // populating and removing the required feilds
    res.status(200).json(posts); // it will return all the posts which are created by the user with all the comments of each post ^^
  } catch (err) {
    console.error(`Error in getting user posts: ${err}`);
    res.status(500).json({ error: "Error while getting user posts" });
  }
};
