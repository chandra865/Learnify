import { useState } from "react";
import axios from "axios";
import { Star, Send, Terminal, ShieldCheck, Zap } from "lucide-react";
import { useSelector } from "react-redux";
import { reviewBaseUrl } from "../utils/endpoints";
import { toast } from "react-toastify";
import Card from "./ui/Card";
import Button from "./ui/Button";

const AddReview = () => {
  const courseId = useSelector((state) => state.course.selectedCourse?._id);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hover, setHover] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitReview = async () => {
    if (!courseId || !comment.trim()) {
      toast.error("Intelligence payload incomplete");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${reviewBaseUrl}`, 
        { courseId, rating, comment }, 
        { withCredentials: true }
      );
      toast.success("Intelligence successfully propagated");
      setRating(5);
      setComment("");
    } catch (error) {
      toast.error("Feedback transmission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-8 border-slate-200 bg-white space-y-8 overflow-hidden group">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600 border border-blue-500/20">
               <Send size={14} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Feedback Deployment</p>
         </div>
         <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onMouseEnter={() => setHover(num)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => setRating(num)}
                  className="p-1 transition-all transform hover:scale-110 active:scale-95"
                >
                   <Star 
                     size={24} 
                     className={`transition-all ${ (hover || rating) >= num ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-50" }`} 
                   />
                </button>
              ))}
            </div>
         </div>
      </div>

      <div className="space-y-4">
         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Subjective Analysis Payload</label>
         <textarea
           placeholder="Synchronize your experience..."
           className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 text-sm font-bold h-32 focus:ring-2 focus:ring-blue-600/10 outline-none transition-all placeholder:text-slate-300 resize-none"
           value={comment}
           onChange={(e) => setComment(e.target.value)}
         />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
               <ShieldCheck size={14} className="text-emerald-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Authenticity Verified</span>
            </div>
         </div>
         <Button 
           size="sm" 
           onClick={submitReview} 
           disabled={loading}
           className="gap-2 px-8 shadow-xl shadow-blue-900/10"
         >
            {loading ? <Zap size={14} className="animate-spin" /> : <Terminal size={14} />}
            Commit intelligence
         </Button>
      </div>
    </Card>
  );
};

export default AddReview;
