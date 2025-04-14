import React, { useState } from 'react';

const Tooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm px-4 py-2 rounded shadow-lg max-w-xs">
          {content}
          <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 w-4 h-4 bg-gray-800 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
