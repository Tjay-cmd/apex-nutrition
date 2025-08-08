import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Zap, Star } from 'lucide-react';
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
    return products
      .filter((product: any) => product.status === 'active' && product.featured)
      .map((product: any) => ({
        id: product.id,
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        category: product.category || '',
        status: product.status || 'inactive',
        featured: product.featured || false,
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

          {/* Trust Indicators */}
          <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-10 md:p-12">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center mb-5">
                <div className="w-12 h-1 rounded-full bg-gradient-to-r from-[#e11d48] to-black mr-4" />
                <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                  Trust & Quality Assurance
                </h3>
                <div className="w-12 h-1 rounded-full bg-gradient-to-r from-[#e11d48] to-black ml-4" />
              </div>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Our commitment to excellence is backed by industry‑leading certifications and partnerships
              </p>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
              {[
                { code: 'GMP', title: 'GMP Certified', caption: 'Manufacturing' },
                { code: 'NSF', title: 'NSF Certified', caption: 'Quality Assurance' },
                { code: 'WADA', title: 'WADA Compliant', caption: 'Anti-Doping' },
                { code: 'ISO', title: 'ISO 9001', caption: 'Quality Management' },
              ].map((item) => (
                <div key={item.code} className="text-center">
                  <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-[#e11d48] to-black text-white flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full animate-shine" />
                    </div>
                    <span className="relative z-10 font-bold text-xs md:text-sm">{item.code}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.caption}</p>
                </div>
              ))}
            </div>
          </div>
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