import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Twitter, Linkedin, Instagram, Youtube, Mail, Phone, Edit3, ShieldCheck } from "lucide-react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Badge from "./ui/Badge";

const Profile = () => {
  const user = useSelector((state) => state.user.userData);

  return (
    <Card className="p-8 bg-white border-slate-200 overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-8 opacity-5">
          <ShieldCheck size={120} />
      </div>

      <div className="flex flex-col md:flex-row gap-10 relative z-10">
        <div className="shrink-0 flex flex-col items-center gap-4">
            <div className="relative">
                <img
                    src={user.profilePicture?.url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt={user.name}
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-slate-50 shadow-sm"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white">
                    <ShieldCheck size={16} />
                </div>
            </div>
            <Badge variant="primary" className="bg-blue-50 text-blue-700 border-blue-100 font-black">
                {user.role.toUpperCase()} NODE
            </Badge>
        </div>

        <div className="flex-1 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{user.name}</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Identity Protocol: {user._id.slice(-6).toUpperCase()}</p>
            </div>
            <Link to="/dashboard/edit-profile">
               <Button variant="outline" size="sm">
                  <Edit3 size={14} className="mr-2" /> Modify Profile
               </Button>
            </Link>
          </div>

          <div className="prose prose-slate max-w-none text-sm font-medium text-slate-600 leading-relaxed border-l-2 border-slate-100 pl-6">
            {user.bio || "No biographical documentation synchronized for this node. Update profile to initialize identity data."}
          </div>

          <div className="flex flex-wrap items-center gap-8 pt-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <Mail size={16} />
                <span>{user.email}</span>
            </div>
            
            <div className="flex items-center gap-4">
              {user.socialLinks?.linkedin && (
                <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors">
                  <Linkedin size={18} />
                </a>
              )}
              {user.socialLinks?.twitter && (
                <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors">
                  <Twitter size={18} />
                </a>
              )}
              {user.socialLinks?.youtube && (
                <a href={user.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-rose-600 transition-colors">
                  <Youtube size={18} />
                </a>
              )}
              {user.socialLinks?.instagram && (
                <a href={user.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-fuchsia-600 transition-colors">
                  <Instagram size={18} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Profile;
