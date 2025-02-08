"use client"

import React from 'react';
import Items from "@/components/items/items";
import Products from "@/components/products/products";

export default  function Dashbaord() {
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
 
        <Products />
    </div>

    <div className="bg-white text-black rounded-lg p-4">
     
        <Items  />
      
    </div>
  </div>
</div>
  );
};
