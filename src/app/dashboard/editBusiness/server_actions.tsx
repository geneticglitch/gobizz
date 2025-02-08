"use server";

import prisma from '@/lib/prisma';

export const create_buisness = async (business_name: string | null, business_description: string | null, business_address: string, business_phonenumber: string, business_tags: String[]) => {
  try {
    await prisma.user.create({
      data: {
        business_name,
        business_description,
        business_address,
        business_phonenumber,
        business_tags,
      },
    });
    return { status: 200 };
  } catch (error) {
    console.error('An error occurred while creating the product:', error);
    return { status: 400, error: 'An error occurred while creating the product.' };
  }
};

export const get_buisness = async (userId: string) => {
  try {
    const user = await prisma.user.findMany({
      where: {
        userId,
      },
    });
    return { status: 200, user };
  } catch (error) {
    console.error('An error occurred while getting the products:', error);
    return { status: 400, error: 'An error occurred while getting the products.' };
  }
};
