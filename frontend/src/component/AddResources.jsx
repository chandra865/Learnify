import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setSelectedCourse } from "../store/slice/selectedCourseSlice";
import CreateQuiz from "./CreateQuiz";
import { 
  Terminal, 
  HelpCircle, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Zap, 
  Info, 
  Layers,
  CheckCircle,
  X,
  Target
} from "lucide-react";
import { toast } from "react-toastify";
import { quizBaseUrl } from "../utils/endpoints";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import Loader from "./Loading";

const AddResources = () => {
  const course = useSelector((state) => state.course.selectedCourse);
  const dispatch = useDispatch();

  const [isFormVisible, setIsFormVisible] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuizzes = async () => {
    if (!course?._id) return;
    try {
      const response = await axios.get(`${quizBaseUrl}/get-all-quiz/${course._id}?quizFor=course`, { withCredentials: true });
      setQuizzes(response.data.data);
    } catch (error) {
      toast.error("Quiz registry sync failure");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [course?._id]);

  const handleAddQuiz = () => {
    if (course.certificateOption === "quiz") {
      setIsFormVisible(false);
    } else {
      toast.warning("Certificate protocol requires 'quiz' option. Update course manifest first.");
    }
  };

  const deleteQuiz = async (quizId) => {
    try {
      await axios.delete(`${quizBaseUrl}/${quizId}`, { withCredentials: true });
      toast.success("Intelligence node purged");
      fetchQuizzes();
    } catch (error) {
      toast.error("Deletion protocol failure");
    }
  };

  if (!course) return null;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {isFormVisible ? (
        <div className="space-y-10">
           {/* Section Protocol Header */}
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
              <div className="space-y-4">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600 border border-blue-500/20">
                       <Layers size={16} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Global Resource Management</p>
                 </div>
                 <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">
                    Course <br />
                    <span className="text-slate-400">Intelligence Nodes</span>
                 </h2>
              </div>
              <div className="flex gap-2">
                 <Badge variant="outline" className="bg-white border-slate-200 text-slate-500 px-4 py-2">
                    Certificate: {course.certificateOption?.toUpperCase()}
                 </Badge>
                 {!course.quiz && (
                   <Button size="sm" onClick={handleAddQuiz} className="gap-2 bg-blue-600 hover:bg-blue-700">
                      <Plus size={16} /> Deploy Quiz Node
                   </Button>
                 )}
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                 <div className="px-2 flex items-center justify-between mb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active High-Level Nodes</p>
                    <Badge variant="outline" className="text-[8px] border-slate-100 text-slate-400">{quizzes.length} Archived</Badge>
                 </div>

                 {loading ? (
                    <div className="py-24 flex items-center justify-center w-full">
                       <div className="w-8 h-8 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin" />
                    </div>
                 ) : quizzes.length === 0 ? (
                    <Card className="py-24 text-center space-y-6 border-dashed border-slate-200 bg-slate-50/50">
                       <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center text-slate-300 shadow-sm">
                          <Terminal size={32} />
                       </div>
                       <div className="space-y-1">
                          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">No Intelligence Nodes Found</h3>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">Course level registry is currently unmapped. Deployment protocol active.</p>
                       </div>
                    </Card>
                 ) : (
                    <div className="grid grid-cols-1 gap-4">
                       {quizzes.map((quiz) => (
                          <Card key={quiz._id} className="p-6 border-slate-200 bg-white hover:border-blue-300 transition-all group flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-300 group-hover:text-blue-600 transition-all">
                                   <HelpCircle size={24} />
                                </div>
                                <div>
                                   <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase leading-none mb-1">{quiz.title}</h4>
                                   <div className="flex items-center gap-2">
                                      <ShieldCheck size={12} className="text-emerald-500" />
                                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Archival Registry Persistence: Verified</span>
                                   </div>
                                </div>
                             </div>
                             <button onClick={() => deleteQuiz(quiz._id)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                                <Trash2 size={18} />
                             </button>
                          </Card>
                       ))}
                    </div>
                 )}
              </div>

              <aside className="space-y-8">
                 <Card className="p-8 border-slate-900 bg-slate-900 text-white space-y-8 rounded-[32px] shadow-2xl shadow-slate-900/10">
                    <div className="flex items-center gap-3">
                       <Target size={14} className="text-blue-400" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Node Compliance Diagnostics</span>
                    </div>
                    
                    <div className="space-y-6">
                       <div className="p-5 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-colors">
                          <div className="flex items-center gap-3">
                             <CheckCircle size={16} className="text-emerald-500" />
                             <span className="text-[10px] font-black uppercase tracking-widest">Protocol Sync</span>
                          </div>
                          <Badge className="bg-emerald-600/10 text-emerald-400 border-none text-[8px]">Active</Badge>
                       </div>
                       
                       <div className="p-5 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-colors">
                          <div className="flex items-center gap-3">
                             <Zap size={16} className="text-blue-400" />
                             <span className="text-[10px] font-black uppercase tracking-widest">Latency Index</span>
                             <span className="text-[10px] text-slate-500 italic">4ms</span>
                          </div>
                          <Badge className="bg-blue-600/10 text-blue-400 border-none text-[8px]">Minimal</Badge>
                       </div>
                    </div>

                    <div className="p-6 bg-blue-600/10 rounded-[32px] border border-blue-500/20 flex flex-col gap-4">
                       <div className="flex items-center gap-3">
                          <Info size={16} className="text-blue-400" />
                          <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                             High-level course intelligence nodes serve as validation terminals for certification. Integrity is strictly enforced.
                          </p>
                       </div>
                    </div>
                 </Card>
              </aside>
           </div>
        </div>
      ) : (
        <div className="animate-in fade-in zoom-in-95 duration-500">
           <CreateQuiz courseId={course._id} lectureId={"lecture"} type="course" />
           <div className="mt-8 flex justify-center">
              <Button variant="ghost" onClick={() => setIsFormVisible(true)} className="gap-2 text-slate-400 hover:text-slate-900">
                 <X size={16} /> Abort Deployment
              </Button>
           </div>
        </div>
      )}
    </div>
  );
};

export default AddResources;
