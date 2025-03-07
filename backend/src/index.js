import connectDB from "./db/connection.js";
import {app} from './app.js';


//Database connection and server start
connectDB()
.then(()=>{
    app.listen(process.env.PORT, () =>{
        console.log(`Server is running at port : ${process.env.PORT}`);
    });
})
.catch((error) =>{
    console.log("MongoDb Connnection failed !!!", err);
})


