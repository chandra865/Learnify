import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setSelectedCourse } from "../store/slice/selectedCourseSlice";
import axios from "axios";
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  XCircle, 
  Terminal, 
  Target, 
  HelpCircle,
  ShieldCheck,
  Zap,
  Info,
  Layers,
  ArrowRight
} from "lucide-react";
import { toast } from "react-toastify";
import { courseBaseUrl, quizBaseUrl } from "../utils/endpoints";
import Card from "../component/ui/Card";
import Button from "../component/ui/Button";
import Badge from "../component/ui/Badge";
import Loader from "../component/Loading";

const QuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
 
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`${quizBaseUrl}/${quizId}`, { withCredentials: true });
        setQuiz(res.data.data);
      } catch (err) {
        toast.error("Intelligence node retrieval failed");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleOptionChange = (selectedOption) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion]: selectedOption,
    }));
  };

  const handleSubmit = async () => {
    if (Object.keys(userAnswers).length < quiz.questions.length) {
      toast.warning("Incomplete question matrix. Verify all nodes.");
      return;
    }

    setSubmitting(true);
    let correct = 0;
    quiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) correct++;
    });

    const calculated = Math.round((correct / quiz.questions.length) * 100);
    setScore(calculated);

    if (quiz.course && calculated >= quiz.passingScore) {
      try {
        const response = await axios.post(`${courseBaseUrl}/quiz`, { courseId: quiz.course }, { withCredentials: true });
        dispatch(setSelectedCourse(response.data.data));
        toast.success("Intelligence successfully validated");
      } catch (error) {
        toast.error("Validation sync failure");
      }
    }
    setSubmitting(false);
  };

  const goNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (loading) return <Loader />;
  if (!quiz) return null;

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#fafafa] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Intelligence Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
           <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600 border border-blue-500/20">
                    <Target size={16} />
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Cognitive Validation Hub</p>
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight uppercase">
                 {quiz.title}
              </h2>
           </div>
           <div className="flex gap-2">
              <Badge variant="outline" className="bg-white border-slate-200 text-slate-500 px-4 py-2">
                 Node Type: {quiz.quizFor?.toUpperCase() || "STANDARD"}
              </Badge>
              <Badge variant="primary" className="bg-slate-900 text-white border-transparent px-4 py-2 uppercase tracking-widest text-[9px] font-black italic">
                 Threshold: {quiz.passingScore}%
              </Badge>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Question Interface */}
          <div className="lg:col-span-2 space-y-8">
             {/* Progress Protocol */}
             <div className="space-y-3">
                <div className="flex justify-between items-end">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Progression Matrix</p>
                   <p className="text-xs font-black text-slate-900 italic">{currentQuestion + 1} / {quiz.questions.length}</p>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                   <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
             </div>

             {/* Question Node Card */}
             <Card className="p-10 border-slate-200 bg-white shadow-xl shadow-blue-900/5 rounded-[40px] space-y-10">
                <div className="space-y-4">
                   <Badge variant="outline" className="text-[10px] font-black uppercase border-blue-100 text-blue-600 bg-blue-50/50">Question Unit {currentQuestion + 1}</Badge>
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-relaxed">
                      {question.questionText}
                   </h3>
                </div>

                <div className="space-y-4">
                   {question.options.map((option, i) => (
                     <button
                       key={i}
                       onClick={() => handleOptionChange(option)}
                       className={`w-full p-6 rounded-3xl border-2 text-left transition-all flex items-center justify-between group
                         ${userAnswers[currentQuestion] === option 
                            ? "border-blue-600 bg-blue-50/30 text-slate-900 shadow-lg shadow-blue-900/5 scale-[1.02]" 
                            : "border-slate-100 bg-slate-50/50 text-slate-500 hover:border-slate-200 hover:bg-white hover:text-slate-700"}`}
                     >
                       <span className={`text-sm font-black uppercase tracking-tight ${userAnswers[currentQuestion] === option ? "text-slate-900" : "text-slate-600"}`}>
                          {option}
                       </span>
                       <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center
                         ${userAnswers[currentQuestion] === option ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white group-hover:border-slate-300"}`}>
                          {userAnswers[currentQuestion] === option && <CheckCircle size={14} />}
                       </div>
                     </button>
                   ))}
                </div>
             </Card>

             {/* Control Node Hierarchy */}
             <div className="flex items-center justify-between gap-4">
                <Button 
                  variant="outline" 
                  onClick={goBack} 
                  disabled={currentQuestion === 0}
                  className="px-8 h-14 rounded-2xl gap-2 border-slate-200 text-slate-400 hover:text-slate-900 disabled:opacity-30"
                >
                   <ChevronLeft size={20} /> Back
                </Button>

                {currentQuestion < quiz.questions.length - 1 ? (
                  <Button 
                    onClick={goNext} 
                    className="px-10 h-14 rounded-2xl gap-2 shadow-lg shadow-blue-100"
                    disabled={!userAnswers[currentQuestion]}
                  >
                     Next Unit <ChevronRight size={20} />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit} 
                    className="px-12 h-14 rounded-2xl gap-3 bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-200"
                    disabled={!userAnswers[currentQuestion] || submitting}
                  >
                     {submitting ? <Zap size={20} className="animate-spin" /> : <Target size={20} />}
                     SUBMIT VALIDATION
                  </Button>
                )}
             </div>
          </div>

          {/* Operational Metadata */}
          <aside className="space-y-8">
             <Card className="p-8 border-slate-900 bg-slate-900 text-white space-y-8 rounded-[40px] shadow-2xl shadow-slate-900/20">
                <div className="flex items-center gap-3">
                   <Terminal size={14} className="text-blue-400" />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Diagnosis Terminal</span>
                </div>

                {score !== null ? (
                  <div className="space-y-8 animate-in zoom-in-95 duration-500">
                     <div className="text-center space-y-4">
                        <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center border-4 shadow-2xl
                           ${score >= quiz.passingScore ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-emerald-500/20" : "border-rose-500 bg-rose-500/10 text-rose-400 shadow-rose-500/20"}`}>
                           {score >= quiz.passingScore ? <CheckCircle size={48} /> : <XCircle size={48} />}
                        </div>
                        <div className="space-y-1">
                           <p className="text-4xl font-black tracking-tighter italic">{score}%</p>
                           <p className={`text-[10px] font-black uppercase tracking-widest ${score >= quiz.passingScore ? "text-emerald-400" : "text-rose-400"}`}>
                              Validation Status: {score >= quiz.passingScore ? "OPTIMAL" : "CRITICAL FAILURE"}
                           </p>
                        </div>
                     </div>

                     <div className="pt-8 border-t border-white/5 space-y-4 text-center">
                        <p className="text-xs font-medium text-slate-500 leading-relaxed italic">
                           {score >= quiz.passingScore 
                             ? "Intelligence threshold achieved. Certification protocol synchronized." 
                             : "Threshold mismatch. Re-analysis of local intelligence nodes required."}
                        </p>
                        <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-white" onClick={() => window.location.reload()}>
                           Re-Initialize node
                        </Button>
                     </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                     <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Integrity Check</span>
                           <Layers size={14} className="text-blue-400" />
                        </div>
                        <p className="text-xs font-bold text-slate-300">Awaiting submission...</p>
                     </div>

                     <div className="p-6 bg-blue-600/10 rounded-[32px] border border-blue-500/20 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                           <HelpCircle size={16} className="text-blue-400" />
                           <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                              Validation requires 100% question matrix completion. Node persistence active on global local storage.
                           </p>
                        </div>
                     </div>
                  </div>
                )}
                
                <div className="pt-4 flex items-center justify-center gap-2">
                   <ShieldCheck size={12} className="text-blue-500" />
                   <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Secure SHA-256 Validation</span>
                </div>
             </Card>

             <Button variant="ghost" onClick={() => navigate(-1)} className="w-full text-slate-400 hover:text-slate-900 text-[10px] font-black uppercase tracking-widest">
                Abort Operational Sync
             </Button>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
