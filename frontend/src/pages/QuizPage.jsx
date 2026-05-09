import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setSelectedCourse } from "../store/slice/selectedCourseSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { courseBaseUrl, quizBaseUrl } from "../utils/endpoints";
import Card from "../component/ui/Card";
import Button from "../component/ui/Button";
import Badge from "../component/ui/Badge";
import { ChevronLeft, ChevronRight, ClipboardCheck, Terminal, AlertCircle, CheckCircle2 } from "lucide-react";

const QuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitting, setSubmitting] = useState(false);
 
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`${quizBaseUrl}/${quizId}`, { withCredentials: true });
        setQuiz(res.data.data);
      } catch (err) {
        toast.error("Quiz synchronization failure");
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleOptionChange = (selectedOption) => {
    setUserAnswers((prev) => ({ ...prev, [currentQuestion]: selectedOption }));
  };

  const handleSubmit = async () => {
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
        toast.success("Validation protocol successfully synchronized");
      } catch (error) {
        toast.error("Protocol update synchronization failure");
      }
    }
    setSubmitting(false);
  };

  if (!quiz) return (
     <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
     </div>
  );

  const question = quiz.questions[currentQuestion];
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;

  return (
    <div className="min-h-screen bg-[#fafafa] py-16">
      <div className="container mx-auto px-4 max-w-3xl space-y-8">
        
        {/* Quiz Terminal Header */}
        <div className="flex items-center justify-between">
           <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ChevronLeft size={16} className="mr-2" /> Abort Protocol
           </Button>
           <div className="flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Question Matrix: {currentQuestion + 1}/{quiz.questions.length}</span>
              <div className="w-32 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div 
                    className="bg-blue-600 h-full transition-all duration-300" 
                    style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
                />
              </div>
           </div>
        </div>

        <Card className="p-10 space-y-10 bg-white border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="space-y-2 text-center border-b border-slate-50 pb-8">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{quiz.title}</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Terminal Node Validation</p>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <Terminal size={14} /> Node Index {currentQuestion + 1}
                </div>
                <h4 className="text-xl font-bold text-slate-900 leading-snug">
                    {question.questionText}
                </h4>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {question.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionChange(option)}
                  className={`
                    flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 group
                    ${userAnswers[currentQuestion] === option 
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" 
                        : "bg-slate-50 border-slate-100 hover:border-slate-300 text-slate-600 hover:text-slate-900"}
                  `}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      userAnswers[currentQuestion] === option ? "border-white bg-white/20" : "border-slate-200 group-hover:border-slate-400"
                  }`}>
                    {userAnswers[currentQuestion] === option && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <span className="text-sm font-semibold">{option}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-8 border-t border-slate-50">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(prev => prev - 1)}
              disabled={currentQuestion === 0}
            >
              Previous Frame
            </Button>

            {isLastQuestion ? (
              <Button
                onClick={handleSubmit}
                isLoading={submitting}
                className="bg-slate-900 hover:bg-slate-800"
              >
                Execute Validation
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentQuestion(prev => prev + 1)}
                disabled={!userAnswers[currentQuestion]}
              >
                Next Frame <ChevronRight size={16} className="ml-2" />
              </Button>
            )}
          </div>
        </Card>

        {/* Result Documentation Overlay */}
        <AnimatePresence>
          {score !== null && (
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4"
            >
                <Card className="max-w-md w-full bg-white p-10 text-center space-y-8 shadow-2xl relative">
                    <button 
                        onClick={() => setScore(null)}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900"
                    >
                        <X size={20} />
                    </button>
                    
                    <div className={`w-20 h-20 rounded-2xl mx-auto flex items-center justify-center text-white shadow-xl ${
                        score >= quiz.passingScore ? "bg-emerald-600 shadow-emerald-200" : "bg-rose-600 shadow-rose-200"
                    }`}>
                        {score >= quiz.passingScore ? <CheckCircle2 size={40} /> : <AlertCircle size={40} />}
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                                Validation Result: {score}%
                            </h2>
                            <p className={`text-xs font-black uppercase tracking-[0.2em] ${
                                score >= quiz.passingScore ? "text-emerald-600" : "text-rose-600"
                            }`}>
                                {score >= quiz.passingScore ? "Node Synchronized" : "Synchronization Failure"}
                            </p>
                        </div>
                        <p className="text-sm font-medium text-slate-500 leading-relaxed px-4">
                            {score >= quiz.passingScore 
                                ? "Protocol requirements successfully mastered. Terminal node validation complete." 
                                : `Target clearance: ${quiz.passingScore}%. Current proficiency level insufficient for node synchronization.`}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        {score >= quiz.passingScore ? (
                            <Button size="lg" onClick={() => navigate(-1)}>Return to Terminal</Button>
                        ) : (
                            <Button size="lg" variant="secondary" onClick={() => { setScore(null); setCurrentQuestion(0); setUserAnswers({}); }}>
                                Restart Protocol
                            </Button>
                        )}
                        <Button variant="ghost" onClick={() => setScore(null)}>Review Assessment</Button>
                    </div>
                </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuizPage;
