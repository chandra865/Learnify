import React from "react";
import { Link } from "react-router-dom";
import { Twitter, Linkedin, Instagram, Github, Mail, ShieldCheck, Terminal, Globe, ArrowUpRight } from "lucide-react";
import siteLogo from "../assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 pt-20 pb-10 border-t border-slate-900 overflow-hidden relative">
      {/* Abstract Background Element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 pb-16">
          
          {/* Brand Identity Node */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <img src={siteLogo} alt="Learnify" className="h-8 w-8 transition-transform group-hover:scale-110" />
              <span className="text-xl font-black tracking-tighter text-white">Learnify</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Industrial-grade learning framework for professional architects, engineers, and domain experts. 
              Accelerate your expertise through high-density knowledge nodes.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="p-2 bg-slate-900 border border-slate-800 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 bg-slate-900 border border-slate-800 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-all">
                <Linkedin size={18} />
              </a>
              <a href="#" className="p-2 bg-slate-900 border border-slate-800 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-all">
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Infrastructure Links */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Framework Infrastructure</h3>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link to="/courses" className="hover:text-white transition-colors flex items-center justify-between group">Domain Library <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
              <li><Link to="/instructors" className="hover:text-white transition-colors flex items-center justify-between group">Expert Directory <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
              <li><Link to="/research" className="hover:text-white transition-colors flex items-center justify-between group">Knowledge Base <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
            </ul>
          </div>

          {/* Operational Links */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Global Operations</h3>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link to="/about" className="hover:text-white transition-colors">Core Objective</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Dispatch Terminal</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Framework Integrity</Link></li>
              <li><Link to="/security" className="hover:text-white transition-colors">Security Protocol</Link></li>
            </ul>
          </div>

          {/* Protocol Subscription */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Protocol Dispatch</h3>
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Join the architectural dispatch for weekly knowledge synchronization.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="node-identity@domain.com" 
                  className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-xs font-medium focus:outline-none focus:border-blue-600 w-full" 
                />
                <button className="bg-blue-600 text-white rounded-lg px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all whitespace-nowrap">
                  Sync
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Console Termination */}
        <div className="pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/50 rounded-full border border-slate-800/50">
              <Terminal size={12} /> System Status: Operational
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/50 rounded-full border border-slate-800/50">
              <ShieldCheck size={12} /> SSL Protocol 4.0
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
              © {currentYear} Learnify Frameworks Inc.
            </p>
            <p className="text-[8px] font-medium text-slate-700 mt-1">
              Industrial knowledge distribution via high-density node protocols.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
