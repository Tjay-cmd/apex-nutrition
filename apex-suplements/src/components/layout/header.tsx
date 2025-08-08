"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Menu,
  X,
  ShoppingBag,
  User,
  LogOut,
  Settings,
  Heart,
  Package,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/firebase-auth-context';
import { useCart } from '@/contexts/cart-context';
import { formatZAR } from '@/lib/firebase-queries';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { totalItems, total } = useCart();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-black text-white text-center py-2 px-4 text-xs font-medium relative">
        <span>📦 FREE SHIPPING R500+ | 🏉 OFFICIAL PARTNER: LEOPARDS RUGBY</span>
        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white text-sm"
          onClick={() => {/* Hide banner logic */}}
          aria-label="Close banner"
        >
          ×
        </button>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
              <div className="relative w-9 h-9 lg:w-11 lg:h-11">
                <Image
                  src="/Logo.png"
                  alt="Apex Nutrition Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg lg:text-xl font-bold text-gray-900">APEX</span>
                <span className="block text-xs text-gray-600 -mt-0.5">NUTRITION</span>
              </div>
            </Link>

            {/* Navigation Links - Desktop */}
            <nav className="hidden lg:flex items-center space-x-10 flex-1 justify-center">
              <Link href="/" className="text-gray-700 hover:text-apex-red transition-colors font-medium">
                Home
              </Link>
              <Link href="/shop" className="text-gray-700 hover:text-apex-red transition-colors font-medium">
                Shop
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-apex-red transition-colors font-medium">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-apex-red transition-colors font-medium">
                Contact
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-3 lg:space-x-4">

              {/* User Account */}
              {user ? (
                <div className="relative group">
                  <button className="p-2 text-gray-700 hover:text-apex-red transition-colors">
                    <User className="h-5 w-5 lg:h-6 lg:w-6" />
                  </button>

                  {/* User Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user.first_name || user.email}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>

                      <Link href="/account" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <User className="h-4 w-4 mr-3" />
                        My Account
                      </Link>

                      <Link href="/account/orders" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Package className="h-4 w-4 mr-3" />
                        My Orders
                      </Link>

                      <Link href="/account/wishlist" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Heart className="h-4 w-4 mr-3" />
                        Wishlist
                      </Link>

                      <Link href="/account/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </Link>

                      {(user.role === 'admin' || user.role === 'super_admin') && (
                        <Link href="/admin" className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-blue-50">
                          <Shield className="h-4 w-4 mr-3" />
                          Admin Panel
                        </Link>
                      )}

                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden lg:flex items-center space-x-4">
                  <Link href="/auth/login" className="text-gray-700 hover:text-apex-red transition-colors font-medium">
                    Sign In
                  </Link>
                  <Link href="/auth/register" className="bg-apex-red hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Cart */}
              <Link href="/cart" className="flex items-center space-x-2 lg:space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="relative">
                  <ShoppingBag className="h-5 w-5 lg:h-6 lg:w-6 text-gray-700" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 bg-apex-red text-white text-xs rounded-full h-4 w-4 lg:h-5 lg:w-5 flex items-center justify-center font-medium">
                      {totalItems}
                    </span>
                  )}
                </div>
                <div className="hidden lg:block text-right">
                  <div className="text-xs text-gray-500">Your Cart</div>
                  <div className="font-bold text-gray-900 text-sm">{formatZAR(total)}</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-6 space-y-6">

              {/* Mobile Navigation */}
              <nav className="space-y-1">
                <div className="font-medium text-gray-900 mb-3">Navigation</div>
                <Link
                  href="/"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/shop"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Shop
                </Link>
                <Link
                  href="/about"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </nav>

              {/* Mobile Auth */}
              {user ? (
                <div className="pt-4 border-t border-gray-200">
                  <div className="space-y-2">
                    <div className="text-sm text-gray-500">Signed in as</div>
                    <div className="font-medium text-gray-900">{user.email}</div>
                    <div className="space-y-1">
                      <Link
                        href="/account"
                        className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Account
                      </Link>
                      <Link
                        href="/account/orders"
                        className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      {(user.role === 'admin' || user.role === 'super_admin') && (
                        <Link
                          href="/admin"
                          className="block px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200">
                  <div className="space-y-3">
                    <Link
                      href="/auth/login"
                      className="block w-full text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/register"
                      className="block w-full text-center px-4 py-2 bg-apex-red text-white rounded-lg hover:bg-red-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              )}

              {/* Mobile Cart Info */}
              <div className="pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Cart Total</div>
                  <div className="font-bold text-gray-900 text-lg">{formatZAR(total)}</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </header>
    </>
  );
};

export default Header;