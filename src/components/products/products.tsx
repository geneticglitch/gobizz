"use client";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { get_products, create_product } from "./server_actions";

const Products: React.FC<any> = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(1);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!userId) return;
      const fetchedProducts = await get_products(userId);
      setProducts(fetchedProducts.products || []);
    };
    fetchProducts();
  }, [userId]);

  const handleCreateProduct = async () => {
    if (!newProductName || price <= 0 || stock < 0) {
      alert("Please enter valid product details.");
      return;
    }

    await create_product(newProductName, description, price, stock, userId!);
    setIsModalOpen(false);

    // Clear input fields
    setNewProductName("");
    setDescription("");
    setPrice(0);
    setStock(1);

    // Fetch updated products
    const fetchedProducts = await get_products(userId!);
    setProducts(fetchedProducts.products || []);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Products</h2>
        <Button onClick={() => setIsModalOpen(true)}>+</Button>
      </div>

      <ul className="mt-4 space-y-2">
        {products.map((product) => (
          <li key={product.id} className="p-2 border rounded">
            {product.name} - {product.stock} in stock - ${product.price.toFixed(2)}
          </li>
        ))}
      </ul>

      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>Add New Product</Modal.Header>
        <Modal.Body>
          <Label>Product Name</Label>
          <TextInput value={newProductName} onChange={(e) => setNewProductName(e.target.value)} required />

          <Label>Description</Label>
          <TextInput value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" />

          <Label>Price</Label>
          <TextInput type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} placeholder="Product price" />

          <Label>Stock</Label>
         
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCreateProduct}>Add</Button>
          <Button color="gray" onClick={() => setIsModalOpen(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Products;
