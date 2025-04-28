import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { logout } from '../store/slice/userSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {persistor } from "../store/store.js";
import axios from 'axios';


const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
  useEffect(() => {

    const logoutUser = async () =>{
        try {
          const response = await axios.get(
            "http://localhost:8000/api/v1/user/logout",
            {
              withCredentials: true,
            }
          );
          console.log(response);// Log only response data
         
          toast.success(response.data.message);
          navigate("/");
          
        } catch (error) {
          console.error(error.response?.data || "Request failed"); // Handle errors properly
          toast.error(error.response?.data.message || "Request failed");
        }finally{
          await persistor.purge();
          dispatch(logout());
          navigate("/");
        }
      }

      logoutUser();

  }, [])

  return (
    <div></div>
  )
}

export default Logout