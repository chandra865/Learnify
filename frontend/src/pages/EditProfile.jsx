import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { 
  Camera, 
  User as UserIcon, 
  Terminal, 
  ShieldCheck, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Youtube,
  ArrowLeft,
  Save,
  Info
} from "lucide-react";
import { login } from "../store/slice/userSlice";
import { userBaseUrl } from "../utils/endpoints";
import Card from "../component/ui/Card";
import Button from "../component/ui/Button";
import Input from "../component/ui/Input";
import Badge from "../component/ui/Badge";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userData);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [socialLinks, setSocialLinks] = useState({
    twitter: "",
    instagram: "",
    youtube: "",
    linkedin: "",
  });
  const [imgPreview, setImgPreview] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.bio || "");
      setImgPreview(user.profilePicture?.url || "https://cdn-icons-png.flaticon.com/512/149/149071.png");
      setSocialLinks({
        twitter: user.socialLinks?.twitter || "",
        instagram: user.socialLinks?.instagram || "",
        youtube: user.socialLinks?.youtube || "",
        linkedin: user.socialLinks?.linkedin || "",
      });
      setProfilePicture(JSON.stringify(user.profilePicture || {}));
    }
  }, [user]);

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setSocialLinks(prev => ({ ...prev, [name]: value }));
  };

  const uploadMedia = async (file) => {
    const formData = new FormData();
    formData.append("media", file);
    formData.append("mediaType", "profilepic");
    const response = await axios.post(`${API_BASE_URL}/api/v1/media/upload-media`, formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const mediaData = await uploadMedia(file);
      setImgPreview(mediaData.profilepic.url);
      setProfilePicture(JSON.stringify(mediaData.profilepic));
      toast.success("Identity visual synchronized");
    } catch (error) {
      toast.error("Avatar synchronization failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    formData.append("profilePicture", profilePicture);
    formData.append("socialLinks", JSON.stringify(socialLinks));

    try {
      const response = await axios.put(`${userBaseUrl}/profile`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Identity manifest updated successfully");
      dispatch(login(response.data.data));
      navigate("/dashboard/profile");
    } catch (error) {
      toast.error(error.response?.data?.message || "Operational update failure");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header Protocol */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-10">
          <div className="space-y-4">
             <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="p-2 -ml-2">
                   <ArrowLeft size={18} />
                </Button>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Administrative Configuration</p>
             </div>
             <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">
                Adjust Identity <br />
                <span className="text-slate-400">Protocols</span>
             </h2>
          </div>
          
          <div className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm text-xs font-bold text-slate-600">
             <ShieldCheck size={16} className="text-blue-600" />
             Access Layer: Level 4
          </div>
        </div>

        {/* Identity Form Cluster */}
        <Card className="p-0 border-slate-200 overflow-hidden bg-white">
           <form onSubmit={handleSubmit} className="divide-y divide-slate-100">
              
              {/* Profile Picture Synchronizer */}
              <div className="p-8 md:p-12 flex flex-col items-center gap-8 bg-slate-50/50">
                 <div className="relative group">
                    <div className="absolute inset-0 bg-blue-600/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <img
                      src={imgPreview}
                      alt="Identity"
                      className="w-32 h-32 rounded-[40px] border-4 border-white shadow-2xl object-cover grayscale-[0.2] transition-all"
                    />
                    <label className="absolute -bottom-2 -right-2 p-3 bg-slate-900 text-white rounded-2xl shadow-xl cursor-pointer hover:bg-blue-600 transition-colors">
                       <Camera size={18} />
                       <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                 </div>
                 <div className="text-center space-y-1">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Identity Visual</h3>
                    <p className="text-xs text-slate-400 font-medium">Synchronize your terminal avatar node</p>
                 </div>
              </div>

              {/* Core Manifest */}
              <div className="p-8 md:p-12 space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Input 
                      label="Identity Name" 
                      placeholder="Protocol Identity" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      icon={<UserIcon size={16} />}
                      required
                    />
                    <div className="space-y-2">
                       <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Identity Bio</label>
                       <textarea 
                         className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all h-24 resize-none"
                         placeholder="Describe your architectural expertise..."
                         value={bio}
                         onChange={(e) => setBio(e.target.value)}
                       />
                    </div>
                 </div>
              </div>

              {/* Social Topology */}
              <div className="p-8 md:p-12 space-y-8">
                 <div className="flex items-center gap-2 mb-6">
                    <Terminal size={16} className="text-slate-400" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Social Topology Sync</h4>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Input 
                      label="LinkedIn Hub" 
                      name="linkedin"
                      value={socialLinks.linkedin} 
                      onChange={handleSocialChange} 
                      icon={<Linkedin size={16} />} 
                      placeholder="https://linkedin.com/in/..."
                    />
                    <Input 
                      label="Twitter Node" 
                      name="twitter"
                      value={socialLinks.twitter} 
                      onChange={handleSocialChange} 
                      icon={<Twitter size={16} />} 
                      placeholder="https://twitter.com/..."
                    />
                    <Input 
                      label="YouTube Channel" 
                      name="youtube"
                      value={socialLinks.youtube} 
                      onChange={handleSocialChange} 
                      icon={<Youtube size={16} />} 
                      placeholder="https://youtube.com/c/..."
                    />
                    <Input 
                      label="Instagram Cluster" 
                      name="instagram"
                      value={socialLinks.instagram} 
                      onChange={handleSocialChange} 
                      icon={<Instagram size={16} />} 
                      placeholder="https://instagram.com/..."
                    />
                 </div>
              </div>

              {/* Deployment Actions */}
              <div className="p-8 md:p-12 bg-slate-50 flex items-center justify-between gap-6">
                 <div className="flex items-center gap-3 text-xs font-bold text-slate-400 italic">
                    <Info size={16} />
                    Configuration update required for node propagation
                 </div>
                 <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate(-1)}>Abort</Button>
                    <Button type="submit" isLoading={isUpdating} className="px-10">
                       <Save size={18} className="mr-2" /> Commit Manifest
                    </Button>
                 </div>
              </div>
           </form>
        </Card>
      </div>
    </div>
  );
};

export default EditProfile;
