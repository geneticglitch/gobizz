"use server"
import prisma from "@/lib/prisma";

export const create_order = async (
  customer: string,
  userId: string,
  Order_Products: { productId: string; quantity: number }[]
) => {
  try {
    
    let totalBill = 0;
    const productChecks = await Promise.all(
      Order_Products.map(async (op) => {
        const product = await prisma.product.findUnique({
          where: { id: op.productId },
          select: {
            id: true,
            price: true,
            stock: true
          }
        });
        
        if (!product) return null;
        
        totalBill += product.price * op.quantity;
        return {
          ...product,
          requestedQuantity: op.quantity,
          hasStock: product.stock >= op.quantity
        };
      })
    );

    // Check if all products have sufficient stock
    const insufficientStock = productChecks.some(
      check => !check || !check.hasStock
    );

    if (insufficientStock) {
      return {
        success: false,
        error: "One or more products have insufficient stock"
      };
    }

    // Create order and update product stock
    const result = await prisma.$transaction(async (tx) => {
      // Create the order
      const order = await tx.order.create({
        data: {
          customer,
          userId,
          status: "PENDING",
          bill: totalBill,
          orderProducts: {
            create: Order_Products.map(op => ({
              quantity: op.quantity,
              product: {
                connect: {
                  id: op.productId
                }
              }
            }))
          }
        },
        include: {
          orderProducts: {
            include: {
              product: true
            }
          }
        }
      });

      // Update product stock
      await Promise.all(
        Order_Products.map(op =>
          tx.product.update({
            where: { id: op.productId },
            data: {
              stock: {
                decrement: op.quantity
              }
            }
          })
        )
      );

      return order;
    });

    return {
      success: true,
      order: result
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false,
      error: "Failed to create order"
    };
  }
};

export const get_orders = async (userId: string) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId
      },
      include: {
        orderProducts: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return { status: 200, orders };
  } catch (error) {
    console.error("An error occurred while getting the orders:", error);
    return { status: 400, error: "An error occurred while getting the orders." };
  }
};

type OrderStatus = 'PENDING' | 'INPROGRESS' | 'COMPLETED' | 'DELIVERING' | 'DELIVERED' | 'CANCELED';

export const update_order_status = async (
  orderId: string,
  status: OrderStatus
) => {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: { set: status as OrderStatus } },
      include: {
        orderProducts: {
          include: {
            product: true
          }
        }
      }
    });
    return { success: true, order };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "Failed to update order status" };
  }
};