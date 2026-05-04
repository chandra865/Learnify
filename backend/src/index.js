import connectDB from "./db/connection.js";
import { app } from './app.js';
import { config } from "dotenv";
import logger from "./utils/logger.js";

config({
    path: "./.env"
});

// Database connection and server start
connectDB()
    .then(() => {
        const port = process.env.PORT || 8000;
        app.listen(port, () => {
            if (!process.env.PORT) {
                logger.warn("PORT is not defined in environment, using default 8000");
            }
            logger.info(`Server is running at port : ${port}`);
        });
    })
    .catch((error) => {
        logger.error("MongoDb Connection failed !!!", error);
    });



