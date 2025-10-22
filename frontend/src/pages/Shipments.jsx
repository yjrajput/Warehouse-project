import { useState } from 'react';
import { TruckIcon, Package, CheckCircle } from 'lucide-react';
import { useInventory } from '../contextAPI/InventoryContext';
import { toast } from 'sonner';

const Shipments = () => {
  const { products, receiveShipment, selectedWarehouse } = useInventory();
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  
  const filteredProducts =
    selectedWarehouse === 'all'
      ? products
      : products.filter((p) => p.warehouseId === selectedWarehouse);

  
  const product = products.find((p) => p.id === selectedProduct);


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedProduct) {
      toast.error('Please select a product');
      return;
    }

    const qty = parseInt(quantity, 10);
    if (!qty || qty <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    receiveShipment(selectedProduct, qty);

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);

    setSelectedProduct('');
    setQuantity('');
  };

  return (
    <div className="space-y-6">
     
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Shipment Management</h1>
        <p className="mt-1 text-gray-600">Receive and process incoming shipments</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
       
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <TruckIcon className="h-5 w-5 text-green-600" /> Receive Shipment
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Select Product</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Choose a product</option>
                {filteredProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - Current: {p.quantity} units
                  </option>
                ))}
              </select>
            </div>

          
            {selectedProduct && product && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Current Stock</p>
                  <p className="text-gray-900 font-medium">{product.quantity} units</p>
                </div>
                <div>
                  <p className="text-gray-600">Reorder Threshold</p>
                  <p className="text-gray-900 font-medium">{product.reorderThreshold} units</p>
                </div>
                <div>
                  <p className="text-gray-600">Category</p>
                  <p className="text-gray-900 font-medium">{product.category}</p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <p
                    className={`font-medium ${
                      product.quantity <= product.reorderThreshold ? 'text-orange-600' : 'text-green-600'
                    }`}
                  >
                    {product.quantity <= product.reorderThreshold ? 'Low Stock' : 'Sufficient'}
                  </p>
                </div>
              </div>
            )}

     
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Quantity Received</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity received"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

     
            {selectedProduct && quantity && product && parseInt(quantity, 10) > 0 && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm">
                <p className="text-gray-600">New Stock Level</p>
                <p className="text-2xl text-green-700 font-semibold">
                  {product.quantity + parseInt(quantity, 10)} units
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedProduct || !quantity}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
            >
              <TruckIcon className="inline-block mr-2 h-4 w-4" />
              Receive Shipment
            </button>

            {showSuccess && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-100 p-4 text-green-700 font-medium">
                <CheckCircle className="h-5 w-5" />
                <span>Shipment received successfully!</span>
              </div>
            )}
          </form>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <Package className="h-5 w-5 text-orange-500" /> Products Needing Restock
          </h2>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {filteredProducts.filter((p) => p.quantity <= p.reorderThreshold).length === 0 ? (
              <div className="py-12 text-center text-gray-600">✅ All products are well stocked!</div>
            ) : (
              filteredProducts
                .filter((p) => p.quantity <= p.reorderThreshold)
                .map((product) => (
                  <div key={product.id} className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-gray-900 font-medium">{product.name}</h4>
                        <p className="text-sm text-gray-600">{product.category}</p>
                        <div className="mt-2 flex items-center gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Current: </span>
                            <span className="text-orange-700 font-semibold">{product.quantity}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Need: </span>
                            <span className="text-gray-900 font-semibold">
                              {Math.max(0, product.reorderThreshold - product.quantity + 10)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedProduct(product.id);
                          setQuantity(
                            Math.max(0, product.reorderThreshold - product.quantity + 10).toString()
                          );
                        }}
                        className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-1 px-3 rounded-lg"
                      >
                        Restock
                      </button>
                    </div>

                 
                    <div className="mt-3 h-2 w-full rounded-full bg-orange-200 overflow-hidden">
                      <div
                        className="h-full bg-orange-500"
                        style={{
                          width: `${Math.min(100, (product.quantity / product.reorderThreshold) * 100)}%`,
                        }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {Math.round((product.quantity / product.reorderThreshold) * 100)}% of threshold
                    </p>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipments;
