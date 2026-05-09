import { useState, useEffect } from "react";
import axios from "axios";
import { X, Plus, Terminal, ShieldCheck, Zap, Layers, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import { userBaseUrl } from "../utils/endpoints";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import Input from "./ui/Input";

const Expertise = () => {
  const [expertise, setExpertise] = useState([]);
  const [selectedExpertise, setSelectedExpertise] = useState("");
  const [customExpertise, setCustomExpertise] = useState("");
  const [loading, setLoading] = useState(false);

  const expertiseOptions = [
    "JavaScript", "React", "Node.js", "MongoDB", "CSS", "HTML", "TypeScript", "Python", "Cloud Architecture", "Other",
  ];

  const fetchExpertise = async () => {
    try {
      const response = await axios.get(`${userBaseUrl}/expertise`, { withCredentials: true });
      setExpertise(response.data.data || []);
    } catch (error) {
      toast.error("Expertise registry sync failure");
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
        toast.success("Expertise node synchronized");
      } catch (error) {
        toast.error("Protocol update failed");
      } finally {
        setLoading(false);
      }
    }
  };

  const removeExpertise = async (expertiseItem) => {
    try {
      await axios.delete(`${userBaseUrl}/expertise?expertise=${expertiseItem}`, { withCredentials: true });
      setExpertise(expertise.filter((e) => e !== expertiseItem));
      toast.success("Expertise node purged");
    } catch (error) {
      toast.error("Deletion protocol failure");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-slate-900 rounded-lg text-white">
              <Layers size={16} />
           </div>
           <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Expertise Registry</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Configuration Node */}
         <Card className="p-6 border-slate-200 bg-slate-50/50 space-y-6">
            <div className="space-y-4">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Add Knowledge Node</label>
               <div className="relative">
                  <select
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 appearance-none focus:ring-2 focus:ring-blue-600/20 transition-all cursor-pointer"
                    value={selectedExpertise}
                    onChange={(e) => setSelectedExpertise(e.target.value)}
                  >
                    <option value="">Select Domain</option>
                    {expertiseOptions.map((exp) => (
                      <option key={exp} value={exp}>{exp}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
               </div>

               {selectedExpertise === "Other" && (
                 <Input
                   type="text"
                   placeholder="Enter custom expertise"
                   className="mt-2 h-12"
                   value={customExpertise}
                   onChange={(e) => setCustomExpertise(e.target.value)}
                 />
               )}
               
               <Button 
                 onClick={addExpertise} 
                 disabled={loading || !selectedExpertise} 
                 className="w-full gap-2 py-6"
               >
                  {loading ? <Zap size={14} className="animate-spin" /> : <Plus size={14} />}
                  Commit Expertise
               </Button>
            </div>
            
            <div className="p-4 bg-white/50 rounded-2xl border border-slate-200 flex items-start gap-3">
               <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
               <p className="text-[10px] font-medium text-slate-400 leading-relaxed italic">
                 Define your technical domain to optimize student discovery synchronization.
               </p>
            </div>
         </Card>

         {/* Expertise Matrix */}
         <Card className="md:col-span-2 p-8 border-slate-200 bg-white min-h-[240px]">
            <div className="flex items-center gap-3 mb-8">
               <Terminal size={14} className="text-slate-400" />
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Current Synchronization Matrix</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {expertise.length > 0 ? (
                expertise.map((exp) => (
                  <Badge 
                    key={exp} 
                    variant="outline" 
                    className="bg-slate-50 border-slate-200 text-slate-900 px-6 py-3 rounded-2xl flex items-center gap-3 group/badge hover:border-blue-300 transition-all"
                  >
                    <span className="text-xs font-black uppercase tracking-widest">{exp}</span>
                    <button 
                      onClick={() => removeExpertise(exp)}
                      className="text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center w-full py-12 space-y-4">
                   <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                      <Layers size={24} />
                   </div>
                   <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">Matrix Empty</p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50 flex items-center gap-4">
               <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Registry Stability: Active</span>
               </div>
            </div>
         </Card>
      </div>
    </div>
  );
};

const Info = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

export default Expertise;
