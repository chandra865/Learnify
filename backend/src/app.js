import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import errorHandler from "./middlewares/errorHandler.js";
import {config} from "dotenv";
config({
    path : "./.env"   
})

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : "/tmp/"
}));
app.use(express.json({limit:"16kb"})); // when data coming in json formate 
app.use(express.urlencoded({extended:true, limit:"16kb"})) //when data coming from url
app.use(express.static("public")) //public folder adding file
app.use(cookieParser());//for performing operation on cookie  




//routes

import userRouter from "./routes/user.routes.js"
import courseRouter from "./routes/course.routes.js"
import mediaRouter from "./routes/media.routes.js"
import reviewRouter from "./routes/review.routes.js"

//routes declaration
app.use("/api/v1/user", userRouter);
app.use("/api/v1/course",courseRouter);
app.use("/api/v1/media",mediaRouter);
app.use("/api/v1/review",reviewRouter);


















app.use(errorHandler);
export {app};