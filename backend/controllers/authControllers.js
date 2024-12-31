import User from "../models/userModel.js"
import bcrypt from "bcryptjs"
import generateToken from "../utils/generateToken.js";



//! ==================== SIGNUP CONTROLLER ====================

export const signup = async (req,res) =>{
    try{
        const {username,fullname,email,password} = req.body;



        //! email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    


        if(!emailRegex.test(email)){
            return res.status(400).json({error:"Invalid email format"})
        }



        //! make sure it is a unique email and name
        const existingEmail = await User.findOne({email}) // now checking with email we can also fetch by usernaem 

        //note since the both variables are email we can give email alone not to give email:email but it is also correct

        const existingUsername = await User.findOne({username}) 

        if(existingEmail || existingUsername) {
            return res.status(400).json({error:"Email or Username already exists"})
        }


        //! password length chcek
        if(password.length < 8){
            return res.status(400).json({error:"Password should be at least 8 characters long"})
        }


        //! password salting and hasing 
        const salt = await bcrypt.genSalt(10); // it will do 10 salt and hash 10 times 
        const hashedPassword = await bcrypt.hash(password,salt)


        //! newUser with hased password
        const newUser = new User({
            username,
            fullname,
            email,
            password: hashedPassword,  //since names, emial are same we dont need to give email:email but we changed password so do did like this
        })


        //! newUser saved in db
        if(newUser){

            generateToken(newUser._id , res)

            await newUser.save();
            res.status(201).json({
                _id : newUser._id,
                username: newUser.username,
                fullname: newUser.fullname,
                email: newUser.email,
                followers:newUser.followers,
                following:newUser.following,
                profileImg : newUser.profileImg,
                coverImg: newUser.converImg,
                big : newUser.bio,
                link : newUser.link
            })
        }
        else{
            res.status(400).json({error:"Invalid user Data"})
        }



    }
    catch(error){
        console.error(`error in signup: ${error}`);
        res.status(500).json({error:"Server Error"});
    }
}



//! ==================== LOGIN CONTROLLER ====================

export const login = async(req,res) =>{

    try{
        const {username , password } = req.body
        const user = await User.findOne({username}) 
        const isPasswordCorrect = await bcrypt.compare(password , User.password || "") // it is used avoid app crash

        if(!user){
            return res.status(404).json({error:"User not found "})}
        generateToken(user._id , res)
        res.status(200).json({
            _id : user._id,
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            followers:user.followers,
            following:user.following,
            profileImg : user.profileImg,
            coverImg: user.converImg,
            big : user.bio,
            link : user.link
        })

        
    }
    catch(error){
        console.error(`error in login: ${error}`);
        res.status(500).json({error:"Error while Login"});
    }
}


//! ==================== LOGIN CONTROLLER ====================
export const logout = async(req,res) =>{
    try{
        res.cookie("jwt","",{maxAge: 0}) // it will create and next second it will delete . since it have same coockie name the old coockie will be overwrited
        res.status(200).json({message:"Logged out successful"})

        //bug: after running this the cookie is

    }
    catch(error){
        console.error(`error in logout: ${error}`);
        res.status(500).json({error:"Error while Logout"});
    }
}

//! ==================== GETME CONTROLLER ====================

export const getMe = async(req,res) =>{
    try{
        const user = await User.findOne({_id:req.user._id}).select("-password")
        res.status(200).json(user);

    }
    catch(error){
        console.error(`error in getMe: ${error}`);
        res.status(500).json({error:"Error while getting user info"});
    }
}