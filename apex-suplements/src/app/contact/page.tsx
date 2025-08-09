"use client";

import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  User,
  Building,
  Trophy,
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    message: '',
    priority: 'standard'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        category: '',
        message: '',
        priority: 'standard'
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-apex-red via-red-800 to-black text-white py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Light shine effect overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full animate-shine"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold mb-8 leading-tight">
              Contact Us
            </h1>
            <p className="text-lg lg:text-xl xl:text-2xl max-w-4xl mx-auto leading-relaxed opacity-95">
              Get expert advice from Prof. Dr. Du Toit Loots and our team of sports nutrition specialists.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

            {/* Contact Details */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Get in Touch
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Whether you're an elite athlete seeking personalized nutrition advice or a customer with product questions, our expert team is here to help.
                </p>
              </div>

              {/* Contact Methods */}
              <div className="space-y-6">
                                 {/* Phone */}
                 <div className="flex items-start space-x-4">
                   <div className="w-12 h-12 bg-gradient-to-br from-apex-red via-red-800 to-black rounded-full flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full animate-shine"></div>
                     <Phone className="h-6 w-6 text-white relative z-10" />
                   </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone & WhatsApp</h3>
                    <p className="text-gray-700 mb-1">+27 82 940 2436</p>
                    <p className="text-sm text-gray-600">Available during business hours</p>
                  </div>
                </div>

                                 {/* Email */}
                 <div className="flex items-start space-x-4">
                   <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 via-yellow-800 to-black rounded-full flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full animate-shine"></div>
                     <Mail className="h-6 w-6 text-white relative z-10" />
                   </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                    <p className="text-gray-700 mb-1">info@apexnutrition.co.za</p>
                    <p className="text-sm text-gray-600">We respond within 24 hours</p>
                  </div>
                </div>

                                 {/* Address */}
                 <div className="flex items-start space-x-4">
                   <div className="w-12 h-12 bg-gradient-to-br from-gray-700 via-gray-900 to-black rounded-full flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full animate-shine"></div>
                     <MapPin className="h-6 w-6 text-white relative z-10" />
                   </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Office Address</h3>
                    <p className="text-gray-700 mb-1">16 Esselen Street</p>
                    <p className="text-gray-700 mb-1">Potchefstroom, South Africa, 2531</p>
                    <p className="text-sm text-gray-600">VAT: 4870282888</p>
                  </div>
                </div>

                                 {/* Hours */}
                 <div className="flex items-start space-x-4">
                   <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-orange-800 to-black rounded-full flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full animate-shine"></div>
                     <Clock className="h-6 w-6 text-white relative z-10" />
                   </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Hours</h3>
                    <p className="text-gray-700 mb-1">Monday - Friday</p>
                    <p className="text-gray-700 mb-1">12:00 PM - 2:30 PM SAST</p>
                    <p className="text-sm text-gray-600">Extended hours for athletes</p>
                  </div>
                </div>
              </div>

                             {/* Emergency Contact */}
               <div className="bg-gradient-to-br from-apex-red via-red-800 to-black rounded-2xl p-6 text-white relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full animate-shine"></div>
                 <div className="relative z-10">
                   <div className="flex items-center space-x-3 mb-4">
                     <Trophy className="h-6 w-6" />
                     <h3 className="text-lg font-semibold">24/7 Athlete Support</h3>
                   </div>
                   <p className="text-white/90 mb-4">
                     Elite athletes can access emergency support for competition-related inquiries and urgent nutrition advice.
                   </p>
                   <Button className="bg-white text-apex-red hover:bg-gray-100">
                     <Phone className="h-4 w-4 mr-2" />
                     Emergency Hotline
                   </Button>
                 </div>
               </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
                             <div className="text-center mb-8">
                 <div className="w-16 h-16 bg-gradient-to-br from-apex-red via-red-800 to-black rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full animate-shine"></div>
                   <MessageCircle className="h-8 w-8 text-white relative z-10" />
                 </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h3>
                <p className="text-gray-600">We'll get back to you within 24 hours</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-apex-red focus:border-transparent transition-all duration-300"
                    placeholder="Your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-apex-red focus:border-transparent transition-all duration-300"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-apex-red focus:border-transparent transition-all duration-300"
                    placeholder="+27 82 940 2436"
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Inquiry Type *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-apex-red focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select inquiry type</option>
                    <option value="product">Product Inquiry</option>
                    <option value="order">Order Support</option>
                    <option value="athlete">Athlete Consultation</option>
                    <option value="technical">Technical Support</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="business">Business Inquiry</option>
                    <option value="media">Media Inquiry</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-apex-red focus:border-transparent transition-all duration-300"
                  >
                    <option value="standard">Standard</option>
                    <option value="urgent">Urgent</option>
                    <option value="vip">VIP Athlete</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-apex-red focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                {/* Submit Button */}
                                 <Button
                   type="submit"
                   disabled={isSubmitting}
                   className="w-full bg-gradient-to-r from-apex-red via-red-800 to-black hover:from-apex-red hover:via-red-700 hover:to-black text-white py-4 text-lg font-semibold rounded-xl transition-all duration-300 relative overflow-hidden"
                 >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Send className="h-5 w-5 mr-2" />
                      Send Message
                    </div>
                  )}
                </Button>

                {/* Success/Error Messages */}
                {submitStatus === 'success' && (
                  <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-4 rounded-xl">
                    <CheckCircle className="h-5 w-5" />
                    <span>Message sent successfully! We'll get back to you soon.</span>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-xl">
                    <AlertCircle className="h-5 w-5" />
                    <span>Something went wrong. Please try again.</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Team Contact Directory */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6">
              Meet Our Team
            </h2>
            <p className="text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto">
              Connect with the right person for your specific needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                         {/* Prof. Dr. Loots */}
             <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
               <div className="w-16 h-16 bg-gradient-to-br from-apex-red via-red-800 to-black rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full animate-shine"></div>
                 <User className="h-8 w-8 text-white relative z-10" />
               </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Prof. Dr. Du Toit Loots</h3>
              <p className="text-gray-600 text-sm mb-4">Founder & Chief Formulator</p>
              <p className="text-gray-700 text-sm mb-4">
                Scientific consultation and athlete support
              </p>
              <Button className="w-full bg-apex-red hover:bg-red-700 text-white">
                <Mail className="h-4 w-4 mr-2" />
                Contact Prof. Loots
              </Button>
            </div>

                         {/* Customer Support */}
             <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
               <div className="w-16 h-16 bg-gradient-to-br from-apex-red via-red-800 to-black rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full animate-shine"></div>
                 <MessageCircle className="h-8 w-8 text-white relative z-10" />
               </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Support</h3>
              <p className="text-gray-600 text-sm mb-4">General inquiries and orders</p>
              <p className="text-gray-700 text-sm mb-4">
                Product questions and order management
              </p>
                             <Button className="w-full bg-gradient-to-r from-apex-red via-red-800 to-black hover:from-apex-red hover:via-red-700 hover:to-black text-white">
                 <Phone className="h-4 w-4 mr-2" />
                 Get Support
               </Button>
            </div>

                         {/* Technical Support */}
             <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
               <div className="w-16 h-16 bg-gradient-to-br from-apex-red via-red-800 to-black rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full animate-shine"></div>
                 <Trophy className="h-8 w-8 text-white relative z-10" />
               </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Technical Support</h3>
              <p className="text-gray-600 text-sm mb-4">Product usage and drug testing</p>
              <p className="text-gray-700 text-sm mb-4">
                Dosage guidance and competition support
              </p>
                             <Button className="w-full bg-gradient-to-r from-apex-red via-red-800 to-black hover:from-apex-red hover:via-red-700 hover:to-black text-white">
                 <MessageCircle className="h-4 w-4 mr-2" />
                 Technical Help
               </Button>
            </div>

                         {/* Business Development */}
             <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
               <div className="w-16 h-16 bg-gradient-to-br from-apex-red via-red-800 to-black rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full animate-shine"></div>
                 <Building className="h-8 w-8 text-white relative z-10" />
               </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Development</h3>
              <p className="text-gray-600 text-sm mb-4">Partnerships and wholesale</p>
              <p className="text-gray-700 text-sm mb-4">
                Team sponsorships and retail opportunities
              </p>
                             <Button className="w-full bg-gradient-to-r from-apex-red via-red-800 to-black hover:from-apex-red hover:via-red-700 hover:to-black text-white">
                 <Mail className="h-4 w-4 mr-2" />
                 Business Inquiry
               </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto">
              Quick answers to common questions about our products and services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How do I track my order?</h3>
              <p className="text-gray-700">
                You'll receive a tracking number via email once your order ships. You can also check your order status in your account dashboard.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What's your return policy?</h3>
              <p className="text-gray-700">
                We offer a 30-day return policy for unopened products. Contact our customer support team to initiate a return.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Do you ship internationally?</h3>
              <p className="text-gray-700">
                Yes, we ship to most countries worldwide. Shipping times and costs vary by location.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Are your products drug-tested?</h3>
              <p className="text-gray-700">
                All Apex products are formulated to prevent cross-contamination and are safe for drug-tested athletes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}