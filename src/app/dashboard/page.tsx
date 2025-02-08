"use client"

import React from 'react';

const Dashboard = () => {
    
  return (
    <div className="h-full flex p-8 gap-10">
  <div className="flex-1 bg-white text-black rounded-xl p-4 border border-white-800">
    <h2 className="text-2xl font-semibold">Orders Tracking</h2>
    <p className="text-gray-light mt-4">
      This is where your component goes on the left side of the page.
    </p>
  </div>

  <div className="flex-1 grid grid-rows-2 gap-6 ">
    <div className="bg-white text-black rounded-lg p-4">
      <h2 className="text-2xl font-semibold">Products</h2>
      <p className="text-gray-light mt-4">
        This is the top section of the right column. You can add any content or component here.
      </p>
    </div>

    <div className="bg-white text-black rounded-lg p-4">
      <h2 className="text-2xl font-semibold">Items</h2>
      <p className="text-gray-light mt-4">
        This is the bottom section of the right column, where you can display more data or components.
      </p>
    </div>
  </div>
</div>
  );
};

export default Dashboard;