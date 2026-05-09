import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, Play, Users, BookOpen, Star, Sparkles, Terminal } from "lucide-react";
import Button from "./ui/Button";
import heroImage from "../assets/lms-hero.png";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 pb-16 overflow-hidden bg-[#fafafa]">
       {/* Industrial Background Grid */}
       <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ backgroundImage: `radial-gradient(#000000 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />
       
       <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

       <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          
          {/* Content Node */}
          <div className="space-y-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-black uppercase tracking-[0.2em] text-blue-700"
              >
                  <Sparkles size={14} className="animate-pulse" />
                  Next-Gen Learning Protocol v4.0.0
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                  <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.95]">
                    Architect Your <br />
                    <span className="text-blue-600">Cognitive Framework</span>
                  </h1>
                  <p className="text-lg md:text-xl text-slate-500 max-w-xl leading-relaxed font-medium">
                    Industrial-grade knowledge distribution for professional engineers. 
                    Master complex domains through high-density curriculum nodes and expert-led synchronization.
                  </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row items-center gap-4"
              >
                  <Button size="lg" className="w-full sm:w-auto shadow-xl shadow-blue-200">
                    Initialize Protocol <ArrowRight size={18} className="ml-2" />
                  </Button>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <Play size={18} className="mr-2 fill-current" /> Watch Simulation
                  </Button>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="pt-8 border-t border-slate-200 flex flex-wrap gap-8"
              >
                  <div className="space-y-1">
                      <p className="text-2xl font-black text-slate-900 tracking-tight">12.8k+</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verified Nodes</p>
                  </div>
                  <div className="space-y-1">
                      <p className="text-2xl font-black text-slate-900 tracking-tight">460+</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Expert Syncs</p>
                  </div>
                  <div className="space-y-1">
                      <p className="text-2xl font-black text-slate-900 tracking-tight">99.8%</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Knowledge Retention</p>
                  </div>
              </motion.div>
          </div>

          {/* Visual Terminal */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.8 }}
             className="relative"
          >
             <div className="absolute inset-0 bg-blue-600/10 rounded-[40px] blur-[100px] -z-10 animate-pulse" />
             <div className="bg-white p-4 rounded-[40px] border border-slate-200 shadow-2xl relative">
                <div className="absolute top-8 right-8 p-4 bg-slate-900 rounded-3xl shadow-xl z-20 hidden md:block animate-bounce duration-3000">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                         <ShieldCheck size={24} />
                      </div>
                      <div>
                         <p className="text-xs font-black text-white uppercase tracking-widest">Identity Verified</p>
                         <p className="text-[10px] text-slate-400">Access Granted</p>
                      </div>
                   </div>
                </div>
                <img 
                  src={heroImage} 
                  alt="Industrial LMS Interface" 
                  className="w-full h-auto rounded-[32px] object-cover"
                />
                
                {/* Protocol Nodes Overlay */}
                <div className="absolute bottom-10 left-10 right-10 grid grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-white/50 shadow-lg">
                      <div className="h-1.5 w-8 bg-blue-600 rounded-full mb-2" />
                      <div className="h-1 w-full bg-slate-100 rounded-full" />
                    </div>
                  ))}
                </div>
             </div>

             {/* System Tags */}
             <div className="absolute -bottom-6 -right-6 p-4 bg-white border border-slate-200 rounded-2xl shadow-xl flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                   <Terminal size={20} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Protocol Hub</p>
                   <p className="text-[8px] text-slate-400 uppercase tracking-widest font-bold">Stable v4.0</p>
                </div>
             </div>
          </motion.div>
       </div>
    </section>
  );
};

export default Hero;
