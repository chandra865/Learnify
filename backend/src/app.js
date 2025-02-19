import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:"16kb"})); // when data coming in json formate 
app.use(express.urlencoded({extended:true, limit:"16kb"})) //when data coming from url
app.use(express.static("public")) //public folder adding file
app.use(cookieParser());//for performing operation on cookie  





















export {app};