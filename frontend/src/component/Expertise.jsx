import { useState, useEffect } from "react";
import axios from "axios";
import { X, Plus, Terminal, Zap } from "lucide-react";
import { toast } from "react-toastify";
import { userBaseUrl } from "../utils/endpoints";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Badge from "./ui/Badge";

const Expertise = () => {
  const [expertise, setExpertise] = useState([]);
  const [selectedExpertise, setSelectedExpertise] = useState("");
  const [customExpertise, setCustomExpertise] = useState("");
  const [loading, setLoading] = useState(false);

  const expertiseOptions = [
    "JavaScript", "React", "Node.js", "MongoDB", "CSS", "HTML", "TypeScript", "Python", "DevOps", "Next.js", "Other"
  ];

  const fetchExpertise = async () => {
    try {
      const response = await axios.get(`${userBaseUrl}/expertise`, { withCredentials: true });
      setExpertise(response.data.data || []);
    } catch (error) {
      toast.error("Expertise synchronization failure");
    }
  };

  useEffect(() => {
    fetchExpertise();
  }, []);

  const addExpertise = async () => {
    const expertiseToAdd = selectedExpertise === "Other" ? customExpertise.trim() : selectedExpertise;

    if (expertiseToAdd && !expertise.includes(expertiseToAdd)) {
      setLoading(true);
      const formData = new FormData();
      formData.append("expertise", expertiseToAdd);

      try {
        await axios.patch(`${userBaseUrl}/expertise`, formData, { withCredentials: true });
        setExpertise([...expertise, expertiseToAdd]);
        setSelectedExpertise("");
        setCustomExpertise("");
        fetchExpertise();
        toast.success("Expertise node synchronized");
      } catch (error) {
        toast.error("Expertise update failure");
      } finally {
        setLoading(false);
      }
    }
  };

  const removeExpertise = async (expertiseItem) => {
    try {
      await axios.delete(`${userBaseUrl}/expertise?expertise=${expertiseItem}`, { withCredentials: true });
      setExpertise(expertise.filter((e) => e !== expertiseItem));
      toast.success("Expertise node detached");
    } catch (error) {
      toast.error("Expertise detachment failure");
    }
  };

  return (
    <Card className="p-8 bg-white border-slate-200 mt-6 overflow-hidden">
      <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Expertise Matrix</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Technical Skillset Protocols</p>
          </div>
          <Zap size={24} className="text-blue-100" />
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="flex-1 flex gap-2">
            <select
              className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all appearance-none cursor-pointer"
              value={selectedExpertise}
              onChange={(e) => setSelectedExpertise(e.target.value)}
            >
              <option value="">Select Domain Protocol</option>
              {expertiseOptions.map((exp) => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>

            {selectedExpertise === "Other" && (
              <input
                type="text"
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-bold placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"
                placeholder="Declare Custom Domain"
                value={customExpertise}
                onChange={(e) => setCustomExpertise(e.target.value)}
              />
            )}
        </div>

        <Button
          onClick={addExpertise}
          isLoading={loading}
          disabled={!selectedExpertise || (selectedExpertise === "Other" && !customExpertise.trim())}
        >
          <Plus size={16} className="mr-2" /> Inject Protocol
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        {expertise.map((exp) => (
          <div
            key={exp}
            className="flex items-center gap-2 bg-slate-50 border border-slate-100 pl-4 pr-2 py-2 rounded-full group hover:border-slate-300 transition-all"
          >
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-600">{exp}</span>
            <button
              onClick={() => removeExpertise(exp)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-all"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        {expertise.length === 0 && (
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest py-4 italic">No expertise domains declared for this node.</p>
        )}
      </div>
    </Card>
  );
};

export default Expertise;
