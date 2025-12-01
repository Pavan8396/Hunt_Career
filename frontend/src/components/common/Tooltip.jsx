import React from 'react';

const Tooltip = ({ text, children }) => {
  return (
    <div className="relative group flex items-center">
      {children}
      <div className="absolute left-full ml-4 w-auto min-w-max p-2 bg-gray-900 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-0 group-hover:scale-100 origin-left whitespace-nowrap">
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
