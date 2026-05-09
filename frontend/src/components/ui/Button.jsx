import React from "react";
import { motion } from "framer-motion";

const Button = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  isLoading = false, 
  disabled = false,
  ...props 
}) => {
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 border-slate-900 shadow-sm",
    secondary: "bg-white text-slate-900 border-slate-200 hover:bg-slate-50 shadow-sm",
    outline: "bg-transparent text-slate-700 border-slate-200 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 border-transparent",
    danger: "bg-rose-600 text-white hover:bg-rose-700 border-rose-600 shadow-sm",
  };

  const sizes = {
    xs: "px-2 py-1 text-[10px] font-bold uppercase tracking-wider h-7",
    sm: "px-3 py-1.5 text-xs font-semibold h-9",
    md: "px-4 py-2 text-sm font-semibold h-10",
    lg: "px-6 py-3 text-sm font-semibold h-12",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center rounded-md border transition-all duration-200
        active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-1
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {children && <span>Loading...</span>}
        </div>
      ) : children}
    </button>
  );
};

export default Button;
