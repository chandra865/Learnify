import { useState, useEffect } from "react";
import axios from "axios";
const ProgressBar = ({ userId, courseId }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/progress/get-progress/${userId}/${courseId}`,
          {
            withCredentials:true
          }
        );
        // console.log(response.data.data);
        setProgress(response.data.data.progressPercentage || 0); // Ensure default value
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };

    fetchProgress();
  }, [userId, courseId]);

  return (
    <div className="mb-4">
      <p className="text-sm">Progress: {progress}%</p>
      <div className="w-full bg-gray-600 h-2 rounded">
        <div
          className="bg-blue-500 h-2 rounded transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
