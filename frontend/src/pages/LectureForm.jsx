import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const LectureForm = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [lectureData, setLectureData] = useState({
    title: "",
    videoUrl: "",
  });

  const handleChange = (e) => {
    setLectureData({ ...lectureData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/course/add-lecture/${courseId}`,
        lectureData,
        { withCredentials: true }
      );
      alert("Lecture added successfully!");
      navigate("/add-lecture");
    } catch (error) {
      console.error("Error adding lecture:", error.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-bold mb-4">Add Lecture</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Lecture Title"
            value={lectureData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3"
            required
          />
          <input
            type="text"
            name="videoUrl"
            placeholder="Video URL"
            value={lectureData.videoUrl}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3"
            required
          />
          <div className="flex justify-between">
            <button type="button" className="px-4 py-2 bg-gray-500 text-white rounded" onClick={() => navigate("/add-lecture")}>
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              Add Lecture
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LectureForm;
