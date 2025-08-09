import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Zap, Star, BadgeCheck, Award as AwardIcon, ScrollText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getFeaturedProducts, formatZAR } from '@/lib/firebase-queries';
import HeroSlideshow from '@/components/home/hero-slideshow';
import ProductQuiz from '@/components/home/product-quiz';
import FeaturedProducts from '@/components/home/featured-products';
import AthletePartnerships from '@/components/home/athlete-partnerships';
import TrustSocialProof from '@/components/home/trust-social-proof';
import NewsletterSignup from '@/components/home/newsletter-signup';
import Footer from '@/components/layout/footer';

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

// Server Component to fetch featured products
async function getFeaturedProductsData(): Promise<Product[]> {
  try {
    const products = await getFeaturedProducts();
    // Backend already filters by featured; do not drop items if status is missing
    return products.map((product: any) => ({
        id: product.id,
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        category: product.category || '',
        status: product.status || 'active',
        featured: product.featured || true,
        stock: product.stock || 0,
        image_url: product.image_url
      })) as Product[];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProductsData();

  return (
    <div className="min-h-screen">
      {/* Hero Section with Dynamic Slideshow */}
      <HeroSlideshow />

      {/* Product Quiz */}
      <ProductQuiz />

      {/* Why Choose Apex Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Apex Nutrition?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We&apos;re committed to providing the highest quality supplements backed by science and trusted by athletes worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="text-center group">
              <div className="bg-apex-red/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-apex-red" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Premium Quality
              </h3>
              <p className="text-gray-600">
                All our products are manufactured in GMP-certified facilities using the highest quality ingredients and rigorous testing protocols.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-apex-red/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-8 w-8 text-apex-red" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Scientifically Formulated
              </h3>
              <p className="text-gray-600">
                Our formulas are backed by scientific research and designed for optimal absorption, effectiveness, and safety.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-apex-red/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Star className="h-8 w-8 text-apex-red" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Athlete Trusted
              </h3>
              <p className="text-gray-600">
                Trusted by professional athletes and fitness enthusiasts worldwide for their performance and recovery needs.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-apex-red/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-apex-red" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Third-Party Tested
              </h3>
              <p className="text-gray-600">
                Every batch is independently tested for purity, potency, and banned substances to ensure the highest standards.
              </p>
            </div>
          </div>

          {/* Trimmed: removed duplicate trust badge section to reduce clutter */}
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedProducts products={featuredProducts} />

      {/* Athlete Partnerships */}
      <AthletePartnerships />

      {/* Trust & Social Proof */}
      <TrustSocialProof />

      {/* Newsletter Signup */}
      <NewsletterSignup />

      {/* Footer */}
      <Footer />
    </div>
  );
}