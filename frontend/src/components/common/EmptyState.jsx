import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({ icon, title, message, buttonText, buttonLink }) => {
  const IconComponent = icon;

  return (
    <div className="text-center py-12 px-6 bg-white  rounded-lg border-2 border-dashed border-gray-300 ">
      <div className="flex justify-center items-center mb-4">
        <IconComponent className="h-16 w-16 text-gray-400 " />
      </div>
      <h3 className="text-xl font-semibold text-gray-900  mb-2">{title}</h3>
      <p className="text-gray-500  mb-6">{message}</p>
      {buttonText && buttonLink && (
        <Link
          to={buttonLink}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          {buttonText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
