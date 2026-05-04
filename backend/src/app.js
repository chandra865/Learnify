import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import morgan from "morgan";
import errorHandler from "./middlewares/errorHandler.js";
import logger from "./utils/logger.js";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

const app = express();

// Set security HTTP headers
app.use(helmet());

// Rate limiting configuration
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: "Too many requests from this IP, please try again after 15 minutes",
    handler: (req, res, next, options) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(options.statusCode).send(options.message);
    },
});

// Apply rate limiting to all requests
app.use(limiter);

const morganFormat = ":method :url :status :res[content-length] - :response-time ms";

app.use(morgan(morganFormat, {
    stream: {
        write: (message) => logger.info(message.trim()),
    },
}));

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))



app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : "/tmp/"
}));
app.use(express.json({limit:"36kb"})); // when data coming in json formate 
app.use(express.urlencoded({extended:true, limit:"36kb"})) //when data coming from url
app.use(express.static("public")) //public folder adding file
app.use(cookieParser());//for performing operation on cookie  




//routes

import userRouter from "./routes/user.routes.js"
import courseRouter from "./routes/course.routes.js"
import mediaRouter from "./routes/media.routes.js"
import reviewRouter from "./routes/review.routes.js"
import progressRouter from "./routes/progress.routes.js"
import quizRouter from "./routes/quiz.routes.js"
import category from "./routes/category.routes.js"
import cartRouter from "./routes/cart.routes.js"
import transactionRouter from "./routes/transaction.routes.js"
import couponRouter from "./routes/coupon.routes.js"
import sectionRouter from "./routes/section.routes.js"
import lectureRouter from "./routes/lecture.routes.js"
import enrollmentRouter from "./routes/enrollment.routes.js"
import otpRouter from "./routes/otp.routes.js";
import PasswordResetTokenRouter from "./routes/PasswordResetToken.routes.js";

//routes declaration
app.use("/api/v1/user", userRouter);
app.use("/api/v1/course",courseRouter);
app.use("/api/v1/media",mediaRouter);
app.use("/api/v1/review",reviewRouter);
app.use("/api/v1/progress",progressRouter);
app.use("/api/v1/quiz",quizRouter);
app.use("/api/v1/category",category);
app.use("/api/v1/cart",cartRouter);
app.use("/api/v1/transaction",transactionRouter);
app.use("/api/v1/coupon",couponRouter);
app.use("/api/v1/lecture", lectureRouter);
app.use("/api/v1/section",sectionRouter);
app.use("/api/v1/enrollment", enrollmentRouter);
app.use("/api/v1/otp", otpRouter);
app.use("/api/v1/password-reset-request", PasswordResetTokenRouter);
















app.use(errorHandler);
export {app};