import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { 
  Users, 
  DollarSign, 
  Star, 
  TrendingUp, 
  Terminal, 
  Activity, 
  ShieldCheck, 
  Layers,
  ArrowUpRight,
  Zap,
  Info
} from "lucide-react";
import { useSelector } from "react-redux";
import Card from "./ui/Card";
import Badge from "./ui/Badge";

const CourseAnalytics = () => {
  const course = useSelector((state) => state.course.selectedCourse);

  const learners = course?.studentenrolled || 0;
  const revenue = learners * (course?.finalPrice || 0);
  const avgRating = course?.averageRating || 0;

  // Mock data for cinematic visualization
  const viewsData = [
    { day: "01", views: 120 }, { day: "02", views: 450 }, { day: "03", views: 300 },
    { day: "04", views: 780 }, { day: "05", views: 600 }, { day: "06", views: 900 }, { day: "07", views: 1200 },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] py-32 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Terminal Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
          <div className="space-y-4">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center text-indigo-600 border border-indigo-500/20">
                   <Activity size={16} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Performance Analytics Node</p>
             </div>
             <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">
                Course <br />
                <span className="text-slate-400">Operational Yield</span>
             </h2>
          </div>
          <div className="flex gap-2">
             <Badge variant="outline" className="bg-white border-slate-200 text-slate-500 px-4 py-2">
                Course ID: {course?._id?.slice(-8)}
             </Badge>
             <Badge variant="primary" className="bg-emerald-600 text-white border-transparent px-4 py-2 uppercase tracking-widest text-[9px] font-black">
                Real-time Sync: Active
             </Badge>
          </div>
        </div>

        {/* Operational Metrics Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-8 border-slate-200 bg-white group hover:border-blue-300 transition-all overflow-hidden relative">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all">
                <Users size={80} className="text-slate-300" />
             </div>
             <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-3">
                   <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 text-blue-600">
                      <Users size={20} />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cumulative Learners</p>
                </div>
                <div className="flex items-end gap-3">
                   <p className="text-4xl font-black text-slate-900 tracking-tighter italic">{learners}</p>
                   <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 mb-1">
                      <ArrowUpRight size={14} /> +12%
                   </div>
                </div>
             </div>
          </Card>

          <Card className="p-8 border-slate-200 bg-white group hover:border-emerald-300 transition-all overflow-hidden relative">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all">
                <DollarSign size={80} className="text-slate-300" />
             </div>
             <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-3">
                   <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-600">
                      <DollarSign size={20} />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Projected Yield</p>
                </div>
                <div className="flex items-end gap-3">
                   <p className="text-4xl font-black text-slate-900 tracking-tighter italic">₹{revenue.toLocaleString()}</p>
                   <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 mb-1">
                      <Zap size={14} /> Peak
                   </div>
                </div>
             </div>
          </Card>

          <Card className="p-8 border-slate-200 bg-white group hover:border-amber-300 transition-all overflow-hidden relative">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all">
                <Star size={80} className="text-slate-300" />
             </div>
             <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-3">
                   <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 text-amber-500">
                      <Star size={20} />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reputation Index</p>
                </div>
                <div className="flex items-end gap-3">
                   <p className="text-4xl font-black text-slate-900 tracking-tighter italic">{avgRating}</p>
                   <div className="flex items-center gap-1 text-amber-500 mb-1">
                      <Star size={14} fill="currentColor" />
                   </div>
                </div>
             </div>
          </Card>
        </div>

        {/* Analytics Visualization Protocol */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <Card className="p-8 border-slate-200 bg-white space-y-8">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <TrendingUp size={16} className="text-blue-600" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Synchronized View Trajectory</h3>
                 </div>
                 <Badge variant="outline" className="text-[8px] border-slate-100 text-slate-400">Real-time Stream</Badge>
              </div>
              <div className="h-[300px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={viewsData}>
                       <defs>
                          <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                             <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                       <Tooltip 
                         contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', color: '#fff', fontSize: '10px', fontWeight: '900' }}
                         itemStyle={{ color: '#60a5fa' }}
                       />
                       <Line type="monotone" dataKey="views" stroke="#2563eb" strokeWidth={4} dot={{ r: 4, fill: '#2563eb', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                    </LineChart>
                 </ResponsiveContainer>
              </div>
           </Card>

           <Card className="p-8 border-slate-900 bg-slate-900 text-white space-y-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex items-center justify-between relative z-10">
                 <div className="flex items-center gap-3">
                    <Terminal size={16} className="text-blue-400" />
                    <h3 className="text-xs font-black uppercase tracking-widest">Operational Diagnostics</h3>
                 </div>
              </div>

              <div className="space-y-6 relative z-10">
                 <div className="p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                          <Layers size={20} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Stability Matrix</p>
                          <p className="text-sm font-bold">Node Persistence Verified</p>
                       </div>
                    </div>
                    <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 bg-emerald-500/5 px-3 py-1">Optimal</Badge>
                 </div>

                 <div className="p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-400">
                          <ShieldCheck size={20} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Security Protocol</p>
                          <p className="text-sm font-bold">SHA-256 Synchronized</p>
                       </div>
                    </div>
                    <Badge variant="outline" className="border-blue-500/20 text-blue-400 bg-blue-500/5 px-3 py-1">Secure</Badge>
                 </div>
              </div>

              <div className="p-6 bg-blue-600/10 rounded-[32px] border border-blue-500/20 flex flex-col gap-4 relative z-10">
                 <div className="flex items-center gap-3">
                    <Info size={16} className="text-blue-400" />
                    <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                       Operational analytics nodes are verified through global distribution registries. System integrity remains at 99.99%.
                    </p>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseAnalytics;
