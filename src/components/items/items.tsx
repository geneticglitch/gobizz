"use client"
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { get_items, create_item } from './server_actions';

const Items: React.FC<any> = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [items, setItems] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState('');
  const [totalCost, setTotalCost] = useState<number>(0);

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

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Items</h2>
        <Button onClick={() => setIsModalOpen(true)}>+</Button>
      </div>

      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item.id} className="p-2 border rounded">
            {item.name} - {item.quantity} {item.unit} - ${item.totalCost.toFixed(2)}
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
          <Button color="gray" onClick={() => setIsModalOpen(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Items;