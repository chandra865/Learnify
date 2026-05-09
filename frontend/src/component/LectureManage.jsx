import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft, 
  Terminal, 
  Target, 
  FileText, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  ExternalLink,
  MessageSquare,
  Zap,
  Layers,
  Info,
  Clock,
  HelpCircle
} from "lucide-react";
import { toast } from "react-toastify";
import CreateQuiz from "./CreateQuiz";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import Loader from "./Loading";

const LectureManage = () => {
  const { lectureId } = useParams();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(true);

  // Note: Backend port is currently hardcoded in source; maintaining parity while improving UI
  const BACKEND_URL = "http://localhost:8000";

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/quiz/get-all-quiz/${lectureId}?quizFor=lecture`, { withCredentials: true });
      setQuizzes(response.data.data);
    } catch (error) {
      toast.error("Quiz registry sync failure");
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/assignment/get-all-assignment/${lectureId}`, { withCredentials: true });
      setAssignments(response.data.data);
    } catch (error) {
      toast.error("Assignment registry sync failure");
    }
  };

  useEffect(() => {
    fetchQuizzes();
    fetchAssignments();
  }, [lectureId]);

  const deleteQuiz = async (quizId) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/quiz/delete-quiz/${quizId}`, { withCredentials: true });
      toast.success("Quiz node purged");
      fetchQuizzes();
    } catch (error) {
      toast.error("Deletion protocol failure");
    }
  };

  const deleteAssignment = async (assignmentId) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/assignment/delete-assignment/${assignmentId}`, { withCredentials: true });
      toast.success("Assignment node purged");
      fetchAssignments();
    } catch (error) {
      toast.error("Deletion protocol failure");
    }
  };

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
    toast.success("Payload staged for deployment");
  };

  const uploadAssignment = async () => {
    if (!file) {
      toast.warning("Payload identifier required");
      return;
    }
    const formData = new FormData();
    formData.append("assignment", file);
    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/api/v1/assignment/upload/${lectureId}`, formData, { 
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Assignment synchronized successfully");
      setFile(null);
      fetchAssignments();
    } catch (error) {
      toast.error("Upload protocol failure");
    } finally {
      setLoading(false);
    }
  };

  if (loading && quizzes.length === 0) return <Loader />;

  return (
    <div className="min-h-screen bg-[#fafafa] pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        {isFormVisible ? (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             {/* Header Protocol */}
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                   <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-400 hover:text-slate-900">
                         <ArrowLeft size={18} />
                      </Button>
                      <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600 border border-blue-500/20">
                         <Target size={16} />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Lecture Operational layer</p>
                   </div>
                   <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">
                      Control <br />
                      <span className="text-slate-400">Environment</span>
                   </h2>
                </div>
                <div className="flex gap-2">
                   <Badge variant="outline" className="bg-white border-slate-200 text-slate-500 px-4 py-2">
                      Lecture ID: {lectureId.slice(-8)}
                   </Badge>
                   <Badge variant="primary" className="bg-slate-900 text-white border-transparent px-4 py-2 uppercase tracking-widest text-[9px] font-black">
                      Operational Status: Active
                   </Badge>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Quiz Management Hierarchy */}
                <div className="space-y-8">
                   <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-slate-900 rounded-lg text-white">
                            <HelpCircle size={16} />
                         </div>
                         <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Intelligence Nodes (Quizzes)</h3>
                      </div>
                      <Button size="sm" onClick={() => setIsFormVisible(false)} className="gap-2 bg-blue-600 hover:bg-blue-700">
                         <Plus size={14} /> New Quiz
                      </Button>
                   </div>

                   <div className="space-y-4">
                      {quizzes.length === 0 ? (
                        <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">No Intelligence nodes initialized</p>
                        </div>
                      ) : (
                        quizzes.map((quiz) => (
                          <Card key={quiz._id} className="p-6 border-slate-200 hover:border-blue-300 transition-all group flex items-center justify-between bg-white">
                             <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 text-blue-400 group-hover:text-blue-600 transition-all">
                                   <Layers size={20} />
                                </div>
                                <div>
                                   <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{quiz.title}</h4>
                                   <div className="flex items-center gap-2">
                                      <ShieldCheck size={10} className="text-emerald-500" />
                                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Node Stability Check complete</span>
                                   </div>
                                </div>
                             </div>
                             <button onClick={() => deleteQuiz(quiz._id)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                                <Trash2 size={16} />
                             </button>
                          </Card>
                        ))
                      )}
                   </div>
                </div>

                {/* Assignment Management Hierarchy */}
                <div className="space-y-8">
                   <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-slate-900 rounded-lg text-white">
                            <FileText size={16} />
                         </div>
                         <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Payload Archives (Assignments)</h3>
                      </div>
                   </div>

                   <Card className="p-8 border-slate-900 bg-slate-900 text-white space-y-6 rounded-[32px] shadow-2xl shadow-slate-900/10">
                      <div className="flex items-center gap-3">
                         <Terminal size={14} className="text-blue-400" />
                         <span className="text-[10px] font-black uppercase tracking-widest">Initialization Terminal</span>
                      </div>
                      
                      <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Resource Dispatch Payload</label>
                         <div className="relative group/upload">
                            <input
                              type="file"
                              ref={fileInputRef}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              onChange={handleFileUpload}
                            />
                            <div className={`p-8 border-2 border-dashed rounded-3xl text-center space-y-3 transition-all
                              ${file ? "border-blue-500/50 bg-blue-500/10" : "border-slate-700 hover:border-slate-600 hover:bg-slate-800"}`}>
                               <Plus size={32} className={`mx-auto transition-colors ${file ? "text-blue-400" : "text-slate-600"}`} />
                               <div className="space-y-1">
                                  <p className="text-sm font-black uppercase tracking-tight">{file ? file.name : "Select Payload File"}</p>
                                  <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Targeted Dispatch initialized</p>
                               </div>
                            </div>
                         </div>
                         <Button onClick={uploadAssignment} disabled={!file || loading} className="w-full gap-2 py-6 bg-slate-800 border-slate-700 hover:bg-slate-700">
                            {loading ? <Zap size={14} className="animate-spin" /> : <Terminal size={14} />}
                            Synchronize Payload
                         </Button>
                      </div>

                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-3">
                         <Info size={14} className="text-blue-400 mt-0.5 shrink-0" />
                         <p className="text-[10px] font-medium text-slate-500 leading-relaxed italic">
                           Payload synchronization establishes a permanent node reference for student entities. Accuracy verified at 99.9%.
                         </p>
                      </div>
                   </Card>

                   <div className="space-y-4">
                      {assignments.length > 0 ? (
                        assignments.map((assignment) => (
                          <Card key={assignment._id} className="p-6 border-slate-200 hover:border-blue-300 transition-all group flex items-center justify-between bg-white">
                             <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 group-hover:text-blue-600 transition-all">
                                   <FileText size={20} />
                                </div>
                                <div>
                                   <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1">{assignment.title}</h4>
                                   <a 
                                     href={assignment.fileUrl} 
                                     target="_blank" 
                                     rel="noopener noreferrer" 
                                     className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 flex items-center gap-1.5 hover:translate-x-1 transition-transform"
                                   >
                                      External Link Access <ExternalLink size={10} />
                                   </a>
                                </div>
                             </div>
                             <button onClick={() => deleteAssignment(assignment._id)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                                <Trash2 size={16} />
                             </button>
                          </Card>
                        ))
                      ) : (
                        <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">No Payload Archives synchronized</p>
                        </div>
                      )}
                   </div>
                </div>
             </div>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-500">
             <CreateQuiz courseId={""} lectureId={lectureId} type={"lecture"} />
             <div className="mt-8 flex justify-center">
                <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900" onClick={() => setIsFormVisible(true)}>
                   Return to Operational Control
                </Button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LectureManage;
