import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, Outlet, useLocation, Link } from "react-router-dom";
import { 
  User, 
  BookOpen, 
  PlusCircle, 
  LogOut, 
  DollarSign, 
  ShoppingCart, 
  Receipt,
  Layout,
  Terminal,
  ShieldCheck,
  ChevronRight,
  Settings,
  Bell
} from "lucide-react";
import logo from "../assets/logo.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((state) => state.user.userData);
  const role = userData?.role;

  const sidebarItems = role === "student"
    ? [
        { title: "Identity Hub", path: "/dashboard/profile", icon: <User size={18} /> },
        { title: "Active Nodes", path: "/dashboard/enrolled", icon: <BookOpen size={18} /> },
        { title: "Cart Dispatch", path: "/dashboard/cart", icon: <ShoppingCart size={18} /> },
        { title: "Protocol Logs", path: "/dashboard/order", icon: <Receipt size={18} /> },
      ]
    : [
        { title: "Expert Hub", path: "/dashboard/profile", icon: <User size={18} /> },
        { title: "Created Nodes", path: "/dashboard/created", icon: <BookOpen size={18} /> },
        { title: "Deploy Node", path: "/dashboard/create", icon: <PlusCircle size={18} /> },
        { title: "Earning Sync", path: "/dashboard/Earning", icon: <DollarSign size={18} /> },
      ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      {/* Industrial Command Sidebar */}
      <aside className="w-72 bg-slate-900 text-slate-400 border-r border-white/5 flex flex-col fixed inset-y-0 z-50">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
           <Link to="/" className="flex items-center gap-3 group">
              <img src={logo} alt="LMS" className="h-8 w-8 transition-transform group-hover:scale-110" />
              <span className="text-xl font-black tracking-tighter text-white">Learnify</span>
           </Link>
           <div className="p-1.5 rounded-lg bg-slate-800 border border-white/5 text-slate-500">
              <Terminal size={14} />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto py-8">
           <div className="px-6 mb-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-4">Command Center</p>
              <nav className="space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.title}
                    onClick={() => navigate(item.path)}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all group
                      ${isActive(item.path) 
                        ? "bg-blue-600 text-white shadow-xl shadow-blue-900/40" 
                        : "text-slate-500 hover:bg-slate-800/50 hover:text-white"}
                    `}
                  >
                    <div className="flex items-center gap-3">
                       <span className={`transition-colors ${isActive(item.path) ? "text-white" : "text-slate-600 group-hover:text-blue-400"}`}>
                         {item.icon}
                       </span>
                       {item.title}
                    </div>
                    {isActive(item.path) && <ChevronRight size={14} className="opacity-60" />}
                  </button>
                ))}
              </nav>
           </div>
           
           <div className="px-6 pt-8 border-t border-white/5 mt-8">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-4">Identity Matrix</p>
              <div className="p-4 rounded-3xl bg-slate-800/50 border border-white/5 flex items-center gap-4">
                 <img 
                   src={userData?.profilePicture?.url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                   alt="Avatar" 
                   className="w-10 h-10 rounded-2xl object-cover grayscale-[0.5]"
                 />
                 <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-white truncate tracking-tight">{userData?.name}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{role}</p>
                 </div>
                 <button onClick={() => navigate("/logout")} className="p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all">
                    <LogOut size={16} />
                 </button>
              </div>
           </div>
        </div>

        <div className="p-8 border-t border-white/5 bg-slate-950/30">
           <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/5 bg-slate-900 text-[10px] font-black uppercase tracking-widest text-slate-600">
              <ShieldCheck size={14} className="text-blue-600" />
              Protocol v4.0.0
           </div>
        </div>
      </aside>

      {/* Primary Operation Space */}
      <main className="flex-1 ml-72 min-h-screen">
        <header className="h-20 px-8 flex items-center justify-between bg-white border-b border-slate-200 sticky top-0 z-40">
           <div className="flex items-center gap-4">
              <Layout size={20} className="text-slate-400" />
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Operation Terminal</h2>
           </div>
           
           <div className="flex items-center gap-4">
              <button className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl transition-all relative">
                 <Bell size={20} />
                 <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white" />
              </button>
              <button className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl transition-all" onClick={() => navigate("/dashboard/settings")}>
                 <Settings size={20} />
              </button>
           </div>
        </header>
        
        <div className="p-8">
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
