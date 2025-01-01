import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import cloudinary from "cloudinary"
import Notification from "../models/notificationModel.js";

export const createPost = async(req,res) =>{

    try{
        const {text} = req.body;
        let{img} = req.body;
        const userId = req.user._id.toString(); //it is in object so we cange it into ong
        const user = await User.findOne({_id:userId})
        if(!user){
            return res.status(404).json({message: 'User not found'})
        }
        if(!text && !img){
            return res.status(400).json({message: 'Text or image are required'})
        }

        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img)
            img = uploadedResponse.secure_url
        }


        const newPost = new Post({
            user:userId,
            text,
            img

        })

        await newPost.save();
        res.status(201).json(newPost)

    }
    catch(error){
        console.error(`Error in creating post: ${error}`);
        res.status(500).json({error:"Error while creating post"});
    }


}

export const deletePost = async(req,res) =>{
    try{
        const {id} = req.params;
        const post = await Post.findOne({_id:id})
        if(!post){
            return res.status(404).json({message: 'Post not found'})
        }
    
        if(post.user.toString() !== req.user._id.toString()){
            // only the owners of the post can delete it . for that check 
            return res.status(404).json({message: 'Unauthorized to delete this post'})
        }
        
        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0]
            await cloudinary.uploader.destroy(imgId)
        }
        await Post.findByIdAndDelete({_id : id})
        res.status(200).json({message: 'Post deleted successfully'})

    }
    catch(error){
        console.error(`Error in deleting post: ${error}`);
        res.status(500).json({error:"Error while deleting post"});
    }
}

export const createComment = async(req,res) => {
    try{

        const {text} = req.body;
        const postId = req.params.id; //id of the post created 
        //! or const {id} = req.params
        const userId = req.user._id.toString(); // id of the user loggined

        if(!text){
            return res.status(400).json({message: 'Text is required'})
        }

        const post = await Post.findOne({_id:postId})
        if(!post){
            return res.status(404).json({message: 'Post not found'})
        }

        const comment = {
            user: userId,  // to sure what have put the comment 
            text // the comment txt the the user have writed 
        }

        post.comments.push(comment)
        await post.save()
        res.status(200).json(post)

        //! notification 
        const newNotification = new Notification({
            type:"comment",
            from:req.user._id,
            to : post.user,
        })

        await newNotification.save()
    
    }
    catch(err){
        console.error(`Error in creating comment: ${error}`);
        res.status(500).json({error:"Error while creating comment"});
    }
}

export const likeUnlikePost = async (req,res) =>{
    try{
        const userId = req.user._id;
        const postId = req.params.id;
        const post = await Post.findOne({_id:postId})
        if(!post){
            return res.status(404).json({message: 'Post not found'})
        }
        const userLikedPost = post.likes.includes(userId)

        if(userLikedPost){
            //unlike post
            await Post.updateOne({_id:postId},{$pull:{likes : userId}})
            res.status(200).json({"message": "Post unliked successfully"})
    
        }
        else{
            await Post.updateOne({_id:postId},{$push:{likes:userId}})
            res.status(200).json({"message": "Post liked successfully"})
       
            //like the post
        }
        //!Notification
        const newnotification = new Notification({
            from:userId,
            to: post.user,  //which is the owner of th post 
            type:'like'
        })
        await newnotification.save()
    }
    catch(err){
        console.error(`Error in liking/unliking post: ${err}`);
        res.status(500).json({error:"Error while liking/unliking post"});
    }
}

export const getAllPosts = async(req, res) =>{
    try{

        const posts = await Post.find().sort({createdAt:-1})  // show all the posts in the decending order of creation 
        
        if(posts.length === 0){
            return res.status(404).json([])  // if no post is found then return error message 404 not found ^^
        }
        
        res.status(200).json(posts)

    }
    catch(err){
        console.error(`Error in getting all posts: ${err}`);
        res.status(500).json({error:"Error while getting all posts"});
    }

}

