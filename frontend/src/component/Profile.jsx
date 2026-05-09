import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { 
  Twitter, 
  Linkedin, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Terminal, 
  Edit3, 
  Globe,
  MapPin,
  Calendar,
  ExternalLink
} from "lucide-react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Badge from "./ui/Badge";

const Profile = () => {
  const user = useSelector((state) => state.user.userData);
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Identity Node */}
      <Card className="p-8 md:p-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row gap-10 items-start relative z-10">
          {/* Avatar Station */}
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-600/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img
              src={user.profilePicture?.url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt="Identity"
              className="w-32 h-32 md:w-40 md:h-40 rounded-[40px] border-4 border-white shadow-2xl object-cover relative z-10 grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
            />
            <div className="absolute -bottom-2 -right-2 p-2.5 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-200 z-20">
               <ShieldCheck size={20} />
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                 <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">{user.name}</h1>
                 <Badge variant="primary" className="bg-blue-50 border-blue-100 text-blue-700">
                    {user.role} Nodes Active
                 </Badge>
              </div>
              <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
                {user.bio || "Initial protocol initialized. Identity manifest pending synchronization."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-sm font-bold text-slate-400">
                 <Mail size={16} className="text-slate-300" />
                 {user.email}
              </div>
              {user.socialLinks?.twitter && (
                <div className="flex items-center gap-3 text-sm font-bold text-slate-400">
                   <Twitter size={16} className="text-slate-300" />
                   Twitter Protocol Sync
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-4">
              <Button size="md" onClick={() => navigate("/edit-profile")} className="shadow-lg shadow-blue-100">
                 <Edit3 size={18} className="mr-2" /> Adjust Identity Protocols
              </Button>
              
              <div className="flex items-center gap-2">
                {[
                  { icon: <Linkedin size={18} />, url: user.socialLinks?.linkedin },
                  { icon: <Twitter size={18} />, url: user.socialLinks?.twitter },
                  { icon: <Youtube size={18} />, url: user.socialLinks?.youtube },
                  { icon: <Instagram size={18} />, url: user.socialLinks?.instagram },
                ].filter(s => s.url).map((social, idx) => (
                  <a 
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-slate-50 border border-slate-200 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Operational Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="p-6 bg-white border-slate-200 hover:border-blue-200 transition-all group">
            <div className="flex items-center gap-4">
               <div className="p-3 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Terminal size={20} />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Access Protocol</p>
                  <p className="text-sm font-bold text-slate-900">Stable v4.0.0</p>
               </div>
            </div>
         </Card>
         <Card className="p-6 bg-white border-slate-200 hover:border-blue-200 transition-all group">
            <div className="flex items-center gap-4">
               <div className="p-3 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Globe size={20} />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Node Location</p>
                  <p className="text-sm font-bold text-slate-900">Global Distribution</p>
               </div>
            </div>
         </Card>
         <Card className="p-6 bg-white border-slate-200 hover:border-blue-200 transition-all group">
            <div className="flex items-center gap-4">
               <div className="p-3 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Calendar size={20} />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sync Date</p>
                  <p className="text-sm font-bold text-slate-900">{new Date().toLocaleDateString()}</p>
               </div>
            </div>
         </Card>
      </div>
    </div>
  );
};

export default Profile;
