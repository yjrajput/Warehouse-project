import { Warehouse, Package, TrendingUp, TrendingDown } from 'lucide-react';
import { useInventory } from '../contextAPI/InventoryContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const Warehouses = () => {

  const { products, warehouses, selectedWarehouse, setSelectedWarehouse } = useInventory();

  const getWarehouseStats = (warehouseId) => {
    const warehouseProducts = products.filter((p) => p.warehouseId === warehouseId);
    return {
      totalProducts: warehouseProducts.length,
      totalUnits: warehouseProducts.reduce((sum, p) => sum + p.quantity, 0),
      lowStock: warehouseProducts.filter((p) => p.quantity <= p.reorderThreshold).length,
      outOfStock: warehouseProducts.filter((p) => p.quantity === 0).length,
    };
  };

  const warehouseData = warehouses
    .filter((w) => w.id !== "all")
    .map((warehouse) => ({
      id: warehouse.id,
      name: warehouse.name,
      location: warehouse.location,
      ...getWarehouseStats(warehouse.id),
    }));


  const comparisonData = warehouseData.map((w) => ({
    name: w.name.replace("Warehouse ", ""),
    products: w.totalProducts,
    units: w.totalUnits,
    lowStock: w.lowStock,
  }));


  const distributionData = warehouseData.map((w) => ({
    name: w.name,
    value: w.totalUnits,
  }));

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

  // const selectedWarehouseData = warehouses.find((w) => w.id === selectedWarehouse);
  const filteredProducts =
    selectedWarehouse === "all"
      ? products
      : products.filter((p) => p.warehouseId === selectedWarehouse);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Warehouses</h1>
          <p className="mt-1 text-gray-600">View and compare inventory across locations</p>
        </div>
        <select
          value={selectedWarehouse}
          onChange={(e) => setSelectedWarehouse(e.target.value)}
          className="w-64 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >

          {warehouses.map((warehouse) => (
            <option key={warehouse.id} value={warehouse.id}>
              {warehouse.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {
          warehouseData.map((warehouse, index) => (
            <div key={index}
              className={`rounded-xl border bg-white shadow-sm transition-all duration-300 ${selectedWarehouse === warehouse.id ? "ring-2 ring-blue-500" : "hover:shadow-md"
                }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-500 p-2">
                      <Warehouse className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-medium">{warehouse.name}</h3>
                      <p className="text-xs text-gray-500">{warehouse.location}</p>
                    </div>
                  </div>
                  {warehouse.lowStock > 0 && (
                    <span className="px-2 py-1 text-xs font-semibold rounded-md bg-orange-500 text-white">
                      {warehouse.lowStock}
                    </span>
                  )}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Products</p>
                    <p className="text-gray-900 font-medium">{warehouse.totalProducts}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Units</p>
                    <p className="text-gray-900 font-medium">{warehouse.totalUnits}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Warehouse Comparison</h2>

          </div>

          <div className="w-full h-[300px] sm:h-[350px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="products" fill="#3b82f6" name="Products" radius={[8, 8, 0, 0]} />
                <Bar dataKey="lowStock" fill="#f59e0b" name="Low Stock" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-gray-700 font-medium">Products</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-orange-500" />
              <span className="text-gray-700 font-medium">Low Stock</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Inventory Distribution</h2>

          </div>

          <div className="w-full h-[300px] sm:h-[350px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>



      <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-6">
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full border-collapse text-sm">

            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Product Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Category</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Quantity</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Threshold</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Trend</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2">No products found</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const stockPercentage =
                    (product.quantity / product.reorderThreshold) * 100;
                  const isLow = product.quantity <= product.reorderThreshold;

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-500">{product.name}</td>
                      <td className="px-4 py-3">{product.category}</td>
                      <td className="px-4 py-3">{product.quantity}</td>
                      <td className="px-4 py-3">{product.reorderThreshold}</td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        {product.quantity === 0 ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded-md bg-red-500 text-white">
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded-md bg-orange-500 text-white">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold rounded-md bg-green-500 text-white">
                            Sufficient
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {stockPercentage > 100 ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                              />
                            </svg>
                            <span className="text-xs">Healthy</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-orange-600">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 17H3m0 0v-8m0 8l8-8 4 4 6-6"
                              />
                            </svg>
                            <span className="text-xs">Needs Restock</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>



      {selectedWarehouse === 'all' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">


          <div className="rounded-xl  bg-white shadow-sm p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Warehouses</h2>
            <div className="space-y-3">
              {warehouseData
                .sort((a, b) => b.totalUnits - a.totalUnits)
                .map((warehouse, index) => (
                  <div
                    key={warehouse.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-gray-900">{warehouse.name}</p>
                        <p className="text-xs text-gray-500">{warehouse.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900">{warehouse.totalUnits}</p>
                      <p className="text-xs text-gray-500">units</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>


          <div className="rounded-xl  bg-white shadow-sm p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Warehouses Needing Attention</h2>
            <div className="space-y-3">
              {warehouseData.filter(w => w.lowStock > 0).length > 0 ? (
                warehouseData
                  .filter(w => w.lowStock > 0)
                  .sort((a, b) => b.lowStock - a.lowStock)
                  .map((warehouse) => (
                    <div
                      key={warehouse.id}
                      className="flex items-center justify-between rounded-lg border border-orange-200 bg-orange-50 p-3 hover:shadow-sm transition-all"
                    >
                      <div>
                        <p className="text-gray-900">{warehouse.name}</p>
                        <p className="text-xs text-gray-600">{warehouse.location}</p>
                      </div>
                      <span className="px-2 py-1 text-xs font-semibold rounded-md bg-orange-500 text-white">
                        {warehouse.lowStock} low stock items
                      </span>
                    </div>
                  ))
              ) : (
                <div className="py-8 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-auto h-10 w-10 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    All warehouses are well stocked!
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      )}


    </div>
  )
}

export default Warehouses