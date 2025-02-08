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

  useEffect(() => {
    fetchItems();
  }
  , []);

 

  const handleCreateProduct = async () => {
    if (!newProductName || price <= 0) {
      alert("Please enter valid product details.");
      return;
    }

    if (additionalItems.length === 0) {
      alert("Please add at least one required item.");
      return;
    }

    const validItems = additionalItems.filter(
      item => item.itemId && item.itemId !== "" && item.quantity > 0
    ).map(item => ({
      itemId: item.itemId,
      quantity: item.quantity
    }));

    try {
      const response = await create_product(
        newProductName,
        description,
        price,
        userId!,
        validItems
      );

      if (!response.success) {
        alert(response.error);
        return;
      }

      setIsModalOpen(false);

      setNewProductName("");
      setDescription("");
      setPrice(0);
      setAdditionalItems([]);

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
          <li key={product.id} className="p-4 border rounded shadow-sm bg-white">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-lg">{product.name}</div>
                <div className="text-sm mt-1">
                  <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Stock: {product.stock}
                  </span>
                  <span className="mx-2">|</span>
                  <span>Price: ${product.price.toFixed(2)}</span>
                </div>
                {product.description && (
                  <div className="text-sm text-gray-500 mt-1">{product.description}</div>
                )}
              </div>
            </div>
            
            {product.productItems && product.productItems.length > 0 && (
              <div className="mt-3 border-t pt-2">
                <div className="text-sm font-medium">Required Materials per Product:</div>
                <ul className="text-sm space-y-1 mt-1">
                  {product.productItems.map((pi: any) => (
                    <li key={pi.id} className="flex items-center justify-between">
                      <span>{pi.item.name} - {pi.quantity} units</span>
                      <span className={`${pi.item.quantity >= pi.quantity ? 'text-green-600' : 'text-red-600'}`}>
                        Available: {pi.item.quantity} units
                      </span>
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
              <Label>Required Materials</Label>
              <div className="space-y-3">
                {additionalItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <select
                      value={item.itemId}
                      onChange={(e) => handleAdditionalItemChange(index, "itemId", e.target.value)}
                      className="border-2 p-2 rounded-lg flex-1 text-black"
                    >
                      <option value="">Select Material</option>
                      {items.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.name} ({i.quantity} {i.unit} available)
                        </option>
                      ))}
                    </select>
                    <TextInput
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleAdditionalItemChange(index, "quantity", parseInt(e.target.value))}
                      placeholder="Amount needed"
                      className="flex-1"
                    />
                    <Button color="gray" onClick={() => removeAdditionalItem(index)}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <Button className="mt-3" onClick={addAdditionalItem}>
                Add Material
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