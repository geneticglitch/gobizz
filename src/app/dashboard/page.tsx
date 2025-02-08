// page.tsx (Dashboard Page with Two Main Columns)

import React from 'react';
import Component1 from './Component1';
import Component2 from './Component2';

const Dashboard = () => {
  return (
    <div className="h-[93vh]">
      {/* Main Container */}
      <div className="grid grid-cols-12 gap-6 p-6">
        
        {/* Left Column: 50% of the width */}
        <div className="h-[88vh] col-span-6 bg-white rounded-xl p-4 border border-white-800">
          <h2 className="text-black text-xl font-semibold">Left Column Component</h2>
          <p className="text-gray-light mt-4">This is where your component goes on the left side of the page.</p>
        </div>

        {/* Right Column: 50% of the width */}
        <div className="col-span-6 grid grid-rows-2 gap-6">
          
          {/* Top Section in Right Column (Component 1) */}
          <div className="bg-dark-blue bg-opacity-80 rounded-lg p-4">
            <h2 className="text-white text-xl font-semibold">Component 1</h2>
            <p className="text-gray-light mt-4">
              This is the top section of the right column. You can add any content or component here.
            </p>
          </div>

          {/* Bottom Section in Right Column (Component 2) */}
          <div className="bg-dark-blue bg-opacity-80 rounded-lg p-4">
            <h2 className="text-white text-xl font-semibold">Component 2</h2>
            <p className="text-gray-light mt-4">
              This is the bottom section of the right column, where you can display more data or components.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;