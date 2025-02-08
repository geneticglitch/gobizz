"use client";
import React from 'react';
import { useSession } from "next-auth/react";

const Items: React.FC<any> = () => {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    console.log(session?.user?.id);
  return (
    <div>
      <h1>Items List</h1>
      
    </div>
  );
};

export default Items;
