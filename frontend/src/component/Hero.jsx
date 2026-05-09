import { motion } from "framer-motion";
import { Play, ArrowRight, ShieldCheck, Zap, Globe } from "lucide-react";
import Button from "./ui/Button";
import heroImage from "../assets/lms-hero.png";

const Hero = () => {
  return (
    <section className="relative bg-white pt-24 pb-20 overflow-hidden border-b border-slate-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Content Node */}
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
              <Zap size={12} className="fill-current" />
              v2.0 Platform Live
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                Master skills for the <br />
                <span className="text-blue-600">modern workforce.</span>
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                A high-performance learning ecosystem architected for builders, engineers, and industrial leaders. Access 500+ expert-led workshops.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button size="lg" className="w-full sm:w-auto" onClick={() => (window.location.href = "/register")}>
                Start Learning Now
                <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => window.open("https://drive.google.com/file/d/1DgrDrbEdsnVaIEhFgBdNru2W4vsuGShC/view?usp=drive_link", "_blank")}>
                <Play size={18} className="mr-2 fill-current" />
                Platform Demo
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-4 opacity-50 grayscale transition-all hover:grayscale-0">
              <div className="flex items-center gap-2 text-slate-600 font-bold text-xs uppercase tracking-widest">
                <ShieldCheck size={16} /> Enterprise Verified
              </div>
              <div className="flex items-center gap-2 text-slate-600 font-bold text-xs uppercase tracking-widest">
                <Globe size={16} /> Global Learning
              </div>
            </div>
          </div>

          {/* Asset Node */}
          <div className="flex-1 relative">
            <div className="absolute -inset-4 bg-slate-50 rounded-3xl -z-10 rotate-1 border border-slate-100" />
            <img
              src={heroImage}
              alt="Platform Interface"
              className="w-full h-auto object-contain rounded-2xl shadow-xl border border-slate-200"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
