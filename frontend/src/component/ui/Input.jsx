import React from "react";

const Input = ({ label, icon, className = "", error, ...props }) => {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all
            ${icon ? "pl-10" : ""}
            ${error ? "border-rose-300 ring-rose-100" : ""}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">{error}</p>
      )}
    </div>
  );
};

export default Input;
