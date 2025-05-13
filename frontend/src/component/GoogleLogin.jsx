import React from "react";
import { FcGoogle } from "react-icons/fc";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const GoogleLogin = () => {
  const handleLogin = () => {
    window.open(`${API_BASE_URL}/api/v1/user/auth/google`, "_self");
  };
  return (
    <button
      className="flex flex-row items-center justify-center gap-4 w-full cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
      onClick={handleLogin}
    >
      <FcGoogle className="text-2xl" />
      <span className="">Continue with Google</span>
    </button>
  );
};

export default GoogleLogin;
