import mongoose from "mongoose";
import { seedCategories } from "../controllers/category.controller.js";
import logger from "../utils/logger.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        logger.info(`MongoDB Connected !! DB HOST: ${connectionInstance.connection.host}`);
        seedCategories();
    } catch (error) {
        logger.error("MONGODB connection error", error);
        process.exit(1);
    }
};

export default connectDB;