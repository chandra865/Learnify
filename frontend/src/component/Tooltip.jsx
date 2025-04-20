// Tooltip.jsx
import { useState } from "react";

const Tooltip = ({ content, children }) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute bottom-full border-1 mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm px-5 py-2 rounded shadow z-50 whitespace-nowrap">
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
