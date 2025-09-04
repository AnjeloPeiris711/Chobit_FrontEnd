import React, { useState, useEffect } from 'react';
import ServeX from '../assets/logo/chobit.png';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative">
        <img
          src={ServeX}
          alt="Loading"
          className="w-45 h-45 object-contain animate-zoomInOut"
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;
