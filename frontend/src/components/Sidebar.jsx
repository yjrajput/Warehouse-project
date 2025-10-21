import React, { useState } from 'react'
import { Package, LayoutDashboard, TruckIcon, ShoppingCart, Bell, Warehouse, Settings,X, Menu, Search } from 'lucide-react'
const Sidebar = () => {
    const [isActive, setIsActive] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const navigation = [
        { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
        { id: 'products', name: 'Products', icon: Package },
        { id: 'shipments', name: 'Shipments', icon: TruckIcon },
        { id: 'orders', name: 'Orders', icon: ShoppingCart },
        { id: 'alerts', name: 'Alerts', icon: Bell },
        { id: 'warehouses', name: 'Warehouses', icon: Warehouse },
        { id: 'settings', name: 'Settings', icon: Settings },
    ];

    const activeAlerts = 10
    return (
        <div className="min-h-screen bg-gray-50">
            <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
                <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
                    <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                        <div className="flex flex-shrink-0 items-center px-4">
                            <Package className="h-8 w-8 text-blue-600" />
                            <span className="ml-2 text-xl text-gray-900">WarehouseTrack</span>
                        </div>

                        <nav className="mt-8 flex-1 space-y-1 px-2">
                            {
                                navigation.map((items) => {
                                    const IconComponent = items.icon;

                                    return (
                                        <button onClick={() => setIsActive(items.id)} key={items.id} className={ `group flex w-full items-center rounded-md px-3 py-2 transition-colors ${isActive === items.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
                                            <IconComponent
                                                className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive === items.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                                                    }`}
                                            />
                                            {items.name}
                                        </button>


                                    )

                                })
                            }
                        </nav>
                    </div>
                </div>
            </aside>

            {/* for mobile width */}
            {
                sidebarOpen &&(
                    <div className="fixed inset-0 z-50 md:hidden">
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                            <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
                                <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                                    <div className="flex items-center">
                                        <Package className="h-8 w-8 text-blue-600" />
                                        <span className="ml-2 text-xl text-gray-900">WarehouseTrack</span>
                                    </div>
                                    <button onClick={() => setSidebarOpen(false)}>
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <nav className="mt-5 flex-1 space-y-1 px-2">
                                    {
                                        navigation.map((items) =>{
                                            const IconComponent = items.icon;
                                            return(
                                                <button key={items.id} onClick={() => setIsActive(items.id)} className={ `group flex w-full items-center rounded-md px-3 py-2 transition-colors ${isActive === items.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
                                                    <IconComponent className={`mr-3 h-5 w-5 flex-shrink-0  ${isActive === items.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                                                    }`}/>
                                                    {items.name}
                                                </button>
                                            )
                                        })
                                    }
                                </nav>
                            </div>
                    </div>
                )
            }

            <div className="md:pl-64">
                <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white shadow-sm">
                    <button className="md:hidden ml-2"onClick={() => setSidebarOpen(true)}>
                        <Menu className="h-6 w-6" />
                    </button>

                    <div className="flex flex-1 justify-between px-4 md:px-8">
                        <div className="flex flex-1 items-center">
                            <div className="w-full max-w-lg">
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input type="text" placeholder="Search products..." className="block w-full rounded-md border-gray-300 pl-10 border outline-none py-2" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="ml-4 flex items-center space-x-4">
                            <button className="relative rounded-full p-1 text-gray-400 hover:text-gray-500">
                                <Bell className="h-6 w-6"   />
                                {
                                    activeAlerts > 0 && (
                                        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                                    )
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar