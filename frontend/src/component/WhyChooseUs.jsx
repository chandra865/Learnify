import { Lightbulb, Clock, Award, ShieldCheck, Zap, BarChart } from "lucide-react";
import Card from "./ui/Card";

const WhyChooseUs = () => {
  const benefits = [
    {
      title: "Expert Instruction",
      description: "Learn from industry professionals with verified experience in modern tech stacks.",
      icon: <Lightbulb size={24} className="text-blue-600" />,
    },
    {
      title: "On-Demand Access",
      description: "Study at your own pace with a high-density, focus-driven learning environment.",
      icon: <Clock size={24} className="text-blue-600" />,
    },
    {
      title: "Accredited Tracks",
      description: "Receive industry-recognized certifications upon completion of curriculum nodes.",
      icon: <Award size={24} className="text-blue-600" />,
    },
  ];

  return (
    <section className="bg-white py-24 border-b border-slate-100">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mb-16 underline-offset-8">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-4">Platform Values</h2>
            <h3 className="text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                Architected for high-performance <br />skill acquisition.
            </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              hover
              className="p-8 space-y-6 bg-slate-50/50 border-slate-200/60"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                {benefit.icon}
              </div>
              <div className="space-y-3">
                <h4 className="text-lg font-bold text-slate-900 tracking-tight">{benefit.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  {benefit.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
