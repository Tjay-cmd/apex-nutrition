"use client";

import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, Star, X, Zap, Target, Heart, Shield, ArrowUpDown, Sparkles } from 'lucide-react';
import ProductCard from '@/components/products/product-card';
import { Button } from '@/components/ui/button';
import { getProducts, getCategories, formatZAR } from '@/lib/firebase-queries';
import type { Product } from '@/types/product';

interface Category {
  id: string;
  name: string;
}

interface FilterChip {
  id: string;
  label: string;
  icon?: React.ReactNode;
  category: string;
}

const ShopPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  // Supplement-specific filter chips with improved icons
  const filterChips: FilterChip[] = [
    { id: 'protein', label: 'Protein', icon: <Zap className="h-4 w-4" />, category: 'type' },
    { id: 'pre-workout', label: 'Pre-Workout', icon: <Target className="h-4 w-4" />, category: 'type' },
    { id: 'recovery', label: 'Recovery', icon: <Heart className="h-4 w-4" />, category: 'type' },
    { id: 'vitamins', label: 'Vitamins', icon: <Shield className="h-4 w-4" />, category: 'type' },
    { id: 'muscle-building', label: 'Muscle Building', icon: <Target className="h-4 w-4" />, category: 'goal' },
    { id: 'weight-loss', label: 'Weight Loss', icon: <Target className="h-4 w-4" />, category: 'goal' },
    { id: 'energy', label: 'Energy', icon: <Zap className="h-4 w-4" />, category: 'goal' },
    { id: 'vegan', label: 'Vegan', icon: <Shield className="h-4 w-4" />, category: 'dietary' },
    { id: 'gluten-free', label: 'Gluten Free', icon: <Shield className="h-4 w-4" />, category: 'dietary' },
    { id: 'featured', label: 'Featured', icon: <Sparkles className="h-4 w-4" />, category: 'feature' },
    { id: 'best-seller', label: 'Best Seller', icon: <Star className="h-4 w-4" />, category: 'feature' },
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, activeFilters]);

  const loadInitialData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories()
      ]);

      // Only show active products from Firebase
      const activeProducts = productsData.filter((product: any) => product.status === 'active');
      setProducts(activeProducts);

      setCategories(categoriesData as Category[]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const allProducts = await getProducts();

      // Filter by search term and active filters
      let filteredProducts = allProducts.filter((product: any) => {
        const matchesSearch = !searchTerm ||
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilters = activeFilters.length === 0 ||
          activeFilters.some(filter => {
            switch (filter) {
              case 'protein':
                return product.category?.toLowerCase().includes('protein');
              case 'pre-workout':
                return product.category?.toLowerCase().includes('pre-workout');
              case 'recovery':
                return product.category?.toLowerCase().includes('recovery');
              case 'vitamins':
                return product.category?.toLowerCase().includes('vitamin');
              case 'featured':
                return product.featured;
              case 'best-seller':
                return product.featured; // For now, use featured as best seller
              default:
                return true;
            }
          });

        return matchesSearch && matchesFilters && product.status === 'active';
      });

      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSearchTerm('');
    setPriceRange([0, 2000]);
  };

  const handleAddToCart = (productId: string) => {
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', productId);
  };

  const handleAddToWishlist = (productId: string) => {
    // TODO: Implement add to wishlist functionality
    console.log('Add to wishlist:', productId);
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'featured':
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      default: // newest
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
    }
  });

  const filteredProducts = sortedProducts.filter(product => {
    const inPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1];
    return inPriceRange;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apex-red mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Apex <span className="text-apex-red">Supplements</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Premium supplements formulated for champions. Trusted by professional athletes.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative mb-8">
              <input
                type="text"
                placeholder="Search for protein, pre-workout, vitamins, or supplements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-white/30 rounded-2xl bg-white/10 backdrop-blur-sm text-white placeholder-white/80 focus:border-apex-red focus:outline-none transition-colors"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-white/80" />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-apex-red">{filteredProducts.length}</div>
                <div className="text-sm text-gray-300">Premium Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-apex-red">100%</div>
                <div className="text-sm text-gray-300">Authentic</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-apex-red">24/7</div>
                <div className="text-sm text-gray-300">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         {/* Centered Filter & Sort Controls */}
         <div className="flex justify-center items-center space-x-4 mb-8">

                       {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-3 px-6 py-3 rounded-2xl transition-all duration-300 ${
                showFilters || activeFilters.length > 0
                  ? 'bg-gradient-to-r from-apex-red via-red-800 to-black text-white shadow-lg'
                  : 'bg-white/80 backdrop-blur-sm hover:bg-white/90 text-gray-800 hover:scale-105 shadow-md hover:shadow-lg border border-white/30'
              }`}
            >
              <Filter className="h-5 w-5" />
              <span className="font-medium">
                {activeFilters.length > 0 ? `${activeFilters.length} Filters` : 'Filters'}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* Sort Toggle Button */}
            <button
              onClick={() => setShowSort(!showSort)}
              className={`flex items-center space-x-3 px-6 py-3 rounded-2xl transition-all duration-300 ${
                showSort
                  ? 'bg-gradient-to-r from-apex-red via-red-800 to-black text-white shadow-lg'
                  : 'bg-white/80 backdrop-blur-sm hover:bg-white/90 text-gray-800 hover:scale-105 shadow-md hover:shadow-lg border border-white/30'
              }`}
            >
              <ArrowUpDown className="h-5 w-5" />
              <span className="font-medium">Sort</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showSort ? 'rotate-180' : ''}`} />
            </button>
         </div>

         {/* Animated Filter Options */}
         <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
           showFilters ? 'max-h-96 opacity-100 mb-8' : 'max-h-0 opacity-0'
         }`}>
           <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-6">
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
               {filterChips.map((chip, index) => (
                 <button
                   key={chip.id}
                   onClick={() => toggleFilter(chip.id)}
                                       className={`group relative flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 transform ${
                      activeFilters.includes(chip.id)
                        ? 'bg-gradient-to-br from-apex-red via-red-800 to-black text-white shadow-xl scale-105'
                        : 'bg-white/80 backdrop-blur-sm hover:bg-white/90 text-gray-800 hover:scale-105 shadow-md hover:shadow-lg border border-white/30'
                    }`}
                   style={{
                     animationDelay: `${index * 50}ms`,
                     animation: showFilters ? 'slideInUp 0.3s ease-out forwards' : 'none'
                   }}
                 >
                                       <div className={`mb-2 transition-all duration-300 ${
                      activeFilters.includes(chip.id) ? 'text-white' : 'text-apex-red group-hover:text-red-700'
                    }`}>
                      {chip.icon}
                    </div>
                   <span className="text-xs font-medium">{chip.label}</span>

                                       {/* Subtle glow effect for active filters */}
                    {activeFilters.includes(chip.id) && (
                      <div className="absolute inset-0 bg-gradient-to-br from-apex-red/20 via-red-800/20 to-black/20 rounded-2xl blur-sm -z-10"></div>
                    )}
                 </button>
               ))}
             </div>

             {/* Active Filters Display */}
             {activeFilters.length > 0 && (
               <div className="mt-6 pt-6 border-t border-white/20">
                 <div className="flex flex-wrap gap-3">
                   {activeFilters.map((filterId) => {
                     const chip = filterChips.find(c => c.id === filterId);
                     return (
                       <div
                         key={filterId}
                                                   className="flex items-center space-x-2 bg-gradient-to-r from-apex-red/10 via-red-800/10 to-black/10 text-apex-red px-4 py-2 rounded-full text-sm font-medium border border-apex-red/30 backdrop-blur-sm"
                       >
                         <span>{chip?.label}</span>
                         <button
                           onClick={() => toggleFilter(filterId)}
                           className="hover:bg-apex-red/20 rounded-full p-1 transition-colors duration-200"
                         >
                           <X className="h-3 w-3" />
                         </button>
                       </div>
                     );
                   })}
                 </div>
               </div>
             )}
           </div>
         </div>

         {/* Animated Sort Options */}
         <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
           showSort ? 'max-h-32 opacity-100 mb-8' : 'max-h-0 opacity-0'
         }`}>
           <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-6">
             <div className="flex flex-wrap gap-3">
               {[
                 { value: 'newest', label: 'Newest First' },
                 { value: 'featured', label: 'Featured' },
                 { value: 'price-low', label: 'Price: Low to High' },
                 { value: 'price-high', label: 'Price: High to Low' },
                 { value: 'name', label: 'Name: A to Z' }
               ].map((option, index) => (
                 <button
                   key={option.value}
                   onClick={() => {
                     setSortBy(option.value);
                     setShowSort(false);
                   }}
                                       className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform ${
                      sortBy === option.value
                        ? 'bg-gradient-to-r from-apex-red via-red-800 to-black text-white shadow-lg scale-105'
                        : 'bg-white/80 backdrop-blur-sm hover:bg-white/90 text-gray-800 hover:scale-105 shadow-md hover:shadow-lg border border-white/30'
                    }`}
                   style={{
                     animationDelay: `${index * 50}ms`,
                     animation: showSort ? 'slideInUp 0.3s ease-out forwards' : 'none'
                   }}
                 >
                   {option.label}
                 </button>
               ))}
             </div>
           </div>
         </div>

        {/* Products Section */}
        <div className="space-y-6">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredProducts.length} Premium Supplements
              </h2>
              {activeFilters.length > 0 && (
                <span className="text-sm text-gray-500">
                  Filtered by {activeFilters.length} criteria
                </span>
              )}
            </div>
          </div>

          {/* Products Grid/List */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-500 text-lg mb-2">No products found</div>
              <p className="text-gray-400 mb-4">Try adjusting your filters or search term</p>
              <button
                onClick={clearAllFilters}
                className="text-apex-red hover:text-red-600 font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className={`${
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }`}>
                             {filteredProducts.map((product) => (
                 <ProductCard
                   key={product.id}
                   product={product}
                   onAddToWishlist={handleAddToWishlist}
                 />
               ))}
            </div>
          )}

          {/* Load More Button */}
          {filteredProducts.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="border-apex-red text-apex-red hover:bg-apex-red hover:text-white">
                Load More Products
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;