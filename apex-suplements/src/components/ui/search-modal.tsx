"use client";

import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Search from './search';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle animation states
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Don't render if not open and not animating
  if (!isOpen && !isAnimating) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-start justify-center p-4 pt-16",
        "transition-all duration-200",
        isOpen
          ? "bg-black/50 backdrop-blur-sm opacity-100"
          : "bg-transparent opacity-0 pointer-events-none"
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className={cn(
          "w-full max-w-2xl bg-white rounded-2xl shadow-2xl",
          "transition-all duration-200",
          isOpen
            ? "scale-100 translate-y-0 opacity-100"
            : "scale-95 -translate-y-4 opacity-0"
        )}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Search Supplements</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Content */}
        <div className="p-6">
          <Search
            placeholder="Search for protein, pre-workout, recovery..."
            showFilters={true}
            className="w-full"
          />

          {/* Popular Searches */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Popular Searches</h3>
            <div className="flex flex-wrap gap-2">
              {[
                'Whey Protein',
                'Pre-Workout',
                'BCAA',
                'Creatine',
                'Fat Burner',
                'Mass Gainer',
                'Rugby Supplements',
                'Post-Workout'
              ].map((term) => (
                <button
                  key={term}
                  className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-apex-red hover:text-white transition-colors"
                  onClick={() => {
                    // Handle popular search click
                    onClose();
                  }}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Categories Quick Access */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Browse Categories</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Protein & Muscle', color: 'blue' },
                { name: 'Pre-Workout', color: 'yellow' },
                { name: 'Recovery', color: 'green' },
                { name: 'Fat Burners', color: 'orange' },
              ].map((category) => (
                <button
                  key={category.name}
                  className={cn(
                    "p-3 rounded-lg text-left text-sm font-medium transition-colors",
                    category.color === 'blue' && "bg-blue-50 text-blue-700 hover:bg-blue-100",
                    category.color === 'yellow' && "bg-yellow-50 text-yellow-700 hover:bg-yellow-100",
                    category.color === 'green' && "bg-green-50 text-green-700 hover:bg-green-100",
                    category.color === 'orange' && "bg-orange-50 text-orange-700 hover:bg-orange-100"
                  )}
                  onClick={() => {
                    // Handle category click
                    onClose();
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;