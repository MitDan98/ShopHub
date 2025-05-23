
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash, Plus, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Item {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
}

export const ItemsManagement = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    image: "",
    category: "",
  });
  const { toast } = useToast();

  // Load items from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem('admin_items');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    } else {
      // Initialize with some default items
      const defaultItems: Item[] = [
        { id: 1, title: "Wireless Headphones", price: 99.99, image: "/placeholder.svg", category: "Electronics" },
        { id: 2, title: "Smart Watch", price: 199.99, image: "/placeholder.svg", category: "Electronics" },
        { id: 3, title: "Coffee Mug", price: 14.99, image: "/placeholder.svg", category: "Home" },
      ];
      setItems(defaultItems);
      localStorage.setItem('admin_items', JSON.stringify(defaultItems));
    }
  }, []);

  // Save items to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('admin_items', JSON.stringify(items));
  }, [items]);

  const handleAddItem = () => {
    if (!formData.title || !formData.price || !formData.category) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields",
      });
      return;
    }

    const newItem: Item = {
      id: Date.now(),
      title: formData.title,
      price: parseFloat(formData.price),
      image: formData.image || "/placeholder.svg",
      category: formData.category,
    };

    setItems([...items, newItem]);
    setFormData({ title: "", price: "", image: "", category: "" });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Item added",
      description: `${newItem.title} has been added successfully`,
    });
  };

  const handleEditItem = () => {
    if (!editingItem || !formData.title || !formData.price || !formData.category) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields",
      });
      return;
    }

    const updatedItems = items.map(item =>
      item.id === editingItem.id
        ? {
            ...item,
            title: formData.title,
            price: parseFloat(formData.price),
            image: formData.image || "/placeholder.svg",
            category: formData.category,
          }
        : item
    );

    setItems(updatedItems);
    setEditingItem(null);
    setFormData({ title: "", price: "", image: "", category: "" });
    
    toast({
      title: "Item updated",
      description: `${formData.title} has been updated successfully`,
    });
  };

  const handleDeleteItem = (id: number) => {
    const itemToDelete = items.find(item => item.id === id);
    setItems(items.filter(item => item.id !== id));
    
    toast({
      title: "Item deleted",
      description: `${itemToDelete?.title} has been removed`,
    });
  };

  const openEditDialog = (item: Item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      price: item.price.toString(),
      image: item.image,
      category: item.category,
    });
  };

  const resetForm = () => {
    setFormData({ title: "", price: "", image: "", category: "" });
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Manage Items</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter item title"
                />
              </div>
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Electronics, Home, etc."
                />
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/placeholder.svg"
                />
              </div>
              <Button onClick={handleAddItem} className="w-full">
                Add Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Item</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="edit-title">Title *</Label>
                            <Input
                              id="edit-title"
                              value={formData.title}
                              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                              placeholder="Enter item title"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-price">Price *</Label>
                            <Input
                              id="edit-price"
                              type="number"
                              step="0.01"
                              value={formData.price}
                              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                              placeholder="0.00"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-category">Category *</Label>
                            <Input
                              id="edit-category"
                              value={formData.category}
                              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                              placeholder="Electronics, Home, etc."
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-image">Image URL</Label>
                            <Input
                              id="edit-image"
                              value={formData.image}
                              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                              placeholder="/placeholder.svg"
                            />
                          </div>
                          <Button onClick={handleEditItem} className="w-full">
                            Update Item
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No items found. Add your first item to get started.
        </div>
      )}
    </div>
  );
};
