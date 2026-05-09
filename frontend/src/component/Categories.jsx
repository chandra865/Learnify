import React from "react";
import { motion } from "framer-motion";
import { 
  Code, 
  Briefcase, 
  Palette, 
  Megaphone, 
  TrendingUp, 
  Shield, 
  Cpu, 
  Globe,
  ArrowRight
} from "lucide-react";
import Card from "./ui/Card";

const Categories = () => {
  const categoryData = [
    {
      name: "Engineering",
      description: "Industrial-grade development protocols and system architecture.",
      icon: <Code size={24} />,
      nodes: 124,
      color: "blue",
    },
    {
      name: "Optimization",
      description: "Business logic synchronization and operational efficiency.",
      icon: <TrendingUp size={24} />,
      nodes: 86,
      color: "emerald",
    },
    {
      name: "Interface",
      description: "High-density interaction design and product psychology.",
      icon: <Palette size={24} />,
      nodes: 54,
      color: "rose",
    },
    {
      name: "Distribution",
      description: "Strategic market deployment and architectural growth.",
      icon: <Megaphone size={24} />,
      nodes: 42,
      color: "amber",
    },
    {
      name: "Infrastructure",
      description: "System security frameworks and global node management.",
      icon: <Shield size={24} />,
      nodes: 31,
      color: "slate",
    },
    {
      name: "Intelligence",
      description: "Advanced cognitive models and neural synchronization.",
      icon: <Cpu size={24} />,
      nodes: 67,
      color: "indigo",
    }
  ];

  const colorVariants = {
    blue: "bg-blue-50 text-blue-600 border-blue-100 placeholder:bg-blue-600",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    slate: "bg-slate-50 text-slate-600 border-slate-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
  };

  return (
    <section className="bg-[#fafafa] py-24 px-6">
      <div className="max-w-[1440px] mx-auto space-y-16">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Knowledge Domains</p>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">
                    Explore Framework <br />
                    <span className="text-blue-600">Specializations</span>
                </h2>
            </div>
            <p className="text-sm text-slate-500 font-medium max-w-sm leading-relaxed">
              Navigate through high-density knowledge sectors designed for industrial performance and professional scaling.
            </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryData.map((cat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <Card className="p-1 group-hover:border-blue-600/20 transition-all">
                <div className="p-6 flex items-start gap-5">
                    <div className={`p-4 rounded-2xl border ${colorVariants[cat.color]} transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
                        {cat.icon}
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">{cat.name}</h3>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-500">
                                {cat.nodes} Nodes
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4">
                            {cat.description}
                        </p>
                        <div className="pt-2 flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                            Initialize Sync <ArrowRight size={14} />
                        </div>
                    </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-center pt-8">
            <div className="flex items-center gap-3 px-6 py-2 rounded-full border border-slate-200 bg-white shadow-sm text-[10px] font-black uppercase tracking-widest text-slate-400">
                <Globe size={14} />
                Global Domain Index Updated
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
