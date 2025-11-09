import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center py-16">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20"></div>
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-purple-400 border-r-pink-400 absolute top-0 left-0"></div>
      </div>
      <p className="mt-6 text-white/80 text-lg font-medium animate-pulse">
        Tracing transaction trail...
      </p>
      <p className="mt-2 text-white/60 text-sm">
        This may take a few moments
      </p>
    </div>
  );
};

export default Loader;

