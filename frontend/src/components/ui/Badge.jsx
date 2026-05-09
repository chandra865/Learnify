import React from "react";

const Badge = ({ children, variant = "neutral", className = "", ...props }) => {
  const variants = {
    neutral: "bg-slate-100 text-slate-600 border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
    danger: "bg-rose-50 text-rose-700 border-rose-100",
    primary: "bg-blue-50 text-blue-700 border-blue-100",
  };

  return (
    <span
      className={`
        inline-flex items-center px-1.5 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
