"use server"
import  prisma  from "@/lib/prisma";

export const create_product = async (
  name: string,
  description: string | null,
  price: number,
  userId: string,
  Product_Items: { itemId: string; quantity: number }[]
) => {
  try {
    const items = await Promise.all(
      Product_Items.map(async (pi) => {
        const item = await prisma.item.findUnique({
          where: { id: pi.itemId },
          select: { 
            id: true,
            quantity: true,
            name: true
          }
        });
        return {
          ...item,
          requiredQuantity: pi.quantity
        };
      })
    );

    let initialStock = 0;
    
    const hasEnoughMaterials = items.every(item => {
      if (!item) return false;
      return item.quantity! >= item.requiredQuantity;
    });

    if (hasEnoughMaterials) {
      const possibleStocks = items.map(item => {
        if (!item) return 0;
        return Math.floor(item.quantity! / item.requiredQuantity);
      });
      initialStock = Math.min(...possibleStocks);
    }

    const result = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock: initialStock,
        userId,
        productItems: {
          create: Product_Items.map(item => ({
            quantity: item.quantity,
            item: {
              connect: {
                id: item.itemId
              }
            }
          }))
        }
      },
      include: {
        productItems: {
          include: {
            item: true
          }
        }
      }
    });

    return {
      success: true,
      product: result
    };
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      success: false,
      error: "Failed to create product"
    };
  }
};

export const get_products = async (userId: string) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        userId
      },
      include: {
        productItems: {
          include: {
            item: true
          }
        }
      }
    });
    return { status: 200, products };
  } catch (error) {
    console.error("An error occurred while getting the products:", error);
    return { status: 400, error: "An error occurred while getting the products." };
  }
};