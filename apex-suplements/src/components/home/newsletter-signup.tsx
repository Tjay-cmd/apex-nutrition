"use client";

import React, { useState } from 'react';
import { Mail, Gift, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
      setEmail('');
    }, 1000);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-apex-red via-red-600 to-red-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Section Header */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/20 w-12 h-1 rounded-full mr-4"></div>
              <Mail className="h-6 w-6 text-white" />
              <div className="bg-white/20 w-12 h-1 rounded-full ml-4"></div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Stay Ahead of the Game
            </h2>
            <p className="text-xl text-red-100 max-w-3xl mx-auto">
              Get exclusive access to new products, athlete insights, and special offers before anyone else
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Exclusive Discounts
              </h3>
              <p className="text-red-100 text-sm">
                Be the first to know about sales and get member-only pricing
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Early Access
              </h3>
              <p className="text-red-100 text-sm">
                Try new products before they hit the shelves
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Expert Tips
              </h3>
              <p className="text-red-100 text-sm">
                Nutrition advice and training tips from our athletes
              </p>
            </div>
          </div>

          {/* Signup Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-white/20">
            {!isSubmitted ? (
              <>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Join Our Community
                  </h3>
                  <p className="text-red-100 text-lg mb-6">
                    Subscribe today and get <span className="font-bold text-white">15% OFF</span> your first order!
                  </p>
                  <div className="bg-white/20 rounded-2xl p-6 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Gift className="h-5 w-5 text-white" />
                      <span className="text-white font-semibold">Welcome Gift</span>
                    </div>
                    <p className="text-red-100 text-sm">
                      New subscribers get 15% off their first purchase + free shipping on orders over R500
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="flex-1 px-6 py-4 rounded-xl border-2 border-white/30 bg-white/10 text-white placeholder-red-200 focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all duration-300"
                      required
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || !email}
                      className="bg-white text-apex-red hover:bg-gray-100 font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-apex-red border-t-transparent rounded-full animate-spin"></div>
                          Subscribing...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          Subscribe
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      )}
                    </Button>
                  </div>
                  
                  <p className="text-red-100 text-xs">
                    By subscribing, you agree to receive marketing emails from Apex Nutrition. 
                    You can unsubscribe at any time.
                  </p>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Welcome to the Apex Family!
                </h3>
                <p className="text-red-100 text-lg mb-6">
                  Your 15% discount code has been sent to your email. 
                  Check your inbox for exclusive offers and updates!
                </p>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  className="bg-white text-apex-red hover:bg-gray-100 font-bold py-3 px-6 rounded-xl"
                >
                  Subscribe Another Email
                </Button>
              </div>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="mt-12">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-red-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">No spam, ever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Unsubscribe anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Secure & private</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup; 