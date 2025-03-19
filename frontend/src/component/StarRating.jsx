import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"; // Import Font Awesome icons

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating); 
  const hasHalfStar = rating - fullStars >= 0.5; 

  return (
    <div className="flex items-center text-yellow-400 text-xl">
        <span className="mr-2 text-yellow-400 text-lg font-semibold">
        {rating?.toFixed(1) || "0.0"}
      </span>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>
          {i < fullStars ? (
            <FaStar size={16}/> // Full Star
          ) : i === fullStars && hasHalfStar ? (
            <FaStarHalfAlt  size={16} /> // Half Star
          ) : (
            <FaRegStar  size={16} /> // Empty Star
          )}
        </span>
      ))}
      
    </div>
  );
};

export default StarRating;
