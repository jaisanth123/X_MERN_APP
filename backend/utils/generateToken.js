import jwt from "jsonwebtoken"

const generateToken =(userID , res) =>{
    const token =jwt.sign({userID}, process.env.JWT_SECRET,{ expiresIn : "15d"})
    
    res.cookie("jwt",token,{
        maxAge:15*24*60*60,
        httpOnly:true ,  //prevent xss accacks
        sameSite : "strict", // prevents CSRF attacks
        secure : process.env.NODE_ENV !== "development"  // if NODE_ENV is in developement state the secure will be false if the env is not in development state it will be true 
    })
}

export default generateToken ;