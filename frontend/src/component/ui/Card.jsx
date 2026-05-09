import React from "react";

const Card = ({ children, className = "", ...props }) => {
  return (
    <div 
      className={`bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
