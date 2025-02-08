"use server"

import  prisma  from '@/lib/prisma';

export const create_item = async (name: string,quantity:number ,unit:string , totalCost: number, user_id: number) => {
  try {
    await prisma.item.create({
      data: {
        name,
        totalCost,
        quantity,
        unit,
        user_id
      },
    });
    return { status: 200 };
  } catch (error) {
    console.error('An error occurred while creating the item:', error);
    return { status: 400, error: 'An error occurred while creating the item.' };
  }
};