import React from 'react'
import StateCard from '../components/StateCard'
import { useInventory } from '../contextAPI/InventoryContext'
import { Package, AlertTriangle, ShoppingCart, TruckIcon } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';



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

    // Chart data for stock levels
    const chartData = filteredProducts.slice(0, 8).map(p => ({
        name: p.name.length > 10 ? p.name.substring(0, 10) + '...' : p.name,
        stock: p.quantity,
        threshold: p.reorderThreshold,
    }));

    // Activity timeline data (last 7 days simulation)
    const getActivityTrend = () => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return days.map((day, index) => ({
            day,
            shipments: Math.floor(Math.random() * 15) + 5,
            orders: Math.floor(Math.random() * 20) + 10,
        }));
    };

    const activityTrend = getActivityTrend();
    return (
        <div className='space-y-6'>
            <div>
                <h1 className="text-gray-900">Dashboard</h1>
                <p className="mt-1 text-gray-600">
                    Real-time overview of your warehouse inventory
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 ">
                <StateCard title="Total Products" value={totalProducts} icon={Package} color="blue" subtitle={`${totalQuantity} units in stock`} />

                <StateCard title="Low Stock Items" value={lowStockItems} icon={AlertTriangle} color="orange" subtitle="Need reordering" />

                <StateCard title="Shipments Received" value={shipmentsReceived} icon={TruckIcon} color="green" subtitle="This month" />

                <StateCard title="Orders Fulfilled" value={ordersFulfilled} icon={ShoppingCart} color="purple" subtitle="This month" />
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* ---- Current Stock Levels ---- */}
                <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">📦 Current Stock Levels</h2>
                        <span className="text-sm text-gray-400">Updated just now</span>
                    </div>

                    <div className="w-full h-[300px] sm:h-[350px] md:h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} />
                                <YAxis tick={{ fill: "#6b7280" }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        borderRadius: "8px",
                                        border: "1px solid #e5e7eb",
                                    }}
                                />
                                <Bar dataKey="stock" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="threshold" fill="#f97316" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-blue-500" />
                            <span className="text-gray-700 font-medium">Current Stock</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-orange-500" />
                            <span className="text-gray-700 font-medium">Reorder Threshold</span>
                        </div>
                    </div>
                </div>

                {/* ---- Activity Trend (7 Days) ---- */}
                <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">📈 Activity Trend (7 Days)</h2>
                        <span className="text-sm text-gray-400">Last 7 days</span>
                    </div>

                    <div className="w-full h-[250px] sm:h-[300px] md:h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={activityTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#6b7280" }} />
                                <YAxis tick={{ fill: "#6b7280" }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        borderRadius: "8px",
                                        border: "1px solid #e5e7eb",
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="shipments"
                                    stroke="#10b981"
                                    strokeWidth={2.5}
                                    dot={{ r: 4 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="orders"
                                    stroke="#8b5cf6"
                                    strokeWidth={2.5}
                                    dot={{ r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-green-500" />
                                <span className="text-gray-600">Shipments</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-purple-500" />
                                <span className="text-gray-600">Orders</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Dashboard