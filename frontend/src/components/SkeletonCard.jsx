import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700 min-h-[150px] overflow-hidden relative">
      {/* Skeleton placeholders with shimmering effect */}
      <div className="h-6 bg-gray-200 rounded mb-2 w-3/4 animate-shimmer dark:bg-gray-600"></div>
      <div className="h-4 bg-gray-200 rounded mb-2 w-1/2 animate-shimmer dark:bg-gray-600"></div>
      <div className="h-4 bg-gray-200 rounded mb-2 w-1/3 animate-shimmer dark:bg-gray-600"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 animate-shimmer dark:bg-gray-600"></div>
      {/* Custom shimmering overlay */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200%;
          }
          100% {
            background-position: 200%;
          }
        }
        .animate-shimmer {
          background: linear-gradient(
            90deg,
            #e5e7eb 25%,
            #f3f4f6 50%,
            #e5e7eb 75%
          ) dark:linear-gradient(
            90deg,
            #4b5563 25%,
            #6b7280 50%,
            #4b5563 75%
          );
          background-size: 200%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default SkeletonCard;