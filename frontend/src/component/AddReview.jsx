import { useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";

const AddReview = ({ courseId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hover, setHover] = useState(null);

  const submitReview = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/review/add-review",
        { courseId, rating, comment },
        { withCredentials: true }
      );
      console.log(response.data.data);
      alert("Review submitted!");
      setRating(5);
      setComment("");
    } catch (error) {
      alert(error.response?.data?.message || "Error submitting review");
    }
  };

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg mt-4">
      <h3 className="text-xl font-bold mb-2 text-gray-200">Add a Review</h3>

      {/* Star Rating */}
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((num) => (
          <FaStar
            key={num}
            className={`cursor-pointer text-2xl transition duration-200 ${
              (hover || rating) >= num ? "text-yellow-400" : "text-gray-500"
            }`}
            onClick={() => setRating(num)}
            onMouseEnter={() => setHover(num)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
      </div>

      {/* Review Input */}
      <textarea
        placeholder="Write your review..."
        className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      {/* Submit Button */}
      <button
        className="bg-blue-500 px-6 py-2 mt-2 rounded-lg text-white font-semibold hover:bg-blue-600 transition"
        onClick={submitReview}
      >
        Submit Review
      </button>
    </div>
  );
};

export default AddReview;
