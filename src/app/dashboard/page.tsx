"use client"

import React from 'react';
import Items from "@/components/items/items";
import Products from "@/components/products/products";
import Orders from "@/components/orders/orders";

export default  function Dashbaord() {
  return (
    <div className="h-full flex p-8 gap-10">
  <div className="flex-1 bg-white text-black rounded-xl p-4 border border-white-800">
 
    <Orders/>
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
