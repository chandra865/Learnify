import React from "react";

const Badge = ({ children, variant = "secondary", className = "", ...props }) => {
  const variants = {
    primary: "bg-blue-50 text-blue-700 border-blue-100",
    secondary: "bg-slate-100 text-slate-600 border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
    danger: "bg-rose-50 text-rose-700 border-rose-100",
    outline: "bg-transparent border-slate-200 text-slate-500",
  };

  return (
    <span 
      className={`
        inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border
        ${variants[variant]} ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
