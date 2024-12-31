import mongoose from "mongoose";

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB Connected");
    }
    catch(err){
        console.error(`Error in connectind db ${err.message}`);
        process.exit(1);
    }
}

export default connectDB;