import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-apex-red/20 border-t-apex-red rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-apex-gold rounded-full animate-spin" style={{ animationDelay: '-0.5s' }}></div>
      </div>
      <p className="mt-4 text-gray-600 font-medium">Loading analytics data...</p>
    </div>
  );
};

export default LoadingSpinner;