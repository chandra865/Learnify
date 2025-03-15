import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { login } from "../store/slice/userSlice";

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userData);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [socialLinks, setSocialLinks] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSocialLinks((prevLinks) => ({
      ...prevLinks,
      [name]: value,
    }));
  };

  useEffect(() => {
    setName(user.name);
    setBio(user.bio);
    setProfilePicture(JSON.stringify({
      publicId: user.profilePicture?.publicId || "",
      url: user.profilePicture?.url ||"https://cdn-icons-png.flaticon.com/512/149/149071.png"
  }));
    setImgPreview(user.profilePicture?.url ||
        "https://cdn-icons-png.flaticon.com/512/149/149071.png");
    setSocialLinks({
      twitter: user.socialLinks?.twitter,
      instagram: user.socialLinks?.instagram,
      youtube: user.socialLinks?.youtube,
      linkedin: user.socialLinks?.linkedin,
    });
  }, [user]);

  // Handle Input Change
 

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("name",name);
    formData.append("bio",bio);
    formData.append("profilePicture",profilePicture);
    formData.append("socialLinks",JSON.stringify(socialLinks));
    console.log(profilePicture);
    try{
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/update-profile",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data", // Important for file upload
          },
        }
      )
      alert(response.data.message || "profile updated successfully");
      dispatch(login(response.data.data));
      navigate("/dashboard/profile");
    }catch(error){
      alert(error.response.data.message||"error occur while updataing profile")
    }
  };


   const uploadMedia = async (file, mediaType) => {
      const formData = new FormData();
      formData.append("media", file); // Attach the file
      formData.append("mediaType", mediaType); // Specify media type ("thumbnail" or "video")
      try {
        const response = await axios.post(
          "http://localhost:8000/api/v1/media/upload-media",
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data", // Important for file upload
            },
          }
        );
        // console.log(`Upload ${mediaType} Success:`, response.data.data);
        toast.success(`${mediaType} Uploaded  Successfully`);
        return response.data.data; // Contains { publicId, url }
      } catch (error) {
        // console.error(`Upload ${mediaType} Failed:`, error.response.data);
        throw error;
      }
    };
  
    const handleFileChange = async (event, mediaType) => {
      const file = event.target.files[0]; // Get the selected file
  
      if (!file) {
        alert("No file selected");
        return;
      }
  
      try {
        const mediaData = await uploadMedia(file, mediaType);
        // console.log(`${mediaType} Uploaded:`, mediaData);
  
        // Store publicId & URL in state (for form submission)
            setImgPreview(mediaData.profilepic.url);
            setProfilePicture(
                JSON.stringify({
                    publicId: mediaData.profilepic.publicId,
                    url: mediaData.profilepic.url,
                  })
            )
            event.target.value = "";
        console.log(mediaData);
      } catch (error) {
        // console.error(`Error uploading ${mediaType}:`, error);
        toast.error(`Error while uploading ${mediaType}`);
        event.target.value = "";
      }
    };


    return (
      <div className=" bg-gray-800 w-full min-h-screen text-white flex justify-center items-center">
        
        <div className="w-[480px] p-6 rounded-lg shadow-lg bg-gray-900 text-white">
          <div className="flex justify-center">
            <label className="relative cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                name="media"
                onChange={(e) => handleFileChange(e, "profilepic")}
              />
              <img
                src={imgPreview}
                alt="Profile"
                className="w-14 h-14 rounded-full border-2 border-blue-500 object-cover"
              />
            </label>
          </div>
    
          <h2 className="text-2xl font-bold text-center mb-2">Edit Profile</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <label className="text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className="border p-2 rounded"
              required
            />
    
            <label className="text-sm font-medium">Bio</label>
            <textarea
              name="bio"
              value={bio}
              onChange={(e)=>setBio(e.target.value)}
              className="border p-2 rounded h-15"
            />
    
            <label className="text-sm font-medium">LinkedIn</label>
            <input
              type="text"
              name="linkedin"
              value={socialLinks?.linkedin}
              onChange={handleChange}
              className="border p-2 rounded"
            />
    
            <label className="text-sm font-medium">Twitter</label>
            <input
              type="text"
              name="twitter"
              value={socialLinks?.twitter}
              onChange={handleChange}
              className="border p-2 rounded"
            />
    
            <label className="text-sm font-medium">YouTube</label>
            <input
              type="text"
              name="youtube"
              value={socialLinks?.youtube}
              onChange={handleChange}
              className="border p-2 rounded"
            />
    
            <label className="text-sm font-medium">Instagram</label>
            <input
              type="text"
              name="instagram"
              value={socialLinks?.instagram}
              onChange={handleChange}
              className="border p-2 rounded"
            />
    
            <div className="flex gap-2 mt-3">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                Save Changes
              </button>
             
            </div>
          </form>
        </div>
      </div>
    );
    
};

export default EditProfile;
