import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  Receipt, 
  Terminal, 
  ShieldCheck, 
  Clock, 
  ExternalLink,
  ChevronRight,
  MonitorPlay,
  Layers,
  Zap
} from "lucide-react";
import { transactionBaseUrl } from "../utils/endpoints";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get(`${transactionBaseUrl}/history`, { withCredentials: true });
        setOrders(response.data.data);
      } catch (err) {
        toast.error("Order history synchronization failed");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderHistory();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 space-y-6">
       <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Retrieving Protocol Logs...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Registry Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center text-indigo-600 border border-indigo-500/20">
                 <Receipt size={16} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Protocol Logs & Ledger</p>
           </div>
           <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">
              Order <br />
              <span className="text-slate-400">History Archives</span>
           </h2>
        </div>
        <Badge variant="outline" className="bg-white border-slate-200 text-slate-500 px-4 py-2">
           {orders.length} Verified Transactions
        </Badge>
      </div>

      {orders.length === 0 ? (
        <Card className="py-24 text-center space-y-6 border-dashed border-slate-200 bg-slate-50/50">
           <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center text-slate-300 shadow-sm">
              <Terminal size={32} />
           </div>
           <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">No Transactions Recorded</h3>
              <p className="text-sm font-medium text-slate-400 max-w-xs mx-auto">
                No protocol dispatch logs found in archival storage. Commit a new transaction to initialize ledger.
              </p>
           </div>
           <Button variant="outline" size="sm" onClick={() => window.location.href = "/courses"}>Discovery terminal</Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order._id} className="p-0 border-slate-200 overflow-hidden hover:border-indigo-300 transition-all group">
              {/* Log Header */}
              <div className="p-6 bg-slate-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Transaction Registry ID</p>
                    <div className="flex items-center gap-3">
                       <span className="text-sm font-bold tracking-tight text-blue-400">{order._id}</span>
                       <Badge variant="outline" className="bg-slate-900 border-slate-800 text-[8px] text-slate-500">v4.0 Protocol</Badge>
                    </div>
                 </div>
                 <div className="flex items-center gap-6">
                    <div className="text-left md:text-right">
                       <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Synchronization Date</p>
                       <p className="text-xs font-bold">{new Date(order.createdAt).toLocaleString()} MST</p>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-800" />
                    <div className="p-2 rounded-lg bg-emerald-600/10 text-emerald-400 border border-emerald-500/20">
                       <ShieldCheck size={18} />
                    </div>
                 </div>
              </div>

              {/* Protocol Content */}
              <div className="p-6 md:p-8 space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {order.courses.map((course) => (
                      <div key={course._id} className="flex items-start gap-6 group/item">
                         <div className="w-40 h-24 rounded-2xl overflow-hidden border border-slate-100 shrink-0">
                            <img src={course.thumbnail?.url} alt={course.title} className="w-full h-full object-cover grayscale-[0.2] group-hover/item:grayscale-0 transition-all" />
                         </div>
                         <div className="space-y-2">
                            <h3 className="text-base font-black text-slate-900 tracking-tight uppercase leading-tight group-hover/item:text-indigo-600 transition-colors">{course.title}</h3>
                            <div className="flex items-center gap-3">
                               <p className="text-sm font-black text-slate-900 italic tracking-tighter">₹{course.finalPrice || course.price}</p>
                               <Badge variant="outline" className="text-[8px] border-slate-100 text-slate-400">Node Sync Complete</Badge>
                            </div>
                            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                               <MonitorPlay size={10} />
                               LMS Persistence Layer: Active
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>

                 {/* Log Footer */}
                 <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                       <div className="flex flex-col">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Payment ID</p>
                          <p className="text-xs font-bold text-slate-600">{order.razorpay?.paymentId || "Internal Protocol"}</p>
                       </div>
                       <div className="h-6 w-[1px] bg-slate-100" />
                       <div className="flex flex-col">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Dispatch Units</p>
                          <p className="text-xs font-bold text-slate-600">{order.courses.length} Nodes</p>
                       </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-8">
                       <div className="text-right">
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Ledger Final Dispatch</p>
                          <p className="text-xl font-black text-slate-900 tracking-tighter italic">₹{order.amount}</p>
                       </div>
                       <Badge variant="primary" className="bg-emerald-600/10 text-emerald-600 border-none px-4 py-2 uppercase font-black tracking-widest">
                          {order.status}
                       </Badge>
                    </div>
                 </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
