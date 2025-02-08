"use client";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { get_products, create_product } from "./server_actions";
import { get_items } from "../items/server_actions";

const Products: React.FC<any> = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(1);
  const [additionalItems, setAdditionalItems] = useState<{ itemId: string; itemName: string; quantity: number }[]>([]);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!userId) return;
      const fetchedProducts = await get_products(userId);
      setProducts(fetchedProducts.products || []);
      fetchItems();
    };
    fetchProducts();
  }, [userId]);

  const fetchItems = async () => {
    if (!userId) return;
    const fetchedItems = await get_items(userId);
    setItems(fetchedItems.items || []);
  };

  const handleCreateProduct = async () => {
    if (!newProductName || price <= 0 || stock < 0) {
      alert("Please enter valid product details.");
      return;
    }

    // Filter out invalid items (where either id or quantity is missing/invalid)
    const validItems = additionalItems.filter(
      item => item.itemId && item.itemId !== "" && item.quantity > 0
    ).map(item => ({
      itemId: item.itemId,
      quantity: item.quantity
    }));

    try {
      await create_product(
        newProductName,
        description,
        price,
        stock,
        userId!,
        validItems // Pass the items array to your server action
      );
      
      setIsModalOpen(false);

      // Clear input fields
      setNewProductName("");
      setDescription("");
      setPrice(0);
      setStock(1);
      setAdditionalItems([]);

      // Fetch updated products
      const fetchedProducts = await get_products(userId!);
      setProducts(fetchedProducts.products || []);
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product. Please try again.");
    }
  };

  const handleAdditionalItemChange = (index: number, field: string, value: string | number) => {
    const updatedItems = [...additionalItems];
    if (field === "itemId") {
      const selectedItem = items.find(item => item.id === value);
      updatedItems[index] = {
        ...updatedItems[index],
        itemId: value as string,
        itemName: selectedItem ? selectedItem.name : ""
      };
    } else if (field === "quantity") {
      updatedItems[index] = { ...updatedItems[index], quantity: value as number };
    }
    setAdditionalItems(updatedItems);
  };

  const removeAdditionalItem = (index: number) => {
    setAdditionalItems(additionalItems.filter((_, i) => i !== index));
  };

  const addAdditionalItem = () => {
    setAdditionalItems([...additionalItems, { itemId: "", itemName: "", quantity: 0 }]);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Products</h2>
        <Button onClick={() => setIsModalOpen(true)}>+</Button>
      </div>

      <ul className="mt-4 space-y-2">
        {products.map((product) => (
          <li key={product.id} className="p-4 border rounded shadow-sm">
            <div className="font-medium">{product.name}</div>
            <div className="text-sm text-black">
              Stock: {product.stock} | Price: ${product.price.toFixed(2)}
            </div>
            {product.description && (
              <div className="text-sm text-gray-500 mt-1">{product.description}</div>
            )}
            {product.productItems && product.productItems.length > 0 && (
              <div className="mt-2">
                <div className="text-sm font-medium">Required Items:</div>
                <ul className="text-sm text-gray-600">
                  {product.productItems.map((pi: any) => (
                    <li key={pi.id}>
                      <span className="font-medium">{pi.item.name}</span> ({pi.item.id}): {pi.quantity} {pi.item.unit}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>

      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>Add New Product</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <Label>Product Name</Label>
              <TextInput 
                value={newProductName} 
                onChange={(e) => setNewProductName(e.target.value)} 
                required 
              />
            </div>

            <div>
              <Label>Description</Label>
              <TextInput 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Optional" 
              />
            </div>

            <div>
              <Label>Price</Label>
              <TextInput 
                type="number" 
                value={price} 
                onChange={(e) => setPrice(parseFloat(e.target.value))} 
                placeholder="Product price" 
              />
            </div>

            <div>
              <Label>Stock</Label>
              <TextInput 
                type="number" 
                value={stock} 
                onChange={(e) => setStock(parseInt(e.target.value))} 
                placeholder="Product stock" 
              />
            </div>

            <div>
              <Label>Required Items</Label>
              <div className="space-y-3">
                {additionalItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <select
                      value={item.itemId}
                      onChange={(e) => handleAdditionalItemChange(index, "itemId", e.target.value)}
                      className="border-2 p-2 rounded-lg flex-1 text-black"
                    >
                      <option value="">Select Item</option>
                      {items.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.name}
                        </option>
                      ))}
                    </select>
                    <TextInput
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleAdditionalItemChange(index, "quantity", parseInt(e.target.value))}
                      placeholder="Quantity"
                      className="flex-1"
                    />
                    <Button color="gray" onClick={() => removeAdditionalItem(index)}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <Button className="mt-3" onClick={addAdditionalItem}>
                Add Required Item
              </Button>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCreateProduct}>Create Product</Button>
          <Button color="gray" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Products;