import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import StarRating from "./StarRating";
import { toast } from "react-toastify";
import { reviewBaseUrl } from "../utils/endpoints";
import Card from "./ui/Card";
import { MessageSquare, User, Quote } from "lucide-react";

const CourseReviews = () => {
  const courseId = useSelector((state) => state.course.selectedCourse._id);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!courseId) return;
      try {
        const response = await axios.get(`${reviewBaseUrl}/${courseId}`, { withCredentials: true });
        setReviews(response.data.data);
      } catch (error) {
        toast.error("Review synchronization failed");
      }
    };
    fetchReviews();
  }, [courseId]);

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Peer Validations</h3>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {reviews?.length || 0} Authenticated Entries
        </span>
      </div>

      {reviews?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map(({ _id, userId, rating, comment }) => (
            <Card key={_id} className="p-6 bg-white border-slate-200 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src={userId?.profilePicture?.url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                            alt={userId?.name || "Participant"}
                            className="w-8 h-8 rounded-full border border-slate-100 object-cover"
                        />
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-900 leading-none">
                                {userId?.name || "Verified Participant"}
                            </span>
                            <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest mt-1">
                                Platform User
                            </span>
                        </div>
                    </div>
                    <StarRating rating={rating} />
                </div>
                
                <div className="relative">
                    <Quote size={12} className="absolute -top-1 -left-1 text-blue-100 -z-10" />
                    <p className="text-sm text-slate-600 font-medium leading-relaxed italic line-clamp-4">
                        "{comment}"
                    </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-16 border border-dashed border-slate-200 rounded-2xl text-center space-y-4 bg-white">
           <MessageSquare size={32} className="mx-auto text-slate-200" />
           <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No validation entries found for this module</p>
        </div>
      )}
    </div>
  );
};

export default CourseReviews;
