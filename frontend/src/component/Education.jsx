import axios from "axios";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Plus, Edit3, Trash2, Calendar, GraduationCap, Save, GraduationCap as School } from "lucide-react";
import { toast } from "react-toastify";
import { userBaseUrl } from "../utils/endpoints";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Badge from "./ui/Badge";

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
      // Quiet fail
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
      toast.success(editingId ? "Credential updated" : "Credential synchronized");
      fetchEducation();
      setIsFormVisible(false);
      setEditingId(null);
      setFormData({
        institution: "", degree: "", startYear: new Date(), endYear: new Date(), cgpa: "",
      });
    } catch (error) {
      toast.error("Credential synchronization failure");
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
      toast.success("Credential detached");
      fetchEducation();
    } catch (error) {
      toast.error("Detachment failure");
    }
  };

  return (
    <Card className="p-8 bg-white border-slate-200 mt-6 overflow-hidden">
      <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Academic Base</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Educational Credential Matrix</p>
          </div>
          <School size={24} className="text-blue-100" />
      </div>

      <div className="space-y-4">
        {education.map((edu) => (
          <div
            key={edu._id}
            className="group relative p-6 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:border-slate-300 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                  <h4 className="text-lg font-bold text-slate-900 tracking-tight">{edu.institution}</h4>
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-600">{edu.degree}</p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Calendar size={12} />
                  <span>{edu.startYear} — {edu.endYear}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-white border-slate-200 text-slate-600 text-[10px] font-black">
                    GP: {edu.cgpa}
                </Badge>
            </div>

            <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => handleEditClick(edu)}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm"
                >
                    <Edit3 size={14} />
                </button>
                <button
                    onClick={() => handleDelete(edu._id)}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm"
                >
                    <Trash2 size={14} />
                </button>
            </div>
          </div>
        ))}

        {education.length === 0 && !isFormVisible && (
            <div className="py-12 border border-dashed border-slate-200 rounded-xl text-center">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No academic credentials synchronized</p>
            </div>
        )}
      </div>

      {isFormVisible && (
        <div className="mt-8 pt-8 border-t border-slate-100 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <Input
                    label="Institutional Node"
                    placeholder="e.g. Stanford University"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                />
                <Input
                    label="Degree Classification"
                    placeholder="e.g. Master of Science in CS"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
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
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Completion Year</label>
                        <DatePicker
                            selected={formData.endYear}
                            onChange={(date) => setFormData({ ...formData, endYear: date })}
                            showYearPicker dateFormat="yyyy"
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"
                        />
                    </div>
                </div>
                <Input
                    label="Grade Metric (CGPA)"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 3.9"
                    value={formData.cgpa}
                    onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                />
            </div>
          </div>
          <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsFormVisible(false)}>
                  Abort
              </Button>
              <Button onClick={handleAddOrUpdateEducation} isLoading={loading}>
                  <Save size={16} className="mr-2" /> {editingId ? "Update Node" : "Synchronize Node"}
              </Button>
          </div>
        </div>
      )}

      {!isFormVisible && (
        <div className="mt-8 flex justify-center">
            <Button variant="outline" onClick={() => setIsFormVisible(true)}>
                <Plus size={16} className="mr-2" /> Add Academic Node
            </Button>
        </div>
      )}
    </Card>
  );
};

export default Education;
