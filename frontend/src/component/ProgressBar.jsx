import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const ProgressBar = ({ userId, courseId }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/progress/get-progress/${userId}/${courseId}`,
          {
            withCredentials:true
          }
        );
        
        setProgress(response.data.data.progressPercentage || 0); // Ensure default value
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };

    fetchProgress();
  }, [userId, courseId]);

  return (
    <div className="mb-4 w-full">
      <div className="relative w-full bg-gray-700 h-3 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-sm text-white-300 text-center mt-2">{Math.round(progress)}%</p>
    </div>
  );
};

export default ProgressBar;
