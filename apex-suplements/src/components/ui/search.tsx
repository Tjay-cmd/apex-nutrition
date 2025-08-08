"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search as SearchIcon, X, Filter, Zap, Trophy, Dumbbell, Heart, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface SearchResult {
  id: string;
  title: string;
  category: string;
  price: number;
  image?: string;
  sport?: string;
  type: 'product' | 'category' | 'sport';
  description?: string;
}

interface SearchProps {
  placeholder?: string;
  className?: string;
  onSearchResults?: (results: SearchResult[]) => void;
  showFilters?: boolean;
}

const Search: React.FC<SearchProps> = ({
  placeholder = "Search supplements...",
  className,
  onSearchResults,
  showFilters = true
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock search data - in real app, this would come from API/database
  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'Whey Protein Isolate',
      category: 'Protein',
      price: 899,
      sport: 'bodybuilding',
      type: 'product',
      description: 'Fast-absorbing protein for muscle building'
    },
    {
      id: '2',
      title: 'Pre-Workout FURY',
      category: 'Pre-Workout',
      price: 599,
      sport: 'rugby',
      type: 'product',
      description: 'Maximum energy and focus for intense training'
    },
    {
      id: '3',
      title: 'BCAA Recovery',
      category: 'Recovery',
      price: 449,
      sport: 'cycling',
      type: 'product',
      description: 'Essential amino acids for faster recovery'
    },
    {
      id: '4',
      title: 'Fat Burner Elite',
      category: 'Weight Loss',
      price: 699,
      sport: 'fitness',
      type: 'product',
      description: 'Thermogenic fat burning formula'
    },
    {
      id: '5',
      title: 'Creatine Monohydrate',
      category: 'Performance',
      price: 399,
      sport: 'rugby',
      type: 'product',
      description: 'Pure creatine for strength and power'
    },
    {
      id: '6',
      title: 'Rugby Performance',
      category: 'Sports',
      price: 0,
      sport: 'rugby',
      type: 'sport',
      description: 'Supplements for rugby players'
    }
  ];

  // Filter options
  const filterOptions = [
    { id: 'all', label: 'All', icon: <SearchIcon className="h-4 w-4" /> },
    { id: 'protein', label: 'Protein', icon: <Dumbbell className="h-4 w-4" /> },
    { id: 'pre-workout', label: 'Pre-Workout', icon: <Zap className="h-4 w-4" /> },
    { id: 'recovery', label: 'Recovery', icon: <Heart className="h-4 w-4" /> },
    { id: 'weight-loss', label: 'Fat Burners', icon: <Flame className="h-4 w-4" /> },
    { id: 'rugby', label: 'Rugby', icon: <Trophy className="h-4 w-4" /> },
  ];

  // Search function with filtering
  const performSearch = (searchQuery: string, filter: string = selectedFilter) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      let filteredResults = mockResults.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Apply category/sport filter
      if (filter !== 'all') {
        filteredResults = filteredResults.filter(item =>
          item.category.toLowerCase().includes(filter) ||
          item.sport?.toLowerCase().includes(filter)
        );
      }

      setResults(filteredResults);
      setIsLoading(false);
      onSearchResults?.(filteredResults);
    }, 300);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 0) {
      setIsOpen(true);
      performSearch(value);
    } else {
      setIsOpen(false);
      setResults([]);
    }
  };

  // Handle filter change
  const handleFilterChange = (filterId: string) => {
    setSelectedFilter(filterId);
    if (query) {
      performSearch(query, filterId);
    }
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(price);
  };

  return (
    <div ref={searchRef} className={cn("relative w-full max-w-lg", className)}>
      {/* Search Input */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-apex-red focus:border-transparent transition-all duration-200 text-sm text-gray-900 placeholder:text-gray-500"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Pills */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 mt-3">
          {filterOptions.map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleFilterChange(filter.id)}
              className={cn(
                "flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                selectedFilter === filter.id
                  ? "bg-apex-red text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {filter.icon}
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="animate-spin h-6 w-6 border-2 border-apex-red border-t-transparent rounded-full mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result, index) => (
                <div
                  key={result.id}
                  className="flex items-center space-x-4 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer group"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: 'fadeInUp 0.3s ease-out forwards'
                  }}
                >
                  {/* Result Icon */}
                  <div className="flex-shrink-0">
                    {result.type === 'product' ? (
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                        {result.category === 'Protein' && <Dumbbell className="h-5 w-5 text-blue-600" />}
                        {result.category === 'Pre-Workout' && <Zap className="h-5 w-5 text-yellow-600" />}
                        {result.category === 'Recovery' && <Heart className="h-5 w-5 text-green-600" />}
                        {result.category === 'Weight Loss' && <Flame className="h-5 w-5 text-orange-600" />}
                        {result.category === 'Performance' && <Trophy className="h-5 w-5 text-purple-600" />}
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-apex-red to-red-600 rounded-lg flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Result Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 group-hover:text-apex-red transition-colors">
                        {result.title}
                      </h4>
                      {result.type === 'product' && (
                        <span className="text-sm font-bold text-apex-red">
                          {formatPrice(result.price)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {result.category}
                      </span>
                      {result.sport && (
                        <span className="text-xs px-2 py-1 bg-apex-red/10 text-apex-red rounded-full">
                          {result.sport}
                        </span>
                      )}
                    </div>
                    {result.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {result.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* View All Results */}
              <div className="border-t border-gray-100 px-4 py-3">
                <Button
                  className="w-full"
                  size="sm"
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to search results page
                  }}
                >
                  View All {results.length} Results
                </Button>
              </div>
            </div>
          ) : query ? (
            <div className="p-4 text-center">
              <SearchIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No results found for "{query}"</p>
              <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Search;