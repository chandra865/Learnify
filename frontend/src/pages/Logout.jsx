import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { logout } from '../store/slice/userSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {persistor } from "../store/store.js";
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;


const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
  useEffect(() => {

    const logoutUser = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/user/logout`, {
          withCredentials: true,
        });
    
        toast.success(response.data.message);
        
        // Clear Redux state and persist
        await persistor.purge();
        dispatch(logout());
        localStorage.clear();
        // Only navigate once everything is cleared
        navigate("/");
    
      } catch (error) {
        toast.error(
          error?.response?.data.message || "Error logging out"
        );
      }
    };
    

      logoutUser();

  }, [])

  return (
    <div></div>
  )
}

export default Logout