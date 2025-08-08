"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Target, Zap, Heart, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  productCount: number;
  color: string;
  gradient: string;
}

const categories: Category[] = [
  {
    id: 'protein',
    name: 'Protein',
    description: 'Premium whey isolates and plant-based proteins for muscle growth and recovery',
    icon: <Target className="h-6 w-6" />,
    productCount: 0,
    color: 'from-apex-red to-red-600',
    gradient: 'bg-gradient-to-r from-apex-red to-red-600'
  },
  {
    id: 'pre-workout',
    name: 'Pre-Workout',
    description: 'Energy boosters and performance enhancers for maximum workout intensity',
    icon: <Zap className="h-6 w-6" />,
    productCount: 0,
    color: 'from-apex-gold to-yellow-500',
    gradient: 'bg-gradient-to-r from-apex-gold to-yellow-500'
  },
  {
    id: 'recovery',
    name: 'Recovery',
    description: 'Post-workout recovery and muscle repair supplements for optimal healing',
    icon: <Heart className="h-6 w-6" />,
    productCount: 0,
    color: 'from-gray-500 to-gray-700',
    gradient: 'bg-gradient-to-r from-gray-500 to-gray-700'
  },
  {
    id: 'vitamins',
    name: 'Vitamins',
    description: 'Essential vitamins and minerals to support overall health and performance',
    icon: <Shield className="h-6 w-6" />,
    productCount: 0,
    color: 'from-orange-500 to-orange-600',
    gradient: 'bg-gradient-to-r from-orange-500 to-orange-600'
  }
];

const CategoryShowcase = () => {
  const [animatedCounters, setAnimatedCounters] = useState<{ [key: string]: number }>({});
  const [isVisible, setIsVisible] = useState(false);

  // Animate counters when component becomes visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Animate counters with sample data
          categories.forEach((category, index) => {
            setTimeout(() => {
              setAnimatedCounters(prev => ({
                ...prev,
                [category.id]: Math.floor(Math.random() * 5) + 1 // Random product count for demo
              }));
            }, index * 200);
          });
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('category-showcase');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="category-showcase" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our premium supplements organized by your specific needs and goals
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.id}`}
              className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:border-gray-300/50 transition-all duration-300 hover:shadow-2xl hover:shadow-gray-500/10 hover:-translate-y-2"
            >
              <div className={`absolute inset-0 ${category.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
              <div className="relative p-6">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${category.gradient} text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg border-2 border-white/20`}>
                  {category.icon}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {category.name}
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-apex-red">
                    {isVisible ? animatedCounters[category.id] || 0 : 0}
                  </span>
                  <span className="text-sm text-gray-500">Products</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Shop All Button */}
        <div className="text-center">
          <Button
            asChild
            className="bg-gradient-to-r from-apex-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-8 rounded-xl text-lg shadow-xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
          >
            <Link href="/shop">
              Shop All Products
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;