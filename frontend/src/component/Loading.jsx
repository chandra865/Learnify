import React from "react";
import { Terminal, ShieldCheck, Activity } from "lucide-react";
import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-[#fafafa]">
      <div className="relative">
         <div className="absolute inset-0 bg-blue-600/10 blur-[40px] rounded-full animate-pulse" />
         <motion.div 
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
           className="w-20 h-20 rounded-[32px] bg-white border border-slate-200 shadow-2xl flex items-center justify-center relative z-10"
         >
            <div className="w-10 h-10 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin" />
         </motion.div>
      </div>

      <div className="mt-12 text-center space-y-4">
         <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
               <ShieldCheck size={14} className="text-blue-500" />
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Synchronizing Local Nodes</p>
            </div>
            <p className="text-xs font-bold text-slate-400 animate-pulse">Establishing secure protocol handshake...</p>
         </div>

         <div className="flex items-center justify-center gap-6 pt-6 border-t border-slate-100 w-64 mx-auto">
            <div className="text-center">
               <p className="text-[8px] font-black uppercase tracking-widest text-slate-300 mb-1">Stability</p>
               <Badge variant="outline" className="text-[8px] px-2 py-0 border-slate-100 text-slate-400">99.9%</Badge>
            </div>
            <div className="text-center">
               <p className="text-[8px] font-black uppercase tracking-widest text-slate-300 mb-1">Protocol</p>
               <Badge variant="outline" className="text-[8px] px-2 py-0 border-slate-100 text-slate-400">v4.0.0</Badge>
            </div>
         </div>
      </div>
    </div>
  );
};

const Badge = ({ children, className }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
    {children}
  </span>
);

export default Loading;
