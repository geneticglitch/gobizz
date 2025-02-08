"use server"
import  prisma  from "@/lib/prisma";


export const update_product_stock = async (userId: string) => {
  try {
    const products = await prisma.product.findMany({
      where: { userId },
      include: {
        productItems: {
          include: {
            item: true,
          },
        },
      },
    });

    for (const product of products) {
      let possibleStocks: number[] = [];

      for (const productItem of product.productItems) {
        const availableQty = productItem.item.quantity;
        const requiredQty = productItem.quantity; 

        if (availableQty < requiredQty) {
          possibleStocks.push(0);
        } else {
          possibleStocks.push(Math.floor(availableQty / requiredQty));
        }
      }

      const updatedStock = possibleStocks.length > 0 ? Math.min(...possibleStocks) : 0;

      // Update product stock if changed
      if (updatedStock !== product.stock) {
        await prisma.product.update({
          where: { id: product.id },
          data: { stock: updatedStock },
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating product stock:", error);
    return { success: false, error: "Failed to update product stock" };
  }
};

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