import { useState } from "react";
import {useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { logout } from "../store/slice/userSlice";
import { toast } from "react-toastify";

const Navbar = () => {
  // const userState = useSelector((state)=>state);
  // const authState = userState.user.status;
  const {status} = useSelector((state)=>state.user);
  
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          MyApp
        </Link>

        {/* Navigation Links */}
        <ul className="flex gap-4">
          {!status ? (
            <>
              <li>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-green-600 rounded hover:bg-green-500"
                >
                  Login
                </Link>
              </li>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700"
              >
                Dashboard
              </Link>
              <Link
                to="/logout"
                className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700"
              >
                Logout
              </Link>
              
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
