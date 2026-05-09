import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, Outlet, useLocation, Link } from "react-router-dom";
import {
  User,
  BookOpen,
  Layout,
  PlusCircle,
  LogOut,
  DollarSign,
  ShoppingCart,
  Receipt,
  Settings,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import logo from "../assets/logo.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = useSelector((state) => state.user.userData?.role);
  const user = useSelector((state) => state.user.userData);

  const sidebarItems = role === "student"
    ? [
        { title: "Profile Node", path: "/dashboard/profile", icon: <User size={18} /> },
        { title: "Active Enrolments", path: "/dashboard/enrolled", icon: <BookOpen size={18} /> },
        { title: "Acquisition Cart", path: "/dashboard/cart", icon: <ShoppingCart size={18} /> },
        { title: "License Orders", path: "/dashboard/order", icon: <Receipt size={18} /> },
        { title: "Termination", path: "/logout", icon: <LogOut size={18} /> },
      ]
    : [
        { title: "Instructor Profile", path: "/dashboard/profile", icon: <User size={18} /> },
        { title: "Active Curriculums", path: "/dashboard/created", icon: <BookOpen size={18} /> },
        { title: "Architect Course", path: "/dashboard/create", icon: <PlusCircle size={18} /> },
        { title: "Capital Yield", path: "/dashboard/Earning", icon: <DollarSign size={18} /> },
        { title: "Termination", path: "/logout", icon: <LogOut size={18} /> },
      ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-[#fafafa] overflow-hidden">
      {/* Strategic Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="h-16 px-6 border-b border-slate-100 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logo} alt="Learnify" className="h-7 w-7" />
            <span className="text-sm font-black tracking-tight text-slate-900">Learnify</span>
          </Link>
          <div className="h-4 w-[1px] bg-slate-200" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Terminal</span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
           <div className="space-y-1">
              <h3 className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Operations Matrix</h3>
              <nav className="space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.title}
                    onClick={() => navigate(item.path)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold transition-all group
                      ${isActive(item.path) 
                        ? "bg-slate-900 text-white shadow-lg shadow-slate-200/50" 
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`${isActive(item.path) ? "text-blue-400" : "text-slate-400 group-hover:text-slate-900"} transition-colors`}>
                        {item.icon}
                      </span>
                      {item.title}
                    </div>
                    {isActive(item.path) && <ChevronRight size={14} className="text-blue-400" />}
                  </button>
                ))}
              </nav>
           </div>
           
           <div className="pt-8 border-t border-slate-100">
               <h3 className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Node Health</h3>
               <div className="px-3 space-y-4">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocol Status</span>
                     <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                     </div>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 space-y-2">
                     <div className="flex items-center gap-2 text-blue-700">
                        <ShieldCheck size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Verified Account</span>
                     </div>
                     <p className="text-[10px] font-medium text-blue-600/80 leading-relaxed">
                        Authorized for full node synchronization and module architecting.
                     </p>
                  </div>
               </div>
           </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 px-2">
                <img 
                    src={user?.profilePicture?.url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                    alt="User" 
                    className="w-8 h-8 rounded-full border border-slate-200" 
                />
                <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-900 truncate">{user?.name}</span>
                    <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest truncate">{user?.role} Protocol</span>
                </div>
            </div>
        </div>
      </aside>

      {/* Primary Control Chamber */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.03),transparent)] pointer-events-none" />
        <div className="p-8 lg:p-12 relative z-10 w-full max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
