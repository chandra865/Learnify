import mongoose from "mongoose";
import {seedCategories} from "../controllers/category.controller.js"
const connectDB = async () =>{
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
        console.log(`\n MongoDB Connected !! DB HOST: ${connectionInstance.connection.host}`);
        seedCategories();
    }catch(error){
        console.log("MONGODB connection error", error);
        process.exit(1);
    }
}

export default connectDB;