import React, { useState, useEffect } from 'react';
import { useInventory } from '../contextAPI/InventoryContext';

const ProductModal = ({ isOpen, onClose, productId }) => {
  const { products, addProduct, updateProduct, warehouses } = useInventory();

  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    reorderThreshold: '',
    category: '',
    warehouseId: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (productId) {
      const product = products.find(p => p.id === productId);
      if (product) {
        setFormData({
          name: product.name || '',
          quantity: product.quantity?.toString() || '',
          reorderThreshold: product.reorderThreshold?.toString() || '',
          category: product.category || '',
          warehouseId: product.warehouseId || '',
        });
      }
    } else {
      setFormData({
        name: '',
        quantity: '',
        reorderThreshold: '',
        category: '',
        warehouseId: warehouses[0]?.id || '',
      });
    }
    setErrors({});
  }, [productId, products, isOpen, warehouses]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.quantity || parseInt(formData.quantity) < 0) newErrors.quantity = 'Valid quantity required';
    if (!formData.reorderThreshold || parseInt(formData.reorderThreshold) < 0) newErrors.reorderThreshold = 'Valid reorder threshold required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validate()) return;

    const productData = {
      name: formData.name.trim(),
      category: formData.category.trim(),
      quantity: parseInt(formData.quantity),
      reorderThreshold: parseInt(formData.reorderThreshold),
      warehouseId: formData.warehouseId,
    };

    if (productId) {
      updateProduct(productId, productData);
    } else {
      addProduct(productData);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {productId ? 'Edit Product' : 'Add Product'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Product Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              className={`w-full border p-2 rounded ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label className="block mb-1">Category *</label>
            <input
              type="text"
              value={formData.category}
              onChange={e => handleChange('category', e.target.value)}
              className={`w-full border p-2 rounded ${errors.category ? 'border-red-500' : ''}`}
            />
            {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1">Quantity *</label>
              <input
                type="number"
                min="0"
                value={formData.quantity}
                onChange={e => handleChange('quantity', e.target.value)}
                className={`w-full border p-2 rounded ${errors.quantity ? 'border-red-500' : ''}`}
              />
              {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
            </div>

            <div className="flex-1">
              <label className="block mb-1">Reorder Threshold *</label>
              <input
                type="number"
                min="0"
                value={formData.reorderThreshold}
                onChange={e => handleChange('reorderThreshold', e.target.value)}
                className={`w-full border p-2 rounded ${errors.reorderThreshold ? 'border-red-500' : ''}`}
              />
              {errors.reorderThreshold && <p className="text-sm text-red-500">{errors.reorderThreshold}</p>}
            </div>
          </div>

          <div>
            <label className="block mb-1">Warehouse *</label>
            <select
              value={formData.warehouseId}
              onChange={e => handleChange('warehouseId', e.target.value)}
              className="w-full border p-2 rounded"
            >
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>
                  {w.name} - {w.location}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {productId ? 'Update' : 'Add'} Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
