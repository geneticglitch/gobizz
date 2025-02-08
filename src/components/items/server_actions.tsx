"use server"

import  prisma  from '@/lib/prisma';

export const create_item = async (name: string,quantity:number ,unit:string , totalCost: number, userId: string) => {
  try {
    await prisma.item.create({
      data: {
        name,
        totalCost,
        quantity,
        unit,
        userId
      },
    });
    return { status: 200 };
  } catch (error) {
    console.error('An error occurred while creating the item:', error);
    return { status: 400, error: 'An error occurred while creating the item.' };
  }
};

export const get_items = async (userId: string) => {
  try {
    const items = await prisma.item.findMany({
      where: {
        userId,
      },
    });
    return { status: 200, items };
  } catch (error) {
    console.error('An error occurred while getting the items:', error);
    return { status: 400, error: 'An error occurred while getting the items.' };
  }
  
}
export const delete_item = async (itemId: string) => {
  try {
    await prisma.item.delete({
      where: { id: itemId },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting item:", error);
    return { success: false, error: "Failed to delete item." };
  }
}
export const update_item = async (
  itemId: string,
  quantity: number,
  totalCost: number
) => {
  try{
    await prisma.item.update({
      where: {id:itemId},
      data: {
        quantity,
        totalCost,
      },
    });
    return {success:true};
  } catch (error) {
    console.error("Error updating item:", error);
    return {success: false, eroor:"Falied to update item."};
  }
};