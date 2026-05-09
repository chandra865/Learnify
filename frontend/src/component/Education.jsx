import axios from "axios";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { 
  GraduationCap, 
  MapPin, 
  Calendar, 
  Trash2, 
  Edit3, 
  Plus, 
  ChevronRight,
  Terminal,
  ShieldCheck,
  Zap,
  BookOpen
} from "lucide-react";
import { toast } from "react-toastify";
import { userBaseUrl } from "../utils/endpoints";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import Input from "./ui/Input";

const Education = () => {
  const [education, setEducation] = useState([]);
  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    startYear: new Date(),
    endYear: new Date(),
    cgpa: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const response = await axios.get(`${userBaseUrl}/educations`, { withCredentials: true });
      setEducation(response.data.data);
    } catch (error) {
      toast.error("Education registry sync failed");
    }
  };

  const handleAddOrUpdateEducation = async () => {
    setLoading(true);
    try {
      const url = editingId ? `${userBaseUrl}/educations/${editingId}` : `${userBaseUrl}/educations`;
      const payload = {
        ...formData,
        startYear: formData.startYear.getFullYear(),
        endYear: formData.endYear.getFullYear(),
      };

      await axios.post(url, payload, { withCredentials: true });
      fetchEducation();
      setIsFormVisible(false);
      setEditingId(null);
      setFormData({ institution: "", degree: "", startYear: new Date(), endYear: new Date(), cgpa: "" });
      toast.success(editingId ? "Education protocol updated" : "Academic node added");
    } catch (error) {
      toast.error("Protocol update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (edu) => {
    setFormData({
      ...edu,
      startYear: new Date(edu.startYear, 0, 1),
      endYear: new Date(edu.endYear, 0, 1),
    });
    setEditingId(edu._id);
    setIsFormVisible(true);
  };

  const handleDelete = async (eduId) => {
    try {
      await axios.delete(`${userBaseUrl}/educations/${eduId}`, { withCredentials: true });
      fetchEducation();
      toast.success("Academic node purged");
    } catch (error) {
      toast.error("Deletion protocol failure");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-slate-900 rounded-lg text-white">
              <GraduationCap size={16} />
           </div>
           <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Academic Archives</h3>
        </div>
        {!isFormVisible && (
          <Button variant="outline" size="sm" onClick={() => setIsFormVisible(true)} className="gap-2">
             <Plus size={14} /> Initialize Node
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {education.map((edu) => (
          <Card key={edu._id} className="p-6 border-slate-200 hover:border-indigo-300 transition-all group relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
               <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-300 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all shrink-0">
                     <BookOpen size={24} />
                  </div>
                  <div className="space-y-1">
                     <div className="flex items-center gap-3">
                        <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase leading-none">{edu.institution}</h4>
                        <Badge variant="outline" className="text-[8px] border-slate-100 text-slate-400">{edu.startYear} — {edu.endYear}</Badge>
                     </div>
                     <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{edu.degree}</p>
                     <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           <Zap size={10} className="text-amber-500" /> CGPA Index: {edu.cgpa}
                        </div>
                     </div>
                  </div>
               </div>
               <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEditClick(edu)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                     <Edit3 size={16} />
                  </button>
                  <button onClick={() => handleDelete(edu._id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                     <Trash2 size={16} />
                  </button>
               </div>
            </div>
          </Card>
        ))}
      </div>

      {isFormVisible && (
        <Card className="p-8 border-slate-900 bg-slate-900 text-white animate-in slide-in-from-top-4 duration-300">
           <div className="flex items-center gap-3 mb-8">
              <Terminal size={18} className="text-indigo-400" />
              <h4 className="text-xs font-black uppercase tracking-[0.2em]">{editingId ? "Update Academic Protocol" : "New Education manifest"}</h4>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Institution Identifier</label>
                 <Input 
                   type="text" 
                   placeholder="University / College" 
                   className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 h-12"
                   value={formData.institution}
                   onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                 />
              </div>
              <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Credential Degree</label>
                 <Input 
                   type="text" 
                   placeholder="B.Tech / M.B.A / etc." 
                   className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 h-12"
                   value={formData.degree}
                   onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                 />
              </div>
              <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Commencement Alpha</label>
                 <DatePicker
                   selected={formData.startYear}
                   onChange={(date) => setFormData({ ...formData, startYear: date })}
                   showYearPicker
                   dateFormat="yyyy"
                   className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                   placeholderText="Start Year"
                 />
              </div>
              <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Termination Omega</label>
                 <DatePicker
                   selected={formData.endYear}
                   onChange={(date) => setFormData({ ...formData, endYear: date })}
                   showYearPicker
                   dateFormat="yyyy"
                   className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                   placeholderText="End Year"
                 />
              </div>
              <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Performance Index (CGPA)</label>
                 <Input 
                   type="number" 
                   step="0.01"
                   placeholder="0.00" 
                   className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 h-12"
                   value={formData.cgpa}
                   onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                 />
              </div>
           </div>
           <div className="flex items-center justify-end gap-3 mt-8 pt-8 border-t border-slate-800">
              <Button variant="ghost" size="sm" onClick={() => setIsFormVisible(false)} className="text-slate-400 hover:text-white">Abort</Button>
              <Button size="sm" onClick={handleAddOrUpdateEducation} disabled={loading} className="gap-2">
                 {loading ? <Zap size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                 {editingId ? "Commit Update" : "Deploy Academic Node"}
              </Button>
           </div>
        </Card>
      )}
    </div>
  );
};

export default Education;
