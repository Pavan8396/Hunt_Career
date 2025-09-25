import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700 min-h-[150px] overflow-hidden relative">
      {/* Skeleton placeholders with shimmering effect */}
      <div className="h-6 bg-gray-200 rounded mb-2 w-3/4 animate-shimmer dark:bg-gray-600"></div>
      <div className="h-4 bg-gray-200 rounded mb-2 w-1/2 animate-shimmer dark:bg-gray-600"></div>
      <div className="h-4 bg-gray-200 rounded mb-2 w-1/3 animate-shimmer dark:bg-gray-600"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 animate-shimmer dark:bg-gray-600"></div>
    </div>
  );
};

export default SkeletonCard;