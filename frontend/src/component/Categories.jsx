import { 
  Code, 
  Target, 
  Palette, 
  TrendingUp, 
  BarChart,
  Terminal,
  Cpu,
  Layers
} from "lucide-react";
import Card from "./ui/Card";

const Categories = () => {
  const categoryData = [
    {
      name: "Engineering",
      description: "Cloud architecture, devops, and industrial systems.",
      icon: <Terminal size={20} className="text-blue-600" />,
      tag: "Deep Tech"
    },
    {
      name: "Strategy",
      description: "Business logic and market-driven architecture.",
      icon: <TrendingUp size={20} className="text-emerald-600" />,
      tag: "Growth"
    },
    {
      name: "Interface",
      description: "Functional design systems and UX architecture.",
      icon: <Palette size={20} className="text-rose-600" />,
      tag: "Design"
    },
    {
      name: "Analytics",
      description: "Data intelligence and predictive modeling.",
      icon: <BarChart size={20} className="text-amber-600" />,
      tag: "Insights"
    }
  ];

  return (
    <section className="bg-slate-50 py-24 border-b border-slate-200/60">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl space-y-4">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Domain Discovery</h2>
            <h3 className="text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                Explore our core learning clusters.
            </h3>
          </div>
          <p className="text-slate-500 text-sm font-medium max-w-xs leading-relaxed">
            High-density curriculums curated for engineers and builders who demand industrial precision.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryData.map((cat, index) => (
            <Card
              key={index}
              hover
              className="p-8 group bg-white cursor-pointer"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:border-slate-200 transition-colors">
                        {cat.icon}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                        {cat.tag}
                    </span>
                </div>
                <div className="space-y-2">
                    <h4 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                        {cat.name}
                    </h4>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                        {cat.description}
                    </p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                    Explore Branch 
                    <Layers size={12} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
