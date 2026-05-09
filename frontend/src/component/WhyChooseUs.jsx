import React from "react";
import { motion } from "framer-motion";
import { UserCheck, Zap, ShieldCheck, GraduationCap, Award, Terminal } from "lucide-react";
import Card from "./ui/Card";

const WhyChooseUs = () => {
  const benefits = [
    {
      title: "Expert Instructors",
      description: "Synchronize with industry professionals possessing real-world production experience.",
      icon: <UserCheck size={28} />,
      color: "blue",
    },
    {
      title: "Real-time Iteration",
      description: "Accelerate your expertise through a framework designed for rapid skill acquisition.",
      icon: <Zap size={28} />,
      color: "amber",
    },
    {
      title: "Industrial Certification",
      description: "Receive accredited framework credentials upon successful node completion.",
      icon: <Award size={28} />,
      color: "emerald",
    },
  ];

  const colorVariants = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  return (
    <section className="bg-white py-24 px-6 relative overflow-hidden border-y border-slate-200">
      {/* Background Micro-Grid */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
            style={{ backgroundImage: `radial-gradient(#000000 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
      
      <div className="max-w-[1440px] mx-auto text-center space-y-16 relative z-10">
        <div className="space-y-4 max-w-2xl mx-auto">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Operational Advantages</p>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">
               Industrial-Grade <br />
               <span className="text-slate-400">Knowledge Distribution</span>
            </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Card className="p-8 h-full flex flex-col items-center text-center gap-6 border-slate-100 hover:border-blue-200 hover:bg-slate-50/50 transition-all">
                <div className={`p-4 rounded-2xl border ${colorVariants[benefit.color]} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                  {benefit.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">{benefit.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    {benefit.description}
                  </p>
                </div>
                <div className="mt-auto pt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Protocol Verified</span>
                    <ShieldCheck size={12} className="text-blue-600" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="pt-10 flex items-center justify-center gap-6 opacity-30 grayscale pointer-events-none">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                <Terminal size={14} /> Stability Index: 99.8%
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                <GraduationCap size={14} /> Nodes Provisioned: 45k+
            </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
