"use client";

import React, { useState, useEffect } from 'react';
import { RoleGuard } from '@/components/auth/role-guard';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Package,
  Grid3X3,
  List,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { getAllProducts, deleteProduct, toggleProductStatus, toggleProductFeatured } from '@/lib/firebase-queries';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  status: 'active' | 'inactive';
  featured: boolean;
  stock: number;
  image_url?: string;
  created_at: string;
}

const ManageProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getAllProducts();
        setProducts(productsData as Product[]);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [refreshKey]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA');
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const result = await deleteProduct(productId);
        if (result.success) {
          setProducts(products.filter(p => p.id !== productId));
        } else {
          console.error('Error deleting product:', result.error);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const refreshProducts = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleToggleStatus = async (productId: string, currentStatus: 'active' | 'inactive') => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const result = await toggleProductStatus(productId, newStatus);
      if (result.success) {
        setProducts(products.map(p =>
          p.id === productId ? { ...p, status: newStatus } : p
        ));
      } else {
        console.error('Error toggling product status:', result.error);
      }
    } catch (error) {
      console.error('Error toggling product status:', error);
    }
  };

  const handleToggleFeatured = async (productId: string, currentFeatured: boolean) => {
    try {
      const result = await toggleProductFeatured(productId, !currentFeatured);
      if (result.success) {
        setProducts(products.map(p =>
          p.id === productId ? { ...p, featured: !currentFeatured } : p
        ));
      } else {
        console.error('Error toggling product featured status:', result.error);
      }
    } catch (error) {
      console.error('Error toggling product featured status:', error);
    }
  };

  if (loading) {
    return (
      <RoleGuard allowedRoles={['admin', 'super_admin']}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apex-red mx-auto"></div>
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={['admin', 'super_admin']}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
                <p className="text-gray-600 mt-2">Add, edit, and manage your product catalog</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={refreshProducts}
                  className="border-gray-300 text-gray-700 hover:border-apex-red hover:text-apex-red"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Refresh
                </Button>
                <Button
                  asChild
                  className="bg-apex-red hover:bg-red-600 text-white font-medium py-3 px-6 rounded-xl flex items-center space-x-2"
                >
                  <Link href="/admin/products/add">
                    <Plus className="h-5 w-5" />
                    <span>Add Product</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-apex-red focus:border-transparent transition-all duration-200 text-sm text-gray-900 placeholder:text-gray-500"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-4">
                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-500" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apex-red focus:border-transparent text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' ? 'bg-apex-red text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list' ? 'bg-apex-red text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-100">
                                         {product.image_url ? (
                       <img
                         src={product.image_url}
                         alt={product.name}
                         className="w-full h-full object-contain"
                       />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center">
                         <Package className="h-12 w-12 text-gray-400" />
                       </div>
                     )}

                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.status}
                      </span>
                    </div>

                    {/* Featured Badge */}
                    {product.featured && (
                      <div className="absolute top-2 left-2">
                        <span className="bg-gradient-to-r from-apex-red to-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-apex-red">{formatPrice(product.price)}</span>
                      <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {product.category}
                      </span>

                                             {/* Action Buttons */}
                       <div className="flex items-center space-x-2">
                         <Button
                           variant="outline"
                           size="sm"
                           className="border-gray-300 text-gray-700 hover:border-apex-red hover:text-apex-red"
                           onClick={() => handleToggleStatus(product.id, product.status)}
                         >
                           {product.status === 'active' ? 'Deactivate' : 'Activate'}
                         </Button>
                         <Button
                           variant="outline"
                           size="sm"
                           className="border-gray-300 text-gray-700 hover:border-apex-red hover:text-apex-red"
                           asChild
                         >
                           <Link href={`/admin/products/edit/${product.id}`}>
                             <Edit className="h-4 w-4" />
                           </Link>
                         </Button>
                         <Button
                           variant="outline"
                           size="sm"
                           className="border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-500"
                           onClick={() => handleDeleteProduct(product.id)}
                         >
                           <Trash2 className="h-4 w-4" />
                         </Button>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                                                         <div className="h-10 w-10 flex-shrink-0">
                               {product.image_url ? (
                                 <img
                                   src={product.image_url}
                                   alt={product.name}
                                   className="h-10 w-10 rounded-lg object-contain"
                                 />
                               ) : (
                                 <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                   <Package className="h-5 w-5 text-gray-400" />
                                 </div>
                               )}
                             </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{product.category}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-bold text-apex-red">{formatPrice(product.price)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm ${
                            product.stock > 10 ? 'text-green-600' :
                            product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                     <div className="flex items-center space-x-2">
                             <Button
                               variant="outline"
                               size="sm"
                               className="border-gray-300 text-gray-700 hover:border-apex-red hover:text-apex-red"
                               onClick={() => handleToggleStatus(product.id, product.status)}
                             >
                               {product.status === 'active' ? 'Deactivate' : 'Activate'}
                             </Button>
                             <Button
                               variant="outline"
                               size="sm"
                               className="border-gray-300 text-gray-700 hover:border-apex-red hover:text-apex-red"
                               asChild
                             >
                               <Link href={`/admin/products/edit/${product.id}`}>
                                 <Edit className="h-4 w-4" />
                               </Link>
                             </Button>
                             <Button
                               variant="outline"
                               size="sm"
                               className="border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-500"
                               onClick={() => handleDeleteProduct(product.id)}
                             >
                               <Trash2 className="h-4 w-4" />
                             </Button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first product'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button
                  asChild
                  className="bg-apex-red hover:bg-red-600 text-white"
                >
                  <Link href="/admin/products/add">
                    <Plus className="h-5 w-5 mr-2" />
                    Add Your First Product
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
};

export default ManageProductsPage;