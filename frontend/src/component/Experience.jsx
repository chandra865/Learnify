import axios from "axios";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Plus, Edit3, Trash2, Calendar, Briefcase, ChevronDown, ChevronUp, Save, X } from "lucide-react";
import { toast } from "react-toastify";
import { userBaseUrl } from "../utils/endpoints";
import Card from "./ui/Card";
import Button from "./ui/Button";
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
      // Quiet fail
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
      toast.success(editingId ? "Experience node updated" : "Experience node synchronized");
      fetchExperience();
      setIsFormVisible(false);
      setEditingId(null);
      setFormData({
        jobTitle: "", company: "", startYear: new Date(), endYear: new Date(), description: "",
      });
    } catch (error) {
      toast.error("Experience synchronization failure");
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
      toast.success("Experience node detached");
      fetchExperience();
    } catch (error) {
      toast.error("Detachment failure");
    }
  };

  return (
    <Card className="p-8 bg-white border-slate-200 mt-6 overflow-hidden">
      <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Professional Timeline</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Operational Experience Matrix</p>
          </div>
          <Briefcase size={24} className="text-blue-100" />
      </div>

      <div className="space-y-4">
        {experience.map((exp) => (
          <div
            key={exp._id}
            className="group relative p-6 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:border-slate-300 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                  <h4 className="text-lg font-bold text-slate-900 tracking-tight">{exp.company}</h4>
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-600">{exp.jobTitle}</p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Calendar size={12} />
                  <span>{exp.startYear} — {exp.endYear || "Present"}</span>
              </div>
            </div>
            
            <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-2xl">
                {exp.description}
            </p>

            <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => handleEditClick(exp)}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm"
                >
                    <Edit3 size={14} />
                </button>
                <button
                    onClick={() => handleDelete(exp._id)}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm"
                >
                    <Trash2 size={14} />
                </button>
            </div>
          </div>
        ))}

        {experience.length === 0 && !isFormVisible && (
            <div className="py-12 border border-dashed border-slate-200 rounded-xl text-center">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No timeline experience synchronized</p>
            </div>
        )}
      </div>

      {isFormVisible && (
        <div className="mt-8 pt-8 border-t border-slate-100 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <Input
                    label="Job Title Protocol"
                    placeholder="e.g. Lead Curriculum Architect"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                />
                <Input
                    label="Organizational Node"
                    placeholder="e.g. Learnify HQ"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
            </div>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Initiation Year</label>
                        <DatePicker
                            selected={formData.startYear}
                            onChange={(date) => setFormData({ ...formData, startYear: date })}
                            showYearPicker dateFormat="yyyy"
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Termination Year</label>
                        <DatePicker
                            selected={formData.endYear}
                            onChange={(date) => setFormData({ ...formData, endYear: date })}
                            showYearPicker dateFormat="yyyy"
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"
                            placeholderText="Active"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Operational Description</label>
                    <textarea
                        placeholder="Document node responsibilities..."
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all min-h-[100px] resize-none"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsFormVisible(false)}>
                  Abort
              </Button>
              <Button onClick={handleAddOrUpdateExperience} isLoading={loading}>
                  <Save size={16} className="mr-2" /> {editingId ? "Update Node" : "Synchronize Node"}
              </Button>
          </div>
        </div>
      )}

      {!isFormVisible && (
        <div className="mt-8 flex justify-center">
            <Button variant="outline" onClick={() => setIsFormVisible(true)}>
                <Plus size={16} className="mr-2" /> Add Timeline Node
            </Button>
        </div>
      )}
    </Card>
  );
};

export default Experience;
