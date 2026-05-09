import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Terminal, 
  Activity, 
  ArrowUpRight,
  ShieldCheck,
  Globe,
  Star
} from "lucide-react";
import { toast } from "react-toastify";
import { transactionBaseUrl } from "../utils/endpoints";
import Card from "../component/ui/Card";
import Badge from "../component/ui/Badge";
import Button from "../component/ui/Button";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const Earning = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [courseStats, setCourseStats] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [thisMonthRevenue, setThisMonthRevenue] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [coursesSold, setCoursesSold] = useState(0);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state) => state.user.userData);

  useEffect(() => {
    const fetchEarnings = async () => {
      if (!user?._id) return;
      try {
        const response = await axios.get(`${transactionBaseUrl}/instructor/${user._id}`, { withCredentials: true });
        const transactions = response.data?.data || [];
        
        const earningsByMonth = Array(12).fill(0);
        const courseMap = {};
        const studentSet = new Set();
        let total = 0;
        let monthRevenue = 0;
        const currentMonth = new Date().getMonth();

        transactions.forEach((tx) => {
          const createdAt = new Date(tx.createdAt);
          const month = createdAt.getMonth();
          studentSet.add(tx.userId);

          tx.courses.forEach((course) => {
            const courseId = course._id;
            const finalPrice = course.finalPrice || course.price || 0;
            
            total += finalPrice;
            earningsByMonth[month] += finalPrice;
            if (month === currentMonth) monthRevenue += finalPrice;

            if (!courseMap[courseId]) {
              courseMap[courseId] = {
                name: course.title,
                originalPrice: course.price,
                totalRevenue: 0,
                students: new Set(),
                rating: course.averageRating || 0,
                finalPrice,
              };
            }
            courseMap[courseId].totalRevenue += finalPrice;
            courseMap[courseId].students.add(tx.userId);
          });
        });

        setMonthlyRevenue(monthNames.map((m, i) => ({ month: m, revenue: earningsByMonth[i] })));
        setCourseStats(Object.values(courseMap).map(c => ({
          ...c,
          revenue: c.totalRevenue,
          students: c.students.size,
        })));
        setTotalRevenue(total);
        setThisMonthRevenue(monthRevenue);
        setTotalStudents(studentSet.size);
        setCoursesSold(transactions.length);
      } catch (error) {
        toast.error("Financial synchronizer failure");
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, [user]);

  if (loading) return null;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Financial Protocol Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/10 flex items-center justify-center text-emerald-600 border border-emerald-500/20">
                 <TrendingUp size={16} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Financial Infrastructure Node</p>
           </div>
           <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">
              Earning <br />
              <span className="text-slate-400">Synchronization Hub</span>
           </h2>
        </div>
        <div className="flex gap-2">
           <Badge variant="outline" className="bg-white border-slate-200 text-slate-500 px-4 py-2">
              Currency: INR (₹)
           </Badge>
           <Badge variant="primary" className="bg-slate-900 text-white border-transparent px-4 py-2">
              Stable v4.0
           </Badge>
        </div>
      </div>

      {/* Operational Metrics Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Gross Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: <DollarSign size={18} />, color: "blue" },
          { label: "Cycle Yield", value: `₹${thisMonthRevenue.toLocaleString()}`, icon: <Activity size={18} />, color: "emerald" },
          { label: "Entity Reach", value: totalStudents, icon: <Users size={18} />, color: "indigo" },
          { label: "Protocol Dispatches", value: coursesSold, icon: <ShoppingBag size={18} />, color: "rose" },
        ].map((item, idx) => (
          <Card key={idx} className="p-6 overflow-hidden relative group hover:border-blue-300 transition-all">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                {item.icon}
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{item.label}</p>
             <div className="flex items-baseline gap-2">
                <p className="text-2xl font-black text-slate-900 tracking-tighter">{item.value}</p>
                <ArrowUpRight size={14} className="text-emerald-500" />
             </div>
          </Card>
        ))}
      </div>

      {/* Trajectory Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <Card className="lg:col-span-2 p-8 space-y-8 bg-white border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
               <div className="space-y-1">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Revenue Trajectory</h3>
                  <p className="text-xs text-slate-400 font-medium">Monthly synchronization audit</p>
               </div>
               <Badge variant="outline" className="text-[10px] border-slate-100 text-slate-400">Real-time Data</Badge>
            </div>
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyRevenue}>
                     <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis 
                       dataKey="month" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
                       dy={10}
                     />
                     <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
                     />
                     <Tooltip 
                       contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                       itemStyle={{ color: '#60a5fa' }}
                     />
                     <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </Card>

         <Card className="p-8 space-y-8 bg-slate-900 border-transparent shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                <Globe size={400} className="translate-x-1/2 -translate-y-1/4 text-white" />
            </div>
            <div className="relative z-10 space-y-6">
               <div className="p-4 bg-white/10 rounded-2xl w-fit border border-white/10">
                  <Terminal size={24} className="text-blue-400" />
               </div>
               <div className="space-y-2">
                  <h3 className="text-xl font-black text-white tracking-tight uppercase">Protocol Integrity</h3>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed">
                     Your knowledge nodes are currently propagating across the global synchronization network. 
                     Financial handshake verified at 99.9% uptime.
                  </p>
               </div>
               <div className="pt-6 border-t border-white/5 space-y-4">
                  <div className="flex items-center gap-3">
                     <ShieldCheck size={16} className="text-blue-400" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Audited Compliance</span>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-2xl border border-white/5">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Last Payload</p>
                     <p className="text-sm font-bold text-white">Manual Verification Required</p>
                  </div>
               </div>
            </div>
         </Card>
      </div>

      {/* Node Earning Topology */}
      <Card className="p-0 border-slate-200 overflow-hidden bg-white">
         <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="space-y-1">
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Node Performance Terminal</h3>
               <p className="text-xs text-slate-400 font-medium">Individual protocol yield analysis</p>
            </div>
            <Button variant="outline" size="sm">Export Manifest</Button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50">
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Node</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Base Value</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Dispatch At</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Cycle Yield</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Entities</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Quality Index</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {courseStats.map((course, idx) => (
                     <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-6">
                           <p className="text-sm font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors uppercase">{course.name}</p>
                        </td>
                        <td className="p-6 text-sm font-bold text-slate-500">₹{course.originalPrice.toLocaleString()}</td>
                        <td className="p-6 text-sm font-bold text-slate-500">₹{course.finalPrice.toLocaleString()}</td>
                        <td className="p-6 text-sm font-black text-slate-900 tracking-tighter italic">₹{course.revenue.toLocaleString()}</td>
                        <td className="p-6">
                           <Badge variant="outline" className="border-slate-200 text-slate-500">{course.students} Synchronizations</Badge>
                        </td>
                        <td className="p-6">
                           <div className="flex items-center gap-2">
                              <Star size={12} className="text-amber-400 fill-amber-400" />
                              <span className="text-sm font-black text-slate-900">{course.rating.toFixed(1)}</span>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </Card>
    </div>
  );
};

export default Earning;
