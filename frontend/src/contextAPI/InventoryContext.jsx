import { createContext, useContext, useState, useEffect } from "react";
import {toast} from 'sonner'

const InventoryContext = createContext();

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within InventoryProvider");
  }
  return context;
};

const initialProducts = [
  { id: "1", name: "Laptop", quantity: 45, reorderThreshold: 20, category: "Electronics", warehouseId: "wh1" },
  { id: "2", name: "Mouse", quantity: 8, reorderThreshold: 15, category: "Electronics", warehouseId: "wh1" },
  { id: "3", name: "Keyboard", quantity: 32, reorderThreshold: 10, category: "Electronics", warehouseId: "wh1" },
  { id: "4", name: "Monitor", quantity: 18, reorderThreshold: 8, category: "Electronics", warehouseId: "wh1" },
  { id: "5", name: "USB Cable", quantity: 150, reorderThreshold: 50, category: "Accessories", warehouseId: "wh2" },
  { id: "6", name: "Desk Chair", quantity: 5, reorderThreshold: 10, category: "Furniture", warehouseId: "wh2" },
  { id: "7", name: "Standing Desk", quantity: 22, reorderThreshold: 5, category: "Furniture", warehouseId: "wh2" },
  { id: "8", name: "Webcam", quantity: 12, reorderThreshold: 15, category: "Electronics", warehouseId: "wh3" },
];

const warehouses = [
  { id: "all", name: "All Warehouses", location: "All Locations" },
  { id: "wh1", name: "Warehouse A", location: "Khargone" },
  { id: "wh2", name: "Warehouse B", location: "kasrawad" },
  { id: "wh3", name: "Warehouse C", location: "Borawan" },
];

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts);
  const [activities, setActivities] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("all");
  const [settings, setSettings] = useState({
    alertSound: true,
    defaultThreshold: 10,
    theme: "light",
  });

  // check for low stock
  useEffect(() => {
    products.forEach((product) => {
      if (product.quantity <= product.reorderThreshold) {
        const existingAlert = alerts.find(
          (a) => a.productId === product.id && a.status === "active"
        );
        if (!existingAlert) {
          const newAlert = {
            id: `alert-${Date.now()}-${product.id}`,
            productId: product.id,
            productName: product.name,
            quantity: product.quantity,
            threshold: product.reorderThreshold,
            timestamp: new Date(),
            status: "active",
          };
          setAlerts((prev) => [newAlert, ...prev]);
        }
      }
    });
  }, [products]);

  const addActivity = (activity) => {
    const newActivity = {
      ...activity,
      id: `activity-${Date.now()}`,
      timestamp: new Date(),
    };
    setActivities((prev) => [newActivity, ...prev.slice(0, 49)]);
  };

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [...prev, newProduct]);
    addActivity({
      type: "product_added",
      productName: newProduct.name,
      quantity: newProduct.quantity,
      message: `New product added: ${newProduct.name} (${newProduct.quantity} units)`,
    });
    toast.success(`Product "${newProduct.name}" added successfully`);
  };

  const updateProduct = (id, updates) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    const product = products.find((p) => p.id === id);
    if (product) {
      toast.success(`Product "${product.name}" updated successfully`);
    }
  };

  const deleteProduct = (id) => {
    const product = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (product) {
      toast.success(`Product "${product.name}" deleted successfully`);
    }
  };

  const receiveShipment = (productId, quantity) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, quantity: p.quantity + quantity } : p
      )
    );

    addActivity({
      type: "shipment",
      productName: product.name,
      quantity,
      message: `Received ${quantity} units of ${product.name}`,
    });

    toast.success(`Shipment of ${quantity} units added to ${product.name}`);

    // Resolve alert if stock is now sufficient
    setAlerts((prev) =>
      prev.map((a) =>
        a.productId === productId && product.quantity + quantity > product.reorderThreshold
          ? { ...a, status: "resolved" }
          : a
      )
    );
  };

  const fulfillOrder = (productId, quantity) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return false;

    if (product.quantity < quantity) {
      toast.error(`Error: Not enough stock available for ${product.name}`);
      return false;
    }

    const newQuantity = product.quantity - quantity;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, quantity: newQuantity } : p
      )
    );

    addActivity({
      type: "order",
      productName: product.name,
      quantity,
      message: `Fulfilled ${quantity} orders of ${product.name}`,
    });

    toast.success(`Order fulfilled: ${quantity} units of ${product.name}`);

    if (newQuantity <= product.reorderThreshold) {
      toast.warning(`⚠️ Low stock for ${product.name} – only ${newQuantity} left!`, {
        duration: 5000,
      });

      addActivity({
        type: "alert",
        productName: product.name,
        quantity: newQuantity,
        message: `Low stock alert: ${product.name} – only ${newQuantity} left!`,
      });
    }

    return true;
  };

  const resolveAlert = (alertId) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: "resolved" } : a))
    );
    toast.success("Alert marked as resolved");
  };

  const dismissAlert = (alertId) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: "dismissed" } : a))
    );
    toast.info("Alert dismissed");
  };

  const updateSettings = (updates) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    toast.success("Settings updated successfully");
  };

  return (
    <InventoryContext.Provider
      value={{
        products,
        activities,
        alerts,
        warehouses,
        selectedWarehouse,
        settings,
        addProduct,
        updateProduct,
        deleteProduct,
        receiveShipment,
        fulfillOrder,
        resolveAlert,
        dismissAlert,
        setSelectedWarehouse,
        updateSettings,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};
