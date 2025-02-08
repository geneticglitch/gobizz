"use server";

import prisma from '@/lib/prisma';

export const create_product = async (name: string, description: string | null, price: number, stock: number, userId: string, Product_Items:any) => {
  
};

export const get_products = async (userId: string) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        userId,
      },
    });
    return { status: 200, products };
  } catch (error) {
    console.error('An error occurred while getting the products:', error);
    return { status: 400, error: 'An error occurred while getting the products.' };
  }
};
