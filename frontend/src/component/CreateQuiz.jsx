import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ChevronDown, 
  ChevronRight, 
  Trash2, 
  ArrowLeft, 
  Plus, 
  CheckCircle, 
  Terminal, 
  ShieldCheck, 
  Target,
  Layers,
  HelpCircle
} from "lucide-react";
import { toast } from "react-toastify";
import { quizBaseUrl } from "../utils/endpoints";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Input from "./ui/Input";

const CreateQuiz = ({ courseId, lectureId, type }) => {
  const navigate = useNavigate();
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctAnswerIndex: 0 },
  ]);
  const [expandedQuestions, setExpandedQuestions] = useState([0]);
  const [loading, setLoading] = useState(false);

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].questionText = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIdx, oIdx, value) => {
    const updated = [...questions];
    updated[qIdx].options[oIdx] = value;
    setQuestions(updated);
  };

  const handleCorrectAnswer = (qIdx, oIdx) => {
    const updated = [...questions];
    updated[qIdx].correctAnswerIndex = oIdx;
    setQuestions(updated);
  };

  const toggleExpand = (index) => {
    setExpandedQuestions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const addQuestion = () => {
    const newIndex = questions.length;
    setQuestions([
      ...questions,
      { questionText: "", options: ["", "", "", ""], correctAnswerIndex: 0 },
    ]);
    setExpandedQuestions([newIndex]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
      setExpandedQuestions((prev) => prev.filter((i) => i !== index));
    }
  };

  const handleCreateQuiz = async () => {
    if (!quizTitle) {
      toast.warning("Quiz identification required");
      return;
    }
    if (questions.some((q) => !q.questionText.trim() || q.options.some((o) => !o.trim()))) {
      toast.warning("Question manifest incomplete");
      return;
    }

    setLoading(true);
    const formatted = questions.map((q) => ({
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.options[q.correctAnswerIndex],
    }));

    try {
      await axios.post(`${quizBaseUrl}?quizFor=${type}`, {
        title: quizTitle,
        courseId,
        lectureId,
        questions: formatted,
        passingScore: 50,
      }, { withCredentials: true });

      toast.success("Intelligence node successfully deployed");
      navigate("/dashboard/created");
    } catch (err) {
      toast.error("Deployment protocol failure");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Topology Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
        <div className="space-y-4">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600 border border-blue-500/20">
                 <HelpCircle size={16} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Intelligence Deployment Hub</p>
           </div>
           <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">
              Create <br />
              <span className="text-slate-400">Intelligence Node</span>
           </h2>
        </div>
        <Badge variant="outline" className="bg-white border-slate-200 text-slate-500 px-4 py-2">
           Node Type: {type?.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
           {/* Primary Identifier */}
           <Card className="p-8 border-slate-900 bg-slate-900 text-white space-y-6 rounded-[32px] shadow-2xl shadow-slate-900/10">
              <div className="flex items-center gap-3">
                 <Terminal size={14} className="text-blue-400" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Manifest Definition</span>
              </div>
              <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Quiz Primary Identifier</label>
                 <Input 
                   type="text" 
                   placeholder="Enter manifest title..." 
                   className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 h-14 text-xl font-black tracking-tight"
                   value={quizTitle}
                   onChange={(e) => setQuizTitle(e.target.value)}
                 />
              </div>
           </Card>

           {/* Question Hierarchy */}
           <div className="space-y-4">
             <div className="flex items-center justify-between px-2 mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Question Matrix ({questions.length} Units)</p>
                <Button variant="ghost" size="sm" onClick={addQuestion} className="text-blue-600 font-black h-8 gap-2">
                   <Plus size={14} /> Add unit
                </Button>
             </div>

             {questions.map((q, qIdx) => {
               const isExpanded = expandedQuestions.includes(qIdx);
               return (
                 <Card key={qIdx} className={`p-0 border-slate-200 overflow-hidden transition-all ${isExpanded ? "ring-2 ring-blue-600/5 shadow-xl" : ""}`}>
                   <div className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${isExpanded ? "bg-slate-50" : "bg-white hover:bg-slate-50"}`} onClick={() => toggleExpand(qIdx)}>
                      <div className="flex items-center gap-4">
                         <div className={`w-8 h-8 rounded-xl flex items-center justify-center border font-black text-[10px] transition-all
                           ${q.questionText ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-400"}`}>
                            {qIdx + 1}
                         </div>
                         <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight truncate max-w-[200px] md:max-w-md">
                            {q.questionText || `Pending Question Node`}
                         </h3>
                      </div>
                      <div className="flex items-center gap-2">
                         {isExpanded ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
                         <button onClick={(e) => { e.stopPropagation(); removeQuestion(qIdx); }} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                            <Trash2 size={16} />
                         </button>
                      </div>
                   </div>

                   {isExpanded && (
                     <div className="p-8 border-t border-slate-100 space-y-8 animate-in slide-in-from-top-2 duration-300">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Core Logic String</label>
                           <textarea
                             placeholder="Enter question definition..."
                             className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold min-h-[100px] focus:ring-2 focus:ring-blue-600/10 outline-none transition-all placeholder:text-slate-300 resize-none"
                             value={q.questionText}
                             onChange={(e) => handleQuestionChange(qIdx, e.target.value)}
                           />
                        </div>

                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Response Matrix</label>
                              <Badge variant="outline" className="text-[8px] border-slate-100 text-slate-400 uppercase tracking-widest">Single Choice Protocol</Badge>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {q.options.map((opt, oIdx) => (
                                <div key={oIdx} className="relative group/opt">
                                   <Input
                                     placeholder={`Option Binary ${oIdx + 1}`}
                                     value={opt}
                                     onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                                     className={`pr-32 h-12 ${q.correctAnswerIndex === oIdx ? "border-emerald-500 bg-emerald-50/30" : "bg-white"}`}
                                   />
                                   <button
                                     type="button"
                                     onClick={() => handleCorrectAnswer(qIdx, oIdx)}
                                     className={`absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all
                                       ${q.correctAnswerIndex === oIdx ? "bg-emerald-600 text-white shadow-emerald-900/10" : "bg-slate-100 text-slate-400 hover:bg-slate-200"}`}
                                   >
                                      {q.correctAnswerIndex === oIdx ? "Correct Set" : "Mark Alpha"}
                                   </button>
                                </div>
                              ))}
                           </div>
                        </div>
                     </div>
                   )}
                 </Card>
               );
             })}
           </div>
        </div>

        <aside className="space-y-8">
           <Card className="p-8 border-slate-200 bg-white sticky top-32 space-y-8 shadow-xl shadow-blue-900/5">
              <div className="space-y-6">
                 <div className="flex items-center gap-2">
                    <Target size={14} className="text-blue-600" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Deployment Config</p>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="flex items-baseline justify-between group">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">Passing Threshold</span>
                       <Badge variant="outline" className="font-black italic">50%</Badge>
                    </div>
                    <div className="flex items-baseline justify-between group">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">Node Density</span>
                       <Badge variant="outline" className="font-black italic">{questions.length} Units</Badge>
                    </div>
                 </div>

                 <div className="pt-6 border-t border-dashed border-slate-100 space-y-4">
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                       <ShieldCheck size={16} className="text-emerald-500" />
                       Logic integrity verified
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                       <Zap size={16} className="text-blue-600" />
                       Instant propagation
                    </div>
                 </div>
              </div>

              <Button 
                onClick={handleCreateQuiz} 
                className="w-full h-14 text-lg shadow-2xl shadow-blue-200 group gap-3"
                disabled={loading}
              >
                 {loading ? <Zap size={20} className="animate-spin text-white" /> : <Layers size={20} className="group-hover:translate-y-[-2px] transition-transform" />}
                 COMMIT DEPLOYMENT
              </Button>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                 <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
                 <p className="text-[10px] font-medium text-slate-400 leading-relaxed italic">
                    Final commitment propagates this intelligence node across all enrolled registries. Operation is permanent.
                 </p>
              </div>
           </Card>
        </aside>
      </div>
    </div>
  );
};

export default CreateQuiz;
