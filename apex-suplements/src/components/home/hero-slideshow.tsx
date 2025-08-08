"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  theme: 'dark' | 'light';
  textPosition: 'left' | 'center' | 'right';
  textAlignment: 'left' | 'center' | 'right';
}

const slides: Slide[] = [
  {
    id: 1,
    image: '/slideshow/pexels-victorfreitas-949129.jpg',
    title: 'Premium Protein',
    subtitle: 'Whey Isolate',
    description: 'Pure, fast-absorbing protein for maximum muscle growth and recovery. Trusted by professional athletes worldwide.',
    ctaText: 'Shop Protein',
    ctaLink: '/shop?category=protein',
    theme: 'dark',
    textPosition: 'left',
    textAlignment: 'left'
  },
  {
    id: 2,
    image: '/slideshow/pexels-andi-farruku-3345901-32974844.jpg',
    title: 'Pre-Workout Power',
    subtitle: 'Energy & Focus',
    description: 'Advanced formula designed to boost energy, enhance focus, and maximize your workout performance.',
    ctaText: 'Shop Pre-Workout',
    ctaLink: '/shop?category=pre-workout',
    theme: 'light',
    textPosition: 'right',
    textAlignment: 'right'
  },
  {
    id: 3,
    image: '/slideshow/pexels-hassan-omar-wamwayi-2973552-12742571.jpg',
    title: 'Recovery Essentials',
    subtitle: 'Post-Workout',
    description: 'Complete recovery support with essential amino acids and nutrients to rebuild and repair muscle tissue.',
    ctaText: 'Shop Recovery',
    ctaLink: '/shop?category=recovery',
    theme: 'dark',
    textPosition: 'left',
    textAlignment: 'left'
  },
  {
    id: 4,
    image: '/slideshow/pexels-olly-3764011.jpg',
    title: 'Elite Performance',
    subtitle: 'Trusted by Champions',
    description: 'Join thousands of athletes who trust Apex Nutrition for their performance and recovery needs.',
    ctaText: 'Meet Our Athletes',
    ctaLink: '/athletes',
    theme: 'light',
    textPosition: 'right',
    textAlignment: 'right'
  }
];

const HeroSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-rotation only
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsAnimating(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className={`grid lg:grid-cols-2 gap-12 items-center ${
            currentSlideData.textPosition === 'center' ? 'justify-items-center' :
            currentSlideData.textPosition === 'right' ? 'justify-items-end' : ''
          }`}>
            {/* Text Content */}
            <div className={`text-white space-y-8 ${
              currentSlideData.textAlignment === 'center' ? 'text-center' :
              currentSlideData.textAlignment === 'right' ? 'text-right' : 'text-left'
            } ${currentSlideData.textPosition === 'right' ? 'lg:col-start-2' : ''}`}>
              <div className="space-y-6">
                <h1 className={`text-5xl lg:text-7xl font-bold leading-tight transition-all duration-700 ease-out ${
                  isAnimating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
                }`}>
                  {currentSlideData.title}
                  <span className={`block text-apex-red transition-all duration-700 ease-out delay-200 ${
                    isAnimating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
                  }`}>
                    {currentSlideData.subtitle}
                  </span>
                </h1>
                <p className={`text-xl lg:text-2xl text-gray-200 max-w-2xl leading-relaxed transition-all duration-700 ease-out delay-300 ${
                  isAnimating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
                }`}>
                  {currentSlideData.description}
                </p>
              </div>

              {/* Premium CTA Button */}
              <div className={`pt-4 transition-all duration-700 ease-out delay-500 ${
                isAnimating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
              }`}>
                <Button
                  asChild
                  className="bg-gradient-to-r from-apex-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-5 px-10 rounded-2xl text-lg shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105 border-0"
                >
                  <Link href={currentSlideData.ctaLink}>
                    {currentSlideData.ctaText}
                  </Link>
                </Button>
              </div>

              {/* Trust Signals */}
              <div className={`flex items-center space-x-6 text-white/80 transition-all duration-700 ease-out delay-700 ${
                currentSlideData.textAlignment === 'center' ? 'justify-center' :
                currentSlideData.textAlignment === 'right' ? 'justify-end' : 'justify-start'
              } ${isAnimating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
                <div className="flex items-center space-x-2 transition-all duration-300 hover:scale-105">
                  <Shield className="h-5 w-5 text-apex-red" />
                  <span className="text-sm font-medium">Authentic</span>
                </div>
                <div className="flex items-center space-x-2 transition-all duration-300 hover:scale-105">
                  <Zap className="h-5 w-5 text-apex-red" />
                  <span className="text-sm font-medium">Premium Quality</span>
                </div>
                <div className="flex items-center space-x-2 transition-all duration-300 hover:scale-105">
                  <Star className="h-5 w-5 text-apex-red" />
                  <span className="text-sm font-medium">Athlete Trusted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlideshow;