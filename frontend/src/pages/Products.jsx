import { useState } from "react";
import { Package, Plus, Search, Edit, Trash2 } from "lucide-react";
import { useInventory } from "../contextAPI/InventoryContext";
import ProductModle from "../components/ProductModle";

const Products = () => {
  const { products, deleteProduct, warehouses, selectedWarehouse } = useInventory();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProducts = products
    .filter(
      (p) => selectedWarehouse === "all" || p.warehouseId === selectedWarehouse
    )
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (filterStatus === "all") return true;
      if (filterStatus === "low")
        return p.quantity <= p.reorderThreshold && p.quantity > 0;
      if (filterStatus === "out") return p.quantity === 0;
      if (filterStatus === "sufficient") return p.quantity > p.reorderThreshold;

      return true;
    });


  const getStatusBadge = (product) => {
    if (product.quantity === 0)
      return (
        <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
          Out of Stock
        </span>
      );
    if (product.quantity <= product.reorderThreshold)
      return (
        <span className="px-2 py-1 text-xs font-semibold text-white bg-orange-500 rounded-full">
          Low Stock
        </span>
      );
    return (
      <span className="px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded-full">
        Sufficient
      </span>
    );
  };

  const handleEdit = (productId) => {
    setEditingProduct(productId);
    setIsModalOpen(true);
  };

  const handleDelete = (productId) => {
    deleteProduct(productId);
    setDeleteConfirm(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
   
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="mt-1 text-gray-600">Manage your warehouse inventory</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 flex py-2 px-4 items-center rounded-lg text-white transition-all">
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </button>
      </div>


      <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-800 font-semibold text-lg">
            <Package className="h-5 w-5 text-blue-500" />
            All Products ({filteredProducts.length})
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
         
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 w-full border border-gray-300 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

          
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full sm:w-44 border border-gray-300 rounded-lg p-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            >
              <option value="all">All Status</option>
              <option value="sufficient">Sufficient</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>
        </div>


        <div className="overflow-x-auto mt-4">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Product ID</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Category</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Quantity</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Reorder Threshold</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Warehouse</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2">No products found</p>
                  </td>
                </tr>
              )}

              {filteredProducts.map((product) => {
                const warehouse = warehouses.find((w) => w.id === product.warehouseId);

                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-500">{product.id}</td>
                    <td className="px-4 py-3">{product.name}</td>
                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span>{product.quantity}</span>
                        {product.quantity <= product.reorderThreshold && (
                          <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">{product.reorderThreshold}</td>
                    <td className="px-4 py-3">{getStatusBadge(product)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{warehouse?.name}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product.id)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-all"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4 text-gray-700 hover:text-blue-600" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-red-500 hover:text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ProductModle
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        productId={editingProduct}
      />

      
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-11/12 max-w-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Are you sure?</h2>
            <p className="text-gray-500 mb-6">
              This will permanently delete <span className="font-medium">{warehouses.find(w => w.id === deleteConfirm)?.name}</span> from your inventory. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
