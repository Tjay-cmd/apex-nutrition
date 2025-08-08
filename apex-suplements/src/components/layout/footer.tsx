import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <div className="bg-apex-red w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <h3 className="text-2xl font-bold">APEX NUTRITION</h3>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Premium supplements trusted by elite athletes worldwide.
                Scientifically formulated for maximum performance and recovery.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="bg-gray-800 hover:bg-apex-red p-3 rounded-full transition-colors duration-300">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="bg-gray-800 hover:bg-apex-red p-3 rounded-full transition-colors duration-300">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="bg-gray-800 hover:bg-apex-red p-3 rounded-full transition-colors duration-300">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="bg-gray-800 hover:bg-apex-red p-3 rounded-full transition-colors duration-300">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/shop" className="text-gray-300 hover:text-white transition-colors duration-300">
                    Shop All Products
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=protein" className="text-gray-300 hover:text-white transition-colors duration-300">
                    Protein Supplements
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=pre-workout" className="text-gray-300 hover:text-white transition-colors duration-300">
                    Pre-Workout
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=recovery" className="text-gray-300 hover:text-white transition-colors duration-300">
                    Recovery Supplements
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=vitamins" className="text-gray-300 hover:text-white transition-colors duration-300">
                    Vitamins & Minerals
                  </Link>
                </li>
                <li>
                  <Link href="/athletes" className="text-gray-300 hover:text-white transition-colors duration-300">
                    Our Athletes
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Company</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-white transition-colors duration-300">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-white transition-colors duration-300">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-300 hover:text-white transition-colors duration-300">
                    Blog & News
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-300 hover:text-white transition-colors duration-300">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/partnerships" className="text-gray-300 hover:text-white transition-colors duration-300">
                    Partnerships
                  </Link>
                </li>
                <li>
                  <Link href="/quality" className="text-gray-300 hover:text-white transition-colors duration-300">
                    Quality & Testing
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Support</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/help" className="text-gray-300 hover:text-white transition-colors duration-300">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="text-gray-300 hover:text-white transition-colors duration-300">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-gray-300 hover:text-white transition-colors duration-300">
                    Returns & Exchanges
                  </Link>
                </li>
                <li>
                  <Link href="/size-guide" className="text-gray-300 hover:text-white transition-colors duration-300">
                    Size Guide
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-300 hover:text-white transition-colors duration-300">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-white transition-colors duration-300">
                    Contact Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact & Newsletter */}
        <div className="border-t border-gray-800 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Get in Touch</h4>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-apex-red mr-3" />
                  <span className="text-gray-300">info@apexnutrition.co.za</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-apex-red mr-3" />
                  <span className="text-gray-300">+27 (0) 11 123 4567</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-apex-red mr-3" />
                  <span className="text-gray-300">Johannesburg, South Africa</span>
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Stay Updated</h4>
              <p className="text-gray-300 mb-4">
                Subscribe to get the latest updates, exclusive offers, and athlete insights.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-apex-red"
                />
                <button className="bg-apex-red hover:bg-red-700 px-6 py-3 rounded-r-lg font-semibold transition-colors duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Apex Nutrition. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors duration-300">
                Cookie Policy
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors duration-300">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;