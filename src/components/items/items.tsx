"use client"
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { get_items, create_item, delete_item  } from './server_actions';

const Items: React.FC<any> = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [items, setItems] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState('');
  const [totalCost, setTotalCost] = useState<number>(0);
  const [editingitem, setEditingItem] = useState<{ id: string; quantity: Number; totalCost: number} | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      if (!userId) return;
      const fetchedItems = await get_items(userId);
      setItems(fetchedItems.items || []);
    };
    fetchItems();
  }, [userId]);

  const handleCreateItem = async () => {
    if (!newItemName || !unit || totalCost <= 0) {
      alert("Please enter valid item details.");
      return;
    }

    await create_item(newItemName, quantity, unit, totalCost, userId!);
    setIsModalOpen(false);
    
    // Clear input fields
    setNewItemName('');
    setQuantity(1);
    setUnit('');
    setTotalCost(0);

    // Fetch updated items
    const fetchedItems = await get_items(userId!);
    setItems(fetchedItems.items || []);
  };
  const handleRemoveItem = async (itemId: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await delete_item(itemId);
        if (!response.success) {
          alert(response.error);
          return;
        }
        setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
        const fetchedItems = await get_items(userId!);
        setItems(fetchedItems.items || []);
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete item because it is currently being used in a product.");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Items</h2>
        <Button onClick={() => setIsModalOpen(true)}>+</Button>
      </div>

      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item.id} className="p-2 border rounded">
            <div className="grid grid-cols-4 gap-4 items-center ">
              <div className="flex items-center justify-center">
                <h2>{item.name}</h2>
              </div>

              <div className="flex items-center justify-center">
                <h2>{item.quantity} {item.unit}</h2>
              </div>
              <div className="flex items-center justify-center">
              <h2>${item.totalCost.toFixed(2)}</h2>
              </div>

              <div className="flex items-center justify-end space-x-2">
                  <Button color="red" onClick={() => handleRemoveItem(item.id)}>
                    Remove
                  </Button>
            <button className="text-blue-500 hover:text-blue-700">
             <i className="fas fa-edit"></i>
            </button>
          </div>

              <div className="flex items-center justify-end space-x-2">
                <button className="text-blue-500 hover:text-blue-700">
                  <i className="fas fa-edit"></i>
                </button>
                <button className="text-red-500 hover:text-red-700">
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>Add New Item</Modal.Header>
        <Modal.Body>
          <Label>
            Item Name
          </Label>
          <TextInput
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            required
          />
          <Label>
            Quanitity
          </Label>
          <TextInput
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseFloat(e.target.value))}
            placeholder="Quantity"
          />
          <Label>
            Quanitity Unit
          </Label>
          <TextInput
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="Unit (e.g., kg, pcs, liter)"
          />
           <Label>
            Price
          </Label>
          <TextInput
            type="number"
            value={totalCost}
            onChange={(e) => setTotalCost(parseFloat(e.target.value))}
            placeholder="Total Cost"
          />
        </Modal.Body>
        <Modal.Footer>
        <Button onClick={handleCreateItem}>Add</Button>
        <Button color="grey" onClick={() => setIsModalOpen(false)}>
          Cancel
          </Button>
        </Modal.Footer>
        
        
      </Modal>
    </div>
  );
};

export default Items;