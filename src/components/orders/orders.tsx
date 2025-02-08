"use client";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { get_products } from "../products/server_actions";
import { create_order, get_orders , update_order_status } from "./server_actions";
import { OrderStatus } from "@prisma/client";

const Orders: React.FC<any> = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [orderProducts, setOrderProducts] = useState<{ productId: string; productName: string; quantity: number }[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) return;
      const fetchedOrders = await get_orders(userId);
      setOrders(fetchedOrders.orders || []);
      fetchProducts();
    };
    fetchOrders();
  }, [userId]);

  const fetchProducts = async () => {
    if (!userId) return;
    const fetchedProducts = await get_products(userId);
    setProducts(fetchedProducts.products || []);
  };

  const handleCreateOrder = async () => {
    if (!customerName) {
      alert("Please enter customer name.");
      return;
    }

    if (orderProducts.length === 0) {
      alert("Please add at least one product to the order.");
      return;
    }

    const validProducts = orderProducts.filter(
      product => product.productId && product.productId !== "" && product.quantity > 0
    ).map(product => ({
      productId: product.productId,
      quantity: product.quantity
    }));

    try {
      const response = await create_order(
        customerName,
        userId!,
        validProducts
      );

      if (!response.success) {
        alert(response.error);
        return;
      }

      setIsModalOpen(false);
      setCustomerName("");
      setOrderProducts([]);

      const fetchedOrders = await get_orders(userId!);
      setOrders(fetchedOrders.orders || []);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  const handleOrderProductChange = (index: number, field: string, value: string | number) => {
    const updatedProducts = [...orderProducts];
    if (field === "productId") {
      const selectedProduct = products.find(product => product.id === value);
      updatedProducts[index] = {
        ...updatedProducts[index],
        productId: value as string,
        productName: selectedProduct ? selectedProduct.name : ""
      };
    } else if (field === "quantity") {
      updatedProducts[index] = { ...updatedProducts[index], quantity: value as number };
    }
    setOrderProducts(updatedProducts);
    
  };
  
  type OrderStatus = "PENDING" | "INPROGRESS" | "COMPLETED" | "DELIVERING" | "DELIVERED" | "CANCELED";

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await update_order_status(orderId, status);
      const fetchedOrders = await get_orders(userId!);
      setOrders(fetchedOrders.orders || []);
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");
    }
  }

  const removeOrderProduct = (index: number) => {
    setOrderProducts(orderProducts.filter((_, i) => i !== index));
  };

  const addOrderProduct = () => {
    setOrderProducts([...orderProducts, { productId: "", productName: "", quantity: 0 }]);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      INPROGRESS: "bg-blue-100 text-blue-800",
      COMPLETED: "bg-green-100 text-green-800",
      DELIVERING: "bg-purple-100 text-purple-800",
      DELIVERED: "bg-gray-100 text-gray-800",
      CANCELED: "bg-red-100 text-red-800"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Orders</h2>
        <Button onClick={() => setIsModalOpen(true)}>+</Button>
      </div>

      <ul className="mt-4 space-y-2">
        {orders.map((order) => (
          <li key={order.id} className="p-4 border rounded shadow-sm bg-white">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-lg">{order.customer}</div>
                <div className="text-sm mt-1">

                    <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                    className={`px-2 py-1 rounded ${getStatusColor(order.status)}`}
                    >
                    <option value="PENDING">PENDING</option>
                    <option value="INPROGRESS">INPROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="DELIVERING">DELIVERING</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELED">CANCELED</option>
                    </select>
                  <span className="mx-2">|</span>
                  <span>Total: ${order.bill.toFixed(2)}</span>
                  <span className="mx-2">|</span>
                  <span>Created: {new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            {order.orderProducts && order.orderProducts.length > 0 && (
              <div className="mt-3 border-t pt-2">
                <div className="text-sm font-medium">Products:</div>
                <ul className="text-sm space-y-1 mt-1">
                  {order.orderProducts.map((op: any) => (
                    <li key={op.id} className="flex items-center justify-between">
                      <span>{op.product.name} - {op.quantity} units</span>
                      <span>${(op.product.price * op.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>

      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>Create New Order</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <Label>Customer Name</Label>
              <TextInput 
                value={customerName} 
                onChange={(e) => setCustomerName(e.target.value)} 
                required 
              />
            </div>

            <div>
              <Label>Products</Label>
              <div className="space-y-3">
                {orderProducts.map((product, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <select
                      value={product.productId}
                      onChange={(e) => handleOrderProductChange(index, "productId", e.target.value)}
                      className="border-2 p-2 rounded-lg flex-1 text-black"
                    >
                      <option value="">Select Product</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                          {p.name} ({p.stock} available) - ${p.price.toFixed(2)}
                        </option>
                      ))}
                    </select>
                    <TextInput
                      type="number"
                      value={product.quantity}
                      onChange={(e) => handleOrderProductChange(index, "quantity", parseInt(e.target.value))}
                      placeholder="Quantity"
                      className="flex-1"
                    />
                    <Button color="gray" onClick={() => removeOrderProduct(index)}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <Button className="mt-3" onClick={addOrderProduct}>
                Add Product
              </Button>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCreateOrder}>Create Order</Button>
          <Button color="gray" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Orders;