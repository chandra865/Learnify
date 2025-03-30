import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import courseReducer from "./slice/selectedCourseSlice";

export const store = configureStore({
    reducer :{
        user : userReducer,
        course : courseReducer,
    }
})