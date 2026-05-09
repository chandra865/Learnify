import { Star, StarHalf } from "lucide-react";

const StarRating = ({ rating = 0 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="relative">
            {i < fullStars ? (
              <Star size={14} className="text-amber-400 fill-amber-400" />
            ) : i === fullStars && hasHalfStar ? (
              <StarHalf size={14} className="text-amber-400 fill-amber-400" />
            ) : (
              <Star size={14} className="text-slate-200 fill-slate-50" />
            )}
          </div>
        ))}
      </div>
      <span className="text-xs font-black text-slate-400 tracking-tight ml-1">
        {rating?.toFixed(1)}
      </span>
    </div>
  );
};

export default StarRating;
