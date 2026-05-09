import axios from "axios";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { 
  Building2, 
  Briefcase, 
  Calendar, 
  Trash2, 
  Edit3, 
  Plus, 
  ChevronRight,
  Terminal,
  ShieldCheck,
  Zap,
  Info
} from "lucide-react";
import { toast } from "react-toastify";
import { userBaseUrl } from "../utils/endpoints";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import Input from "./ui/Input";

const Experience = () => {
  const [experience, setExperience] = useState([]);
  const [formData, setFormData] = useState({
    jobTitle: "",
    company: "",
    startYear: new Date(),
    endYear: new Date(),
    description: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      const response = await axios.get(`${userBaseUrl}/experiences`, { withCredentials: true });
      setExperience(response.data.data);
    } catch (error) {
      toast.error("Experience registry sync failed");
    }
  };

  const handleAddOrUpdateExperience = async () => {
    setLoading(true);
    try {
      const url = editingId ? `${userBaseUrl}/experiences/${editingId}` : `${userBaseUrl}/experiences`;
      const payload = { 
        ...formData,
        startYear: formData.startYear.getFullYear(),
        endYear: formData.endYear ? formData.endYear.getFullYear() : null,
      };

      await axios.post(url, payload, { withCredentials: true });
      fetchExperience();
      setIsFormVisible(false);
      setEditingId(null);
      setFormData({ jobTitle: "", company: "", startYear: new Date(), endYear: new Date(), description: "" });
      toast.success(editingId ? "Experience protocol updated" : "Experience node added");
    } catch (error) {
      toast.error("Protocol update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (exp) => {
    setFormData({
      ...exp,
      startYear: new Date(exp.startYear, 0, 1),
      endYear: exp.endYear ? new Date(exp.endYear, 0, 1) : null,
    });
    setEditingId(exp._id);
    setIsFormVisible(true);
  };

  const handleDelete = async (expId) => {
    try {
      await axios.delete(`${userBaseUrl}/experiences/${expId}`, { withCredentials: true });
      fetchExperience();
      toast.success("Experience node purged");
    } catch (error) {
      toast.error("Deletion protocol failure");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-slate-900 rounded-lg text-white">
              <Briefcase size={16} />
           </div>
           <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Experience Archives</h3>
        </div>
        {!isFormVisible && (
          <Button variant="outline" size="sm" onClick={() => setIsFormVisible(true)} className="gap-2">
             <Plus size={14} /> Initialize Node
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {experience.map((exp) => (
          <Card key={exp._id} className="p-6 border-slate-200 hover:border-blue-300 transition-all group relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
               <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-300 group-hover:text-blue-600 group-hover:border-blue-100 transition-all shrink-0">
                     <Building2 size={24} />
                  </div>
                  <div className="space-y-1">
                     <div className="flex items-center gap-3">
                        <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase leading-none">{exp.company}</h4>
                        <Badge variant="outline" className="text-[8px] border-slate-100 text-slate-400">{exp.startYear} — {exp.endYear || "Active"}</Badge>
                     </div>
                     <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{exp.jobTitle}</p>
                     <p className="text-xs font-medium text-slate-400 mt-2 max-w-2xl leading-relaxed italic">"{exp.description}"</p>
                  </div>
               </div>
               <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEditClick(exp)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                     <Edit3 size={16} />
                  </button>
                  <button onClick={() => handleDelete(exp._id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
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
              <Terminal size={18} className="text-blue-400" />
              <h4 className="text-xs font-black uppercase tracking-[0.2em]">{editingId ? "Update Node Protocol" : "New Experience manifest"}</h4>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Corporate Identity</label>
                 <Input 
                   type="text" 
                   placeholder="Company Identifier" 
                   className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 h-12"
                   value={formData.company}
                   onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                 />
              </div>
              <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Functional Role</label>
                 <Input 
                   type="text" 
                   placeholder="Job Title" 
                   className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 h-12"
                   value={formData.jobTitle}
                   onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                 />
              </div>
              <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Initialization Year</label>
                 <DatePicker
                   selected={formData.startYear}
                   onChange={(date) => setFormData({ ...formData, startYear: date })}
                   showYearPicker
                   dateFormat="yyyy"
                   className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                   placeholderText="Select Alpha"
                 />
              </div>
              <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Termination Year</label>
                 <DatePicker
                   selected={formData.endYear}
                   onChange={(date) => setFormData({ ...formData, endYear: date })}
                   showYearPicker
                   dateFormat="yyyy"
                   className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                   placeholderText="Present / Select Omega"
                 />
              </div>
              <div className="col-span-full space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Operational Log</label>
                 <textarea
                   placeholder="Describe payload..."
                   className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-4 text-sm font-bold h-32 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-600 resize-none"
                   value={formData.description}
                   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                 />
              </div>
           </div>
           <div className="flex items-center justify-end gap-3 mt-8 pt-8 border-t border-slate-800">
              <Button variant="ghost" size="sm" onClick={() => setIsFormVisible(false)} className="text-slate-400 hover:text-white">Abort</Button>
              <Button size="sm" onClick={handleAddOrUpdateExperience} disabled={loading} className="gap-2">
                 {loading ? <Zap size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                 {editingId ? "Commit Update" : "Deploy Node"}
              </Button>
           </div>
        </Card>
      )}
    </div>
  );
};

export default Experience;
