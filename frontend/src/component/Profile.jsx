import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {FaTwitter, FaLinkedin, FaInstagram, FaYoutube, FaEnvelope, FaPhone} from "react-icons/fa";

const Profile = () => {
  const user = useSelector((state) => state.user.userData);

  return (
    <div>
      {/* Profile Header */}
      <div className="p-6 flex flex-row gap-10 bg-gray-800 text-white rounded-lg shadow-md">
        <img
          src={user.profilePicture?.url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full border-2 border-blue-500"
        />

        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-300">
            {user.role === "instructor" ? user.bio : "" || "No bio available."}
          </p>
          <div className="mt-2 flex gap-3">
            {user.socialLinks?.linkedin && (
              <a
                href={user.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-500"
              >
                <FaLinkedin size={20} />
              </a>
            )}
            {user.socialLinks?.twitter && (
              <a
                href={user.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-400"
              >
                <FaTwitter size={20} />
              </a>
            )}
            {user.socialLinks?.youtube && (
              <a
                href={user.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-400"
              >
                <FaYoutube size={20} />
              </a>
            )}
            {user.socialLinks?.instagram && (
              <a
                href={user.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-400"
              >
                <FaInstagram size={20} />
              </a>
            )}
          </div>
          <div className="mt-2">
            <p className="text-gray-400 flex items-center gap-2">
              <FaEnvelope size={16} /> {user.email}
            </p>
          </div>
          <Link
            to="/edit-profile"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mt-3 inline-block"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
