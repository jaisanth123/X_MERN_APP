import jwt from "jsonwebtoken"
import User from "../models/userModel.js"
const protectRoute = async (req, res, next) => {
try{
    const token = req.cookies.jwt  //importing the token from the chrome 
    if(!token){
        return res.status(400).json({message: "unauthorized : no token provided"})
    }
    const decoded =  jwt.verify(token,process.env.JWT_SECRET)  //decoding the token with our secret key

    if(!decoded){
        return res.status(400).json({message: "unauthorized : invalid token"}) 
    }

    const user = await User.findOne({_id:decoded.userID}).select("-password") // find the user from the id without fetching the password
    // userID is the name given while signing the jwt token
    if(!user){
        return res.status(400).json({message: " user not found"})
    }

    req.user = user  // making the request user to the user
    next()


}
catch(err){
    console.error(err);
    res.status(500).json({message: 'Error in protect route'});
}


}

export default protectRoute