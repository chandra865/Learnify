import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { 
  Edit3, 
  Trash2, 
  Plus, 
  ChevronDown, 
  Terminal, 
  Layers, 
  Play, 
  Video, 
  CheckCircle, 
  Clock, 
  Upload, 
  Zap,
  ShieldCheck,
  FileText,
  X,
  Target,
  GripVertical
} from "lucide-react";
import { toast } from "react-toastify";
import { sectionBaseUrl, lectureBaseUrl } from "../utils/endpoints";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import Input from "./ui/Input";
import Loader from "./Loading";

const CourseCurriculum = () => {
  const [sections, setSections] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [sectionTitle, setSectionTitle] = useState("");
  const [showNewSectionForm, setShowNewSectionForm] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [expandedLectureId, setExpandedLectureId] = useState(null);
  const [fileUploadFor, setFileUploadFor] = useState(null);
  const [editingLectureId, setEditingLectureId] = useState(null);
  const [editedLectureTitle, setEditedLectureTitle] = useState("");

  const [lectureForms, setLectureForms] = useState({ title: "", isFree: false });
  const [showLectureForm, setShowLectureForm] = useState({});
  const [loading, setLoading] = useState(true);

  const videoInputRef = useRef(null);
  const courseId = useSelector((state) => state.course.selectedCourse?._id);

  const fetchSection = async () => {
    try {
      const response = await axios.get(`${sectionBaseUrl}/${courseId}`, { withCredentials: true });
      setSections(response.data.data);
    } catch (error) {
      toast.error("Curriculum topology sync failure");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) fetchSection();
  }, [courseId]);

  const addSection = async () => {
    if (!sectionTitle.trim()) {
      toast.warning("Section identifier required");
      return;
    }
    try {
      await axios.post(`${sectionBaseUrl}`, { title: sectionTitle, courseId }, { withCredentials: true });
      fetchSection();
      setSectionTitle("");
      setShowNewSectionForm(false);
      toast.success("Section node initialized");
    } catch (error) {
      toast.error("Section deployment failure");
    }
  };

  const handleUpdateSection = async (sectionId) => {
    try {
      await axios.patch(`${sectionBaseUrl}/${sectionId}`, { title: editedTitle }, { withCredentials: true });
      setEditingSectionId(null);
      setEditedTitle("");
      fetchSection();
      toast.success("Section manifest updated");
    } catch (error) {
      toast.error("Update protocol failure");
    }
  };

  const handleDeleteSection = async (sectionId) => {
    try {
      await axios.delete(`${sectionBaseUrl}/${sectionId}`, { withCredentials: true });
      fetchSection();
      toast.success("Section node purged");
    } catch (error) {
      toast.error("Deletion protocol failure");
    }
  };

  const handleFileUpload = async (e, lectureId, sectionId) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      toast.error("Invalid media type. Video required.");
      return;
    }
    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Payload too large. 15MB limit enforced.");
      return;
    }

    const video = document.createElement("video");
    video.preload = "metadata";
    let duration = 0;
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      duration = video.duration;
    };
    video.src = URL.createObjectURL(file);

    try {
      const response = await axios.post(`${lectureBaseUrl}/upload-signed-aws-url`, {
        courseId, sectionId, lectureId, contentType: file.type, fileName: file.name.replace(/\s+/g, "-"),
      }, { withCredentials: true });
     
      const { uploadUrl } = response.data.data;
      await axios.put(uploadUrl, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (p) => setUploadProgress(prev => ({ ...prev, [lectureId]: Math.round((p.loaded * 100) / p.total) })),
      });

      await axios.post(`${lectureBaseUrl}/video`, { videoFileName: file.name, duration, courseId, sectionId, lectureId }, { withCredentials: true });
      
      toast.success("Media synchronization complete");
      setUploadProgress(prev => ({ ...prev, [lectureId]: 0 }));
      setExpandedLectureId(null);
      setFileUploadFor(null);
      fetchSection();
    } catch (error) {
      toast.error("Media propagation failure");
    }
  };

  const addLecture = async (sectionId) => {
    if (!lectureForms.title.trim()) {
      toast.warning("Lecture identifier required");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("title", lectureForms.title);
      formData.append("sectionId", sectionId);
      formData.append("isFree", lectureForms.isFree);
      await axios.post(`${lectureBaseUrl}`, formData, { withCredentials: true });
      setLectureForms({ title: "", isFree: false });
      setShowLectureForm(prev => ({ ...prev, [sectionId]: false }));
      fetchSection();
      toast.success("Lecture node initialized");
    } catch (error) {
      toast.error("Lecture deployment failure");
    }
  };

  const handleUpdateLecture = async (lectureId) => {
    try {
      await axios.patch(`${lectureBaseUrl}/${lectureId}`, { title: editedLectureTitle }, { withCredentials: true });
      setEditingLectureId(null);
      setEditedLectureTitle("");
      fetchSection();
      toast.success("Lecture manifest updated");
    } catch (error) {
      toast.error("Update protocol failure");
    }
  };

  const handleDeleteLecture = async (lectureId, sectionId) => {
    try {
      await axios.delete(`${lectureBaseUrl}/${lectureId}`, { params: { lectureId, sectionId, courseId }, withCredentials: true });
      fetchSection();
      toast.success("Lecture node purged");
    } catch (error) {
      toast.error("Deletion protocol failure");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-slate-900 rounded-lg text-white">
              <Layers size={20} />
           </div>
           <div>
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">Curriculum Topology</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Node Management Hub</p>
           </div>
        </div>
        {!showNewSectionForm && (
           <Button variant="primary" size="sm" onClick={() => setShowNewSectionForm(true)} className="gap-2">
              <Plus size={16} /> New Section
           </Button>
        )}
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <Card key={section._id} className="p-0 border-slate-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition-all">
            {/* Section Header Protocol */}
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                 <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white border border-slate-200 text-slate-900 font-black text-sm shadow-sm shrink-0">
                    {section.order}
                 </div>
                 {editingSectionId === section._id ? (
                   <div className="flex items-center gap-2 flex-1 max-w-md">
                      <Input 
                        value={editedTitle} 
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="bg-white border-blue-200"
                        autoFocus
                      />
                      <Button size="icon" onClick={() => handleUpdateSection(section._id)} className="shrink-0 bg-emerald-600 hover:bg-emerald-700">
                         <CheckCircle size={16} />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => setEditingSectionId(null)} className="shrink-0">
                         <X size={16} />
                      </Button>
                   </div>
                 ) : (
                   <div className="flex items-center gap-3 group">
                      <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase">{section.title}</h4>
                      <Badge variant="outline" className="text-[9px] border-slate-200 text-slate-400">{section.lectures.length} Units</Badge>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                         <button onClick={() => { setEditingSectionId(section._id); setEditedTitle(section.title); }} className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors">
                            <Edit3 size={14} />
                         </button>
                         <button onClick={() => handleDeleteSection(section._id)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors">
                            <Trash2 size={14} />
                         </button>
                      </div>
                   </div>
                 )}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 gap-2"
                onClick={() => setShowLectureForm(prev => ({ ...prev, [section._id]: !prev[section._id] }))}
              >
                 <Plus size={14} /> New Lecture node
              </Button>
            </div>

            {/* Lecture Matrix Topology */}
            <div className="p-6 md:p-8 space-y-4 bg-white">
               {section.lectures.length === 0 && !showLectureForm[section._id] && (
                 <div className="py-8 text-center border-2 border-dashed border-slate-50 rounded-3xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Section Empty / Node Deployment Required</p>
                 </div>
               )}

               {section.lectures.map((lecture) => (
                 <div key={lecture._id} className="group/lecture relative">
                   <div className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 
                     ${expandedLectureId === lecture._id ? "border-blue-200 bg-blue-50/30" : "border-slate-100 bg-slate-50/30 hover:border-slate-200 hover:bg-white"}`}>
                     
                     <div className="flex items-center gap-4 flex-1">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center border font-black text-[10px] transition-all
                          ${lecture.videoFileName ? "bg-emerald-600 border-emerald-500 text-white shadow-emerald-900/10" : "bg-white border-slate-200 text-slate-400"}`}>
                           {lecture.order}
                        </div>
                        {editingLectureId === lecture._id ? (
                          <div className="flex items-center gap-2 flex-1 max-w-sm">
                             <Input 
                               value={editedLectureTitle} 
                               onChange={(e) => setEditedLectureTitle(e.target.value)}
                               className="bg-white"
                             />
                             <Button size="icon" onClick={() => handleUpdateLecture(lecture._id)} className="bg-emerald-600">
                                <CheckCircle size={14} />
                             </Button>
                             <Button size="icon" variant="ghost" onClick={() => setEditingLectureId(null)}>
                                <X size={14} />
                             </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                             <h5 className="text-sm font-black text-slate-900 uppercase tracking-tight">{lecture.title}</h5>
                             {lecture.isFree && <Badge className="bg-blue-600 text-[8px]">Public</Badge>}
                             <div className="flex items-center gap-0.5 opacity-0 group-hover/lecture:opacity-100 transition-opacity">
                                <button onClick={() => { setEditingLectureId(lecture._id); setEditedLectureTitle(lecture.title); }} className="p-1 text-slate-400 hover:text-blue-600 transition-colors">
                                   <Edit3 size={12} />
                                </button>
                                <button onClick={() => handleDeleteLecture(lecture._id, section._id)} className="p-1 text-slate-400 hover:text-rose-500 transition-colors">
                                   <Trash2 size={12} />
                                </button>
                             </div>
                          </div>
                        )}
                     </div>

                     <div className="flex items-center gap-3">
                        {uploadProgress[lecture._id] > 0 ? (
                           <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-blue-100 min-w-[140px]">
                              <Zap size={14} className="text-blue-600 animate-pulse" />
                              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                 <div className="h-full bg-blue-600 transition-all" style={{ width: `${uploadProgress[lecture._id]}%` }} />
                              </div>
                              <span className="text-[10px] font-black text-blue-600">{uploadProgress[lecture._id]}%</span>
                           </div>
                        ) : (
                          <>
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest gap-2 
                                 ${lecture.videoFileName ? "text-slate-600 bg-white" : "text-blue-600 bg-blue-50"}`}
                               onClick={() => setExpandedLectureId(prev => prev === lecture._id ? null : lecture._id)}
                             >
                                <Play size={10} fill={lecture.videoFileName ? "currentColor" : "none"} />
                                {lecture.videoFileName ? "Resource Active" : "Initialize Asset"}
                             </Button>
                             <Button 
                               variant="outline" 
                               size="sm" 
                               className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest gap-2"
                               onClick={() => window.open(`/lecturemanage/${lecture._id}`, "_blank")}
                             >
                                <Target size={10} /> Management
                             </Button>
                          </>
                        )}
                     </div>
                   </div>

                   {/* Secondary Control Node (Expanded) */}
                   {expandedLectureId === lecture._id && (
                     <div className="mt-2 ml-10 p-6 bg-slate-900 rounded-[32px] text-white space-y-6 animate-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <Terminal size={14} className="text-blue-400" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Asset Management Protocol</span>
                           </div>
                           <button onClick={() => setExpandedLectureId(null)} className="text-slate-500 hover:text-white transition-colors">
                              <X size={16} />
                           </button>
                        </div>

                        {lecture.videoFileName ? (
                          <div className="p-4 bg-slate-800 rounded-2xl border border-white/5 flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-600/10 rounded-xl text-emerald-400">
                                   <Video size={20} />
                                </div>
                                <div>
                                   <p className="text-xs font-black uppercase tracking-widest text-slate-500">Active Asset ID</p>
                                   <p className="text-sm font-bold text-white">{lecture.videoFileName}</p>
                                </div>
                             </div>
                             <Button variant="ghost" size="sm" onClick={() => handleFileDelete(lecture._id, section._id)} className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/30">
                                Purge Node
                             </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                             <div className="relative group/upload">
                                <input
                                  type="file"
                                  accept="video/*"
                                  onChange={(e) => handleFileUpload(e, lecture._id, section._id)}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                  ref={videoInputRef}
                                />
                                <div className="p-8 border-2 border-dashed border-slate-700 rounded-3xl text-center space-y-3 group-hover/upload:border-blue-500/50 group-hover/upload:bg-slate-800 transition-all">
                                   <Upload size={32} className="mx-auto text-slate-500 group-hover/upload:text-blue-400 transition-colors" />
                                   <div className="space-y-1">
                                      <p className="text-sm font-black uppercase tracking-tight">Deploy Media Protocol</p>
                                      <p className="text-[10px] text-slate-500 font-medium tracking-widest">MP4 / MAX-PAYLOAD: 15MB</p>
                                   </div>
                                </div>
                             </div>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 pt-4">
                           <ShieldCheck size={12} className="text-blue-400" />
                           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Asset persistence layer synchronized</span>
                        </div>
                     </div>
                   )}
                 </div>
               ))}

               {showLectureForm[section._id] && (
                 <Card className="p-8 border-slate-900 bg-slate-900 text-white animate-in slide-in-from-top-4 duration-300 rounded-[32px]">
                    <div className="flex items-center gap-3 mb-6">
                       <Terminal size={16} className="text-blue-400" />
                       <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">New Lecture Manifest</h4>
                    </div>
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Lecture Identifier (Max 30)</label>
                          <Input 
                            placeholder="Domain Synchronizer / Node Label" 
                            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 h-12"
                            value={lectureForms.title}
                            onChange={(e) => setLectureForms(prev => ({ ...prev, title: e.target.value.slice(0, 30) }))}
                          />
                          <div className="flex justify-between">
                             <p className="text-[9px] font-bold text-slate-600 tracking-widest uppercase">{lectureForms.title.length}/30 UNITS</p>
                             {lectureForms.title.length > 0 && lectureForms.title.length < 5 && (
                               <p className="text-[9px] font-bold text-rose-500 tracking-widest uppercase">Sub-optimal identifier length</p>
                             )}
                          </div>
                       </div>
                       
                       <div className="flex items-center justify-between p-4 bg-slate-800 rounded-2xl border border-white/5">
                          <div className="flex items-center gap-3">
                             <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/10">
                                <Globe size={14} />
                             </div>
                             <div>
                                <p className="text-xs font-black uppercase tracking-tight">Public Protocol</p>
                                <p className="text-[9px] text-slate-500 font-bold tracking-widest">Mark as free preview node</p>
                             </div>
                          </div>
                          <button 
                            className={`w-12 h-6 rounded-full transition-all relative ${lectureForms.isFree ? "bg-blue-600" : "bg-slate-700"}`}
                            onClick={() => setLectureForms(prev => ({ ...prev, isFree: !prev.isFree }))}
                          >
                             <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${lectureForms.isFree ? "right-1" : "left-1"}`} />
                          </button>
                       </div>

                       <div className="flex justify-end gap-3 pt-6 border-t border-slate-800">
                          <Button variant="ghost" size="sm" onClick={() => setShowLectureForm(prev => ({ ...prev, [section._id]: false }))} className="text-slate-400 hover:text-white">Abort</Button>
                          <Button size="sm" onClick={() => addLecture(section._id)} className="gap-2">
                             <CheckCircle size={14} /> Commit Node
                          </Button>
                       </div>
                    </div>
                 </Card>
               )}
            </div>
          </Card>
        ))}

        {showNewSectionForm ? (
          <Card className="p-8 border-slate-900 bg-slate-900 text-white animate-in slide-in-from-bottom-4 duration-300 rounded-[40px]">
             <div className="flex items-center gap-3 mb-8">
                <Terminal size={18} className="text-blue-400" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Curriculum Root Initialization</h4>
             </div>
             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Section Root Identifier</label>
                   <Input 
                     placeholder="Domain Cluster / Theoretical Layer" 
                     className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 h-14 text-lg"
                     value={sectionTitle}
                     onChange={(e) => setSectionTitle(e.target.value.slice(0, 30))}
                   />
                   <div className="flex justify-between">
                      <p className="text-[9px] font-bold text-slate-600 tracking-widest uppercase">{sectionTitle.length}/30 UNITS</p>
                   </div>
                </div>
                <div className="flex justify-end gap-3 pt-8 border-t border-slate-800">
                   <Button variant="ghost" size="sm" onClick={() => setShowNewSectionForm(false)} className="text-slate-400 hover:text-white">Abort</Button>
                   <Button size="sm" onClick={addSection} className="gap-2 bg-blue-600 hover:bg-blue-700 px-8 py-6 text-base">
                      <Layers size={18} /> Deploy Root
                   </Button>
                </div>
             </div>
          </Card>
        ) : (
          <Button variant="outline" className="w-full py-8 border-dashed border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-900 group" onClick={() => setShowNewSectionForm(true)}>
             <div className="flex flex-col items-center gap-2">
                <Plus size={24} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Initialize Global Section Node</span>
             </div>
          </Button>
        )}
      </div>
    </div>
  );
};

export default CourseCurriculum;
