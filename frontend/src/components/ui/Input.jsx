import React from "react";

const Input = ({ label, error, className = "", icon: Icon, ...props }) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-xs font-semibold text-slate-700 ml-0.5">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">
            <Icon size={16} strokeWidth={1.5} />
          </div>
        )}
        <input
          className={`
            w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900
            placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900
            transition-all duration-200 disabled:opacity-50 disabled:bg-slate-50
            ${Icon ? "pl-10" : ""}
            ${error ? "border-rose-500 focus:ring-rose-500 focus:border-rose-500" : ""}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-[10px] font-medium text-rose-500 ml-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
