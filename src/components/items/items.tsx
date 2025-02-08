"use client";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { get_items, create_item, delete_item, update_item } from "./server_actions";

const Items: React.FC<any> = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [items, setItems] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState("");
  const [totalCost, setTotalCost] = useState<number>(0);
  const [editingItem, setEditingItem] = useState<{
    id: string;
    name: string;
    quantity: number;
    unit: string;
    totalCost: number;
  } | null>(null);

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
    setNewItemName("");
    setQuantity(1);
    setUnit("");
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
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete item because it is currently being used in a product.");
      }
    }
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setIsEditModalOpen(true);

  };

  const handleSaveEdit = async () => {
    if (
      !editingItem ||
      !editingItem.name ||
      editingItem.quantity <= 0 ||
      !editingItem.unit ||
      editingItem.totalCost <= 0
    ) {
      alert("Please enter valid item details.");
      return;
    }

    try {
      const response = await update_item(
        editingItem.id,
        editingItem.name,
        editingItem.quantity,
        editingItem.unit,
        editingItem.totalCost
      );
      if (!response.success) {
        alert(response.error);
        return;
      }

      // Update the state with the edited item
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                name: editingItem.name,
                quantity: editingItem.quantity,
                unit: editingItem.unit,
                totalCost: editingItem.totalCost,
              }
            : item
        )
      );

      // Close the edit modal
      setIsEditModalOpen(false);
      setEditingItem(null);
      window.location.reload();
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update item. Please try again.");
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
            <div className="grid grid-cols-4 gap-4 items-center">
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
                <Button color="blue" onClick={() => handleEditItem(item)}>
                  Edit
                </Button>
                <Button color="red" onClick={() => handleRemoveItem(item.id)}>
                  Remove
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Add New Item Modal */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>Add New Item</Modal.Header>
        <Modal.Body>
          <Label>Item Name</Label>
          <TextInput
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            required
          />
          <Label>Quantity</Label>
          <TextInput
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseFloat(e.target.value))}
            placeholder="Quantity"
          />
          <Label>Quantity Unit</Label>
          <TextInput
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="Unit (e.g., kg, pcs, liter)"
          />
          <Label>Price</Label>
          <TextInput
            type="number"
            value={totalCost}
            onChange={(e) => setTotalCost(parseFloat(e.target.value))}
            placeholder="Total Cost"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCreateItem}>Add</Button>
          <Button color="gray" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Item Modal */}
      <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Modal.Header>Edit Item</Modal.Header>
        <Modal.Body>
          <Label>Item Name</Label>
          <TextInput
            value={editingItem?.name || ""}
            onChange={(e) =>
              setEditingItem({ ...editingItem!, name: e.target.value })
            }
            required
          />
          <Label>Quantity</Label>
          <TextInput
            type="number"
            value={editingItem?.quantity || 0}
            onChange={(e) =>
              setEditingItem({ ...editingItem!, quantity: parseFloat(e.target.value) })
            }
            placeholder="Quantity"
          />
          <Label>Quantity Unit</Label>
          <TextInput
            value={editingItem?.unit || ""}
            onChange={(e) =>
              setEditingItem({ ...editingItem!, unit: e.target.value })
            }
            placeholder="Unit (e.g., kg, pcs, liter)"
          />
          <Label>Price</Label>
          <TextInput
            type="number"
            value={editingItem?.totalCost || 0}
            onChange={(e) =>
              setEditingItem({ ...editingItem!, totalCost: parseFloat(e.target.value) })
            }
            placeholder="Total Cost"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSaveEdit}>Save</Button>
          <Button color="gray" onClick={() => setIsEditModalOpen(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Items;