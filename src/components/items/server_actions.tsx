"use server"

import  prisma  from '@/lib/prisma';

export const create_item = async (name: string, price: number, user_id: number) => {
  try {
    await prisma.create({
      data: {
        name,
        price,
        user_id
      },
    });
    return { status: 200 };
  } catch (error) {
    console.error('An error occurred while creating the item:', error);
    return { status: 400, error: 'An error occurred while creating the item.' };
  }
};