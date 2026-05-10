import {createSlice} from "@reduxjs/toolkit";

const userSlice = createSlice({
    name :"user",
    initialState :{
        status :false,
        userData: null,
        loading: true, // Added loading state
    },
    reducers:{
        login: (state, action) =>{
            state.status = true;
            state.userData = action.payload;
            state.loading = false; // Set loading to false on success
        },

        logout: (state) =>{
            state.status = false;
            state.userData = null;
            state.loading = false;
        },

        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
})

export const {login, logout, setLoading} = userSlice.actions;

export default userSlice.reducer;