import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { login } from "../store/slice/userSlice";
import { userBaseUrl } from "../utils/endpoints";
import { Camera, Twitter, Linkedin, Instagram, Youtube, Save, X, ShieldCheck, Terminal } from "lucide-react";
import Card from "../component/ui/Card";
import Button from "../component/ui/Button";
import Input from "../component/ui/Input";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userData);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [socialLinks, setSocialLinks] = useState({
    twitter: "", instagram: "", youtube: "", linkedin: ""
  });
  const [imgPreview, setImgPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setSocialLinks((prevLinks) => ({ ...prevLinks, [name]: value }));
  };

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.bio || "");
      setProfilePicture(JSON.stringify({
        publicId: user.profilePicture?.publicId || "",
        url: user.profilePicture?.url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
      }));
      setImgPreview(user.profilePicture?.url || "https://cdn-icons-png.flaticon.com/512/149/149071.png");
      setSocialLinks({
        twitter: user.socialLinks?.twitter || "",
        instagram: user.socialLinks?.instagram || "",
        youtube: user.socialLinks?.youtube || "",
        linkedin: user.socialLinks?.linkedin || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      toast.success("Profile architecture updated successfully");
      dispatch(login(response.data.data));
      navigate("/dashboard/profile");
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failure");
    } finally {
      setLoading(false);
    }
  };

  const uploadMedia = async (file, mediaType) => {
    const formData = new FormData();
    formData.append("media", file);
    formData.append("mediaType", mediaType);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/media/upload-media`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  };

  const handleFileChange = async (event, mediaType) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      toast.info("Uploading identity media...");
      const mediaData = await uploadMedia(file, mediaType);
      setImgPreview(mediaData.profilepic.url);
      setProfilePicture(JSON.stringify({
        publicId: mediaData.profilepic.publicId,
        url: mediaData.profilepic.url,
      }));
      toast.success("Identity media synchronized");
    } catch (error) {
      toast.error(`Media upload failure: ${mediaType}`);
    } finally {
      event.target.value = "";
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Modify Identity Protocol</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Authorized Node Administration</p>
          </div>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <X size={16} className="mr-2" /> Cancel Operation
          </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-10 bg-white border-slate-200 space-y-10">
          {/* Avatar Terminal */}
          <div className="flex flex-col items-center gap-6 pb-8 border-b border-slate-100">
            <div className="relative">
              <img
                src={imgPreview}
                alt="Profile"
                className="w-32 h-32 rounded-3xl object-cover border-4 border-slate-50 shadow-sm"
              />
              <label className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-blue-600 border-2 border-white flex items-center justify-center text-white cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                <Camera size={18} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "profilepic")}
                />
              </label>
            </div>
            <div className="text-center space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Node Visual Representation</h4>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Authorized Identification Only</p>
            </div>
          </div>

          {/* Logical Data Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <Terminal size={14} /> Core Metadata
                </h3>
                <Input
                    label="Identity Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Biographical Documentation</label>
                    <textarea
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all min-h-[120px] resize-none"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Define node biography..."
                    />
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <ShieldCheck size={14} /> Domain Integrations
                </h3>
                <div className="space-y-4">
                    <div className="relative">
                        <Linkedin className="absolute left-3 top-3 text-slate-400" size={16} />
                        <input
                            type="text"
                            name="linkedin"
                            placeholder="LinkedIn Profile URL"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"
                            value={socialLinks.linkedin}
                            onChange={handleSocialChange}
                        />
                    </div>
                    <div className="relative">
                        <Twitter className="absolute left-3 top-3 text-slate-400" size={16} />
                        <input
                            type="text"
                            name="twitter"
                            placeholder="Twitter Protocol Node"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"
                            value={socialLinks.twitter}
                            onChange={handleSocialChange}
                        />
                    </div>
                    <div className="relative">
                        <Youtube className="absolute left-3 top-3 text-slate-400" size={16} />
                        <input
                            type="text"
                            name="youtube"
                            placeholder="YouTube Content Domain"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"
                            value={socialLinks.youtube}
                            onChange={handleSocialChange}
                        />
                    </div>
                    <div className="relative">
                        <Instagram className="absolute left-3 top-3 text-slate-400" size={16} />
                        <input
                            type="text"
                            name="instagram"
                            placeholder="Instagram Visual Node"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"
                            value={socialLinks.instagram}
                            onChange={handleSocialChange}
                        />
                    </div>
                </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex justify-end">
            <Button
              type="submit"
              isLoading={loading}
              className="px-12"
            >
              <Save size={18} className="mr-2" /> Synchronize Identity
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default EditProfile;
