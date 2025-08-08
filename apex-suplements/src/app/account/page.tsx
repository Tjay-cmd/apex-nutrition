"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/firebase-auth-context';
import { User, Package, Heart, Settings, LogOut, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AccountPage() {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">Please sign in to access your account.</p>
          <Link href="/auth/login">
            <Button className="bg-apex-red hover:bg-red-600">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
            <p className="text-gray-600">Welcome back, {user.first_name || user.email}</p>
          </div>

          {/* User Info Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-apex-red/10 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-apex-red" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {user.first_name && user.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : 'User'
                  }
                </h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500">Member since {new Date(user.created_at).toLocaleDateString()}</p>
              </div>
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link href="/account/orders" className="group">
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-apex-red transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">My Orders</h3>
                <p className="text-gray-600 text-sm">Track your orders and view order history</p>
              </div>
            </Link>

            <Link href="/account/wishlist" className="group">
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Heart className="h-6 w-6 text-red-600" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-apex-red transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Wishlist</h3>
                <p className="text-gray-600 text-sm">View your saved products</p>
              </div>
            </Link>

            <Link href="/account/settings" className="group">
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Settings className="h-6 w-6 text-gray-600" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-apex-red transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Settings</h3>
                <p className="text-gray-600 text-sm">Manage your account preferences</p>
              </div>
            </Link>

            <Link href="/cart" className="group">
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-green-600" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-apex-red transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Shopping Cart</h3>
                <p className="text-gray-600 text-sm">View your cart and checkout</p>
              </div>
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-apex-red/10 rounded-full flex items-center justify-center">
                  <Package className="h-5 w-5 text-apex-red" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Welcome to Apex Nutrition!</p>
                  <p className="text-sm text-gray-600">Your account has been created successfully.</p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="text-center py-8">
                <p className="text-gray-500">No recent activity to show</p>
                <p className="text-sm text-gray-400 mt-2">Your recent orders and activities will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}