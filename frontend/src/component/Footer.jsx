import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";
import siteLogo from "../assets/logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        
        {/* Brand Core */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2">
            <img src={siteLogo} alt="Learnify" className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Learnify
            </span>
          </Link>
          <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
            Architecting the future of open-source education. Build, scale, and learn with industrial-grade tools.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors text-xl"><FaFacebook /></a>
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors text-xl"><FaTwitter /></a>
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors text-xl"><FaLinkedin /></a>
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors text-xl"><FaGithub /></a>
          </div>
        </div>

        {/* Resources Console */}
        <div className="space-y-6">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Platform</h4>
          <ul className="space-y-3">
            <li><a href="/courses" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Course Catalog</a></li>
            <li><a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Learning Paths</a></li>
            <li><a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Certifications</a></li>
            <li><a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">For Teams</a></li>
          </ul>
        </div>

        {/* Company Node */}
        <div className="space-y-6">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Company</h4>
          <ul className="space-y-3">
            <li><a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">About Mission</a></li>
            <li><a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Instructor Gateway</a></li>
            <li><a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Open Positions</a></li>
            <li><a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Ecosystem News</a></li>
          </ul>
        </div>

        {/* Support Matrix */}
        <div className="space-y-6">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Terminal</h4>
          <ul className="space-y-3">
            <li><a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Documentation</a></li>
            <li><a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">API Reference</a></li>
            <li><a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Status Core</a></li>
            <li><a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Security Node</a></li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-400">
        <p>© {currentYear} Learnify Protocol. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
