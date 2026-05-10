import React from "react";

const SkeletonLoader = ({ type = "card", count = 3 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case "card":
        return (
          <div className="animate-pulse flex space-x-4 p-4 border border-gray-700 rounded-lg bg-gray-800 mb-4">
            <div className="bg-gray-700 h-24 w-40 rounded"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        );
      case "list":
        return (
          <div className="animate-pulse space-y-4">
            {[...Array(count)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-700 rounded w-full"></div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {[...Array(count)].map((_, i) => (
        <React.Fragment key={i}>{renderSkeleton()}</React.Fragment>
      ))}
    </div>
  );
};

export default SkeletonLoader;
