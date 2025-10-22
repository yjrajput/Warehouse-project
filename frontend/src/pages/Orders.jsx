import { useState } from 'react';
import { useInventory } from '../contextAPI/InventoryContext';
import { ShoppingCart, AlertTriangle, CheckCircle, Package } from 'lucide-react';
const Orders = () => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const { products, fulfillOrder, selectedWarehouse } = useInventory();
   const [quantity, setQuantity] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredProducts =
    selectedWarehouse === 'all'
      ? products
      : products.filter((p) => p.warehouseId === selectedWarehouse);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedProduct) return;

    const qty = parseInt(quantity, 10);
    if (!qty || qty <= 0) return;

    const success = fulfillOrder(selectedProduct, qty);

    if (success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      setSelectedProduct('');
      setQuantity('');
    }
  };


  const product = products.find(p => p.id === selectedProduct);
  const canFulfill = product && quantity && parseInt(quantity) > 0 && parseInt(quantity) <= product.quantity;
  return (
    <div className="space-y-6">
        <div>
        <h1 className="text-2xl font-bold text-gray-900">Shipment Management</h1>
        <p className="mt-1 text-gray-600">Receive and process incoming shipments</p>
      </div>


        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <ShoppingCart className="h-5 w-5 text-purple-500" /> Receive Shipment
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
              <div className="space-y-4">
                <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Available Stock</p>
                      <p className="text-gray-900 font-medium">{product.quantity} units</p>
                    </div>
                    <div>
                      <p className="text-gray-600">After Threshold</p>
                      <p className={`font-medium ${
                        product.quantity <= product.reorderThreshold ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {product.quantity > product.reorderThreshold ? 'Safe' : 'Low'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Stock Level</span>
                      <span>{product.quantity} / {product.reorderThreshold + 50}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-purple-200 overflow-hidden">
                      <div
                        className="h-full bg-purple-500"
                        style={{ width: `${(product.quantity / (product.reorderThreshold + 50)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2 flex flex-col">
                <label htmlFor="quantity">Quantity to Fulfill</label>
                <input type="number" id='quantity' min="1" max={product?.quantity || undefined} value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Enter order quantity" className='w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none'/>

                {product && quantity && parseInt(quantity) > product.quantity && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Insufficient stock! Only {product.quantity} units available.</span>
                </div>
              )}

            </div>
                
              {canFulfill && product && (
                <div className="space-y-3">
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <p className="text-sm text-gray-600">Stock After Fulfillment</p>
                    <p className="text-2xl text-blue-700 font-semibold">
                      {product.quantity - parseInt(quantity)} units
                    </p>
                  </div>

                 
                  {product.quantity - parseInt(quantity) <= product.reorderThreshold && (
                    <div className="flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4">
                      <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-orange-900 font-semibold">Low Stock Warning</p>
                        <p className="text-orange-700 mt-1 leading-relaxed">
                          This order will bring stock below the reorder threshold. A low stock alert will be triggered.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button type="submit" className="w-full flex items-center justify-center py-2 text-white rounded-lg bg-purple-600 hover:bg-purple-700" disabled={!canFulfill}>
                    <ShoppingCart className="mr-2 h-4 w-4" /> Fulfill Order
              </button>


            
            </form>

            {showSuccess && (
            <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-green-100 p-4 text-green-700 font-medium">
              <CheckCircle className="h-5 w-5" />
              <span>Order fulfilled successfully!</span>
            </div>
          )}

          </div>

          <div className="bg-white rounded-xl shadow p-6">
  <div className="flex items-center gap-2 mb-4">
    <Package className="h-5 w-5 text-blue-500" />
    <h3 className="text-lg font-semibold">Available Products</h3>
  </div>

  <div className="space-y-3 max-h-[500px] overflow-y-auto">
    {filteredProducts
      .filter(p => p.quantity > 0)
      .sort((a, b) => b.quantity - a.quantity)
      .map((product) => {
        const stockPercentage = (product.quantity / (product.reorderThreshold + 50)) * 100;
        const isLow = product.quantity <= product.reorderThreshold;

        return (
          <div
            key={product.id}
            className={`rounded-lg border p-4 ${
              isLow ? 'border-orange-200 bg-orange-50' : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-gray-900 font-medium">{product.name}</h4>
                <p className="mt-1 text-sm text-gray-600">{product.category}</p>
                <div className="mt-2 flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Available: </span>
                    <span className={isLow ? 'text-orange-700 font-semibold' : 'text-gray-900 font-medium'}>
                      {product.quantity}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Threshold: </span>
                    <span className="text-gray-900 font-medium">{product.reorderThreshold}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedProduct(product.id);
                  setQuantity('1');
                }}
                className={`py-1 px-3 rounded-lg font-medium ${
                  isLow ? 'border border-orange-300 text-orange-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Select
              </button>
            </div>

            <div className="mt-3 h-2 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className={`h-full ${isLow ? 'bg-orange-500' : 'bg-blue-500'}`}
                style={{ width: `${Math.min(100, stockPercentage)}%` }}
              ></div>
            </div>
          </div>
        );
      })}

    {filteredProducts.filter(p => p.quantity > 0).length === 0 && (
      <div className="py-12 text-center text-gray-600">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2">No products available</p>
      </div>
    )}
  </div>
</div>

        </div>
    </div>
  )
}

export default Orders