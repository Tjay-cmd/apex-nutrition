"use client";

import React, { useState, useEffect } from 'react';
import { Star, Quote, Award, Shield, CheckCircle, Users, TrendingUp } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  content: string;
  avatar: string;
}

interface Certification {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'David Mkhize',
    role: 'Professional Rugby Player',
    rating: 5,
    content: 'Apex Nutrition has transformed my performance on the field. Their pre-workout supplements give me the energy I need, and their recovery products help me bounce back faster after intense matches.',
    avatar: '/testimonials/rugby-player.jpg'
  },
  {
    id: '2',
    name: 'Sarah van der Merwe',
    role: 'CrossFit Coach',
    rating: 5,
    content: 'I\'ve been using Apex supplements for over 2 years now. The quality is exceptional, and my clients love the results they get. The protein powders are the best I\'ve ever tried.',
    avatar: '/testimonials/crossfit-coach.jpg'
  },
  {
    id: '3',
    name: 'Mike Botha',
    role: 'Bodybuilding Champion',
    rating: 5,
    content: 'As a competitive bodybuilder, I need supplements I can trust. Apex Nutrition delivers consistently high-quality products that support my training and competition goals.',
    avatar: '/testimonials/bodybuilder.jpg'
  },
  {
    id: '4',
    name: 'Lisa Pretorius',
    role: 'Marathon Runner',
    rating: 5,
    content: 'Training for marathons requires serious nutrition support. Apex\'s endurance supplements have been crucial for my long-distance training and race day performance.',
    avatar: '/testimonials/marathon-runner.jpg'
  }
];

const certifications: Certification[] = [
  {
    id: '1',
    name: 'GMP Certified',
    description: 'Good Manufacturing Practice certified facilities ensuring highest quality standards',
    icon: <Shield className="h-6 w-6" />,
    color: 'from-green-500 to-green-600'
  },
  {
    id: '2',
    name: 'NSF Certified',
    description: 'National Sanitation Foundation certified for quality and safety assurance',
    icon: <CheckCircle className="h-6 w-6" />,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: '3',
    name: 'WADA Compliant',
    description: 'World Anti-Doping Agency compliant for clean sport certification',
    icon: <Award className="h-6 w-6" />,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: '4',
    name: 'ISO 9001',
    description: 'International Organization for Standardization quality management certified',
    icon: <Star className="h-6 w-6" />,
    color: 'from-orange-500 to-orange-600'
  }
];

const TrustSocialProof = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('trust-social-proof');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <section id="trust-social-proof" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-apex-red to-red-600 w-12 h-1 rounded-full mr-4"></div>
            <Award className="h-6 w-6 text-apex-red" />
            <div className="bg-gradient-to-r from-apex-red to-red-600 w-12 h-1 rounded-full ml-4"></div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied customers who trust Apex Nutrition for their performance and health goals
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className={`text-4xl font-bold bg-gradient-to-r from-apex-red to-red-600 bg-clip-text text-transparent mb-2 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
              10,000+
            </div>
            <p className="text-gray-600">Happy Customers</p>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold bg-gradient-to-r from-apex-red to-red-600 bg-clip-text text-transparent mb-2 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
              4.9/5
            </div>
            <p className="text-gray-600">Average Rating</p>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold bg-gradient-to-r from-apex-red to-red-600 bg-clip-text text-transparent mb-2 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
              50+
            </div>
            <p className="text-gray-600">Athlete Partners</p>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold bg-gradient-to-r from-apex-red to-red-600 bg-clip-text text-transparent mb-2 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
              15+
            </div>
            <p className="text-gray-600">Years Experience</p>
          </div>
        </div>

                 {/* Testimonials Section */}
         <div className="mb-16">
           <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
             What Our Customers Say
           </h3>

           {/* Featured Testimonial */}
           <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-2xl border border-gray-200/50 mb-8">
             <div className="flex items-center justify-center mb-6">
               <Quote className="h-8 w-8 text-apex-red" />
             </div>
             <div className="text-center mb-8">
               <p className="text-xl lg:text-2xl text-gray-700 italic mb-6 leading-relaxed">
                 "{testimonials[currentTestimonial].content}"
               </p>
               <div className="flex items-center justify-center gap-1 mb-4">
                 {renderStars(testimonials[currentTestimonial].rating)}
               </div>
               <div>
                 <h4 className="text-lg font-semibold text-gray-900">
                   {testimonials[currentTestimonial].name}
                 </h4>
                 <p className="text-gray-600">
                   {testimonials[currentTestimonial].role}
                 </p>
               </div>
             </div>

             {/* Testimonial Navigation Dots */}
             <div className="flex justify-center gap-2">
               {testimonials.map((_, index) => (
                 <button
                   key={index}
                   onClick={() => setCurrentTestimonial(index)}
                   className={`w-3 h-3 rounded-full transition-all duration-300 ${
                     index === currentTestimonial
                       ? 'bg-apex-red scale-125'
                       : 'bg-gray-300 hover:bg-gray-400'
                   }`}
                 />
               ))}
             </div>
           </div>

           {/* Testimonial Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {testimonials.map((testimonial) => (
               <div
                 key={testimonial.id}
                 className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:shadow-lg transition-all duration-300"
               >
                 <div className="flex items-center gap-1 mb-3">
                   {renderStars(testimonial.rating)}
                 </div>
                 <p className="text-sm text-gray-600 mb-4 line-clamp-4">
                   "{testimonial.content}"
                 </p>
                 <div>
                   <h5 className="font-semibold text-gray-900 text-sm">
                     {testimonial.name}
                   </h5>
                   <p className="text-xs text-gray-500">
                     {testimonial.role}
                   </p>
                 </div>
               </div>
             ))}
           </div>
         </div>
      </div>
    </section>
  );
};

export default TrustSocialProof;