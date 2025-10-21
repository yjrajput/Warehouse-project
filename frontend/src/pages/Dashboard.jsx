import React from 'react'
import StateCard from '../components/StateCard'
import { useInventory } from '../contextAPI/InventoryContext'
import { Package, AlertTriangle , ShoppingCart, TruckIcon} from 'lucide-react'

const Dashboard = () => {
    const { products, activities, alerts, selectedWarehouse } = useInventory();

    const filteredProducts = selectedWarehouse === 'all' 
    ? products 
    : products.filter(p => p.warehouseId === selectedWarehouse);

    const totalProducts = filteredProducts.length;
    const lowStockItems = filteredProducts.filter(p => p.quantity <= p.reorderThreshold).length;
    const totalQuantity = filteredProducts.reduce((sum, p) => sum + p.quantity, 0);
    
    const shipmentsReceived = activities.filter(a => a.type === 'shipment').length;
    const ordersFulfilled = activities.filter(a => a.type === 'order').length;
  return (
    <div className='space-y-6'>
        <div>
            <h1 className="text-gray-900">Dashboard</h1>
            <p className="mt-1 text-gray-600">
                Real-time overview of your warehouse inventory
            </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 ">
            <StateCard title="Total Products" value={totalProducts} icon={Package} color="blue" subtitle={`${totalQuantity} units in stock`}/>

            <StateCard title="Low Stock Items" value={lowStockItems} icon={AlertTriangle} color="orange" subtitle="Need reordering"/>

            <StateCard title="Shipments Received" value={shipmentsReceived} icon={TruckIcon} color="green" subtitle="This month"/>

            <StateCard title="Orders Fulfilled" value={ordersFulfilled} icon={ShoppingCart} color="purple" subtitle="This month"/>
        </div>
    </div>
  )
}

export default Dashboard