import { useState } from "react";
import axios from "axios";
import { Star, MessageSquare, Send } from "lucide-react";
import { useSelector } from "react-redux";
import { reviewBaseUrl } from "../utils/endpoints";
import { toast } from "react-toastify";
import Button from "./ui/Button";
import Card from "./ui/Card";

const AddReview = () => {
  const courseId = useSelector((state) => state.course.selectedCourse._id);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hover, setHover] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const submitReview = async () => {
    if (!comment.trim()) return toast.error("Please provide validation comments");
    setSubmitting(true);
    try {
      await axios.post(`${reviewBaseUrl}`, { courseId, rating, comment }, { withCredentials: true });
      toast.success("Validation entry synchronized successfully");
      setRating(5);
      setComment("");
    } catch (error) {
      toast.error(error?.response?.data.message || "Entry synchronization failure");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="bg-white border-slate-200 p-8 space-y-6">
      <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare size={18} className="text-blue-600" /> Submit Validation
          </h3>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Authorized Module Assessment</p>
      </div>

      <div className="space-y-4">
        {/* Star Selection Matrix */}
        <div className="space-y-2">
           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Quality Metric</label>
           <div className="flex gap-2">
             {[1, 2, 3, 4, 5].map((num) => (
               <button
                 key={num}
                 className="focus:outline-none transition-transform active:scale-90"
                 onClick={() => setRating(num)}
                 onMouseEnter={() => setHover(num)}
                 onMouseLeave={() => setHover(null)}
               >
                 <Star
                   size={24}
                   className={`transition-colors ${
                     (hover || rating) >= num ? "text-amber-400 fill-current" : "text-slate-200"
                   }`}
                 />
               </button>
             ))}
           </div>
        </div>

        {/* Tactical Comment Input */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Detailed Assessment</label>
          <textarea
            placeholder="Document your experience with this module..."
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all font-medium min-h-[120px] resize-none"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {/* Submission Protocol */}
        <Button
          onClick={submitReview}
          isLoading={submitting}
          className="w-full"
          size="lg"
        >
          <Send size={16} className="mr-2" />
          Synchronize Assessment
        </Button>
      </div>
    </Card>
  );
};

export default AddReview;
