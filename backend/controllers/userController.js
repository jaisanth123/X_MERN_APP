import User from "../models/userModel.js";

export const getProfile = async(req,res) =>{
    try{
        const {username} = req.params;
        const user = await User.findOne({username})
        if(!user) return res.status(404).json({message: 'error in getprofile'})
        
        res.status(200).json({user})
    }
    catch(err){
        console.error(err.message);
        res.status(500).json({message: 'Server Error'})
    }
}

export const followUnfollowUser = async(req,res) =>{
    try{
        const {id} = req.params;
        const userToModify = await User.findById({_id : id})
        const currentUser = await User.findById({_id : req.user._id}) // since the portected route will make the req as the  the user who is loggined

        if(!userToModify || !currentUser) {
            return res.status(404).json({message :"user not found"})
        }

        if(id === req.user._id){
            return res.status(400).json({message: 'You cannot follow yourself'})
        }

        const isFollwing = currentUser.following.includes(id)  // it will check the following array of a current user if he follows 

        if(isFollwing){
            //dounfollow
            //await User.findByIdAndUpdate({_id : })
            await User.findByIdAndUpdate({_id:id},{$pull:{followers:req.user._id}})
            await User.findByIdAndUpdate({_id:req.user._id},{$pull:{following: id}})
            res.status(200).json({message:"unfollow successfully"})
        }
        else{
            //dofollow
            await User.findByIdAndUpdate({_id : id} , {$push:{followers : req.user._id}})  // to put my id in the follower id array
            //{_id : id} means it will get the json of the onw with id here it is the usertoModefied
            await User.findByIdAndUpdate({_id :req.user._id},{$push:{following:id}})  // to put that id ih my following array
            // {_id :req.user._id} this will take the json obj here which is the current user 
            res.status(200).json({message:"follow successfully"})


        }

    }
    catch(err){
        console.error(err.message);
        res.status(500).json({message: 'error in followUnfollowUser'})
    }
}