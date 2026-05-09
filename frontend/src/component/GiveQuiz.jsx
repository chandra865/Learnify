import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { quizBaseUrl } from "../utils/endpoints";
import { Terminal, ArrowRight, ClipboardCheck } from "lucide-react";
import Card from "./ui/Card";
import Button from "./ui/Button";

const GiveQuiz = ({ Id, type }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
        if (!Id) return;
        try {
            const response = await axios.get(
            `${quizBaseUrl}/get-all-quiz/${Id}?quizFor=${type}`,
            { withCredentials: true }
            );
            setQuizzes(response.data.data);
        } catch (error) {
            // Quiet fail or log
        } finally {
            setLoading(false);
        }
    };
    fetchQuizzes();
  }, [Id, type]);

  const handleGiveQuizClick = (quizId) => {
    window.open(`/quiz/${quizId}`, "_blank");
  };

  if (loading) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Assessment Matrix</h3>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{quizzes.length} Logical Checks</span>
      </div>

      {quizzes.length === 0 ? (
        <div className="p-10 border border-dashed border-slate-200 rounded-xl text-center bg-slate-50/50">
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No terminal assessments synchronized for this node</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {quizzes.map((quiz) => (
            <Card
              key={quiz._id}
              className="p-5 flex items-center justify-between bg-white border-slate-200 group hover:border-blue-200 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <ClipboardCheck size={20} />
                 </div>
                 <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 tracking-tight">{quiz.title}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Node Validation Protocol</p>
                 </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleGiveQuizClick(quiz._id)}
                className="text-blue-600 hover:text-white hover:bg-blue-600"
              >
                Initiate Protocol <ArrowRight size={14} className="ml-2" />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GiveQuiz;
