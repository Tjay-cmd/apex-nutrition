"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  GraduationCap,
  Award,
  TestTube,
  Shield,
  Users,
  Trophy,
  Star,
  CheckCircle,
  ArrowRight,
  Quote,
  Globe,
  BookOpen,
  Microscope,
  Play,
  User,
  Video
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<'about' | 'video'>('about');
  const [mindMapVisible, setMindMapVisible] = useState(false);
  const mindMapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMindMapVisible(true);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the section is visible
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (mindMapRef.current) {
      observer.observe(mindMapRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Set visible by default for better UX
  useEffect(() => {
    setMindMapVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Combined Founder & Video Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 bg-gradient-to-b from-gray-100 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6">
              Meet Our Founder
            </h1>
            <h2 className="text-2xl lg:text-3xl font-semibold text-apex-red mb-4">
              Prof. Dr. Du Toit Loots
            </h2>
            <p className="text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto">
              A world-renowned scientist and competitive athlete who has revolutionized sports nutrition through rigorous scientific research.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-200">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('about')}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === 'about'
                      ? 'bg-apex-red text-white shadow-lg scale-105'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span>About Prof. Loots</span>
                </button>
                <button
                  onClick={() => setActiveTab('video')}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === 'video'
                      ? 'bg-apex-red text-white shadow-lg scale-105'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Video className="h-5 w-5" />
                  <span>Watch Video</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-6xl mx-auto">
            {/* About Tab */}
            <div className={`transition-all duration-500 ease-in-out ${
              activeTab === 'about' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 absolute pointer-events-none'
            }`}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                                 {/* Combined Founder Image & Quote Card */}
                 <div className="flex justify-center lg:justify-start">
                   <div className="relative max-w-lg">
                     <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
                       <div className="flex flex-col lg:flex-row">
                                                   {/* Image Section */}
                          <div className="lg:w-1/2 h-80 lg:h-96">
                            <div className="relative h-full">
                              <Image
                                src="/DuToit_Loots_1.jpg"
                                alt="Prof. Dr. Du Toit Loots - Founder and Chief Formulator of Apex Nutrition"
                                width={300}
                                height={400}
                                className="w-full h-full object-cover"
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px"
                              />
                            </div>
                          </div>

                                                   {/* Quote Section */}
                          <div className="lg:w-1/2 p-6 lg:p-8 bg-gradient-to-br from-gray-100 to-gray-50 h-80 lg:h-96 flex flex-col justify-center">
                            <div className="flex items-start space-x-3 mb-4">
                              <div className="w-10 h-10 bg-white rounded-full border-2 border-apex-red flex items-center justify-center flex-shrink-0">
                                <Quote className="h-5 w-5 text-apex-red" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 text-lg">Prof. Dr. Du Toit Loots</h4>
                              </div>
                            </div>
                            <blockquote className="text-base lg:text-lg italic text-gray-700 leading-relaxed mt-4">
                              &ldquo;Over two decades, no athlete under my direct supervision has tested positive for banned substances. This is due to careful formulation and manufacturing practices that prevent cross-contamination.&rdquo;
                            </blockquote>
                   </div>
                 </div>
               </div>
             </div>
           </div>

                {/* Founder Details */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                About Prof. Dr. Du Toit Loots
              </h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      A world-renowned scientist and competitive athlete, Prof. Dr. Du Toit Loots is the mastermind behind Apex Nutrition&apos;s scientifically formulated supplements. His unique combination of academic excellence and athletic achievement sets Apex apart in the sports nutrition industry.
                    </p>
                  </div>

                  {/* Key Achievements */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center group">
                      <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <GraduationCap className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Academic Excellence</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Ph.D. in Metabolic Biochemistry from North-West University with over 100 scientific publications
              </p>
            </div>

                    <div className="text-center group">
                      <div className="w-16 h-16 bg-apex-red rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <TestTube className="h-8 w-8 text-white" />
                </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Research Leadership</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Leading international metabolomics research program with groundbreaking discoveries
                </p>
              </div>

                    <div className="text-center group">
                                              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Trophy className="h-8 w-8 text-white" />
                        </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Athletic Achievement</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Drug Free Mr Universe Champion with expertise across multiple sports disciplines
                      </p>
                    </div>
                  </div>


                </div>
              </div>
            </div>

            {/* Video Tab */}
            <div className={`transition-all duration-500 ease-in-out ${
              activeTab === 'video' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 absolute pointer-events-none'
            }`}>
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                                      <div className="w-20 h-20 bg-gradient-to-br from-apex-red to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Play className="h-10 w-10 text-white" />
                    </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                    Hear From Our Founder
                  </h3>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Watch Prof. Dr. Du Toit Loots share his vision for Apex Nutrition and the science behind our formulations.
                  </p>
              </div>

                <div className="relative bg-gray-900 rounded-3xl overflow-hidden shadow-2xl">
                  <video
                    className="w-full h-auto"
                    controls
                    preload="metadata"
                  >
                    <source src="/prof_video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>

                <div className="text-center mt-8">
                  <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
                    Discover how Prof. Dr. Loots&apos; unique combination of scientific research and athletic experience has shaped Apex Nutrition&apos;s approach to sports supplementation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



                                         {/* Our Journey Timeline Section */}
        <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-100 via-white to-gray-50 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-10 w-20 h-20 bg-apex-red rounded-full"></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-orange-400 rounded-full"></div>
            <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-yellow-400 rounded-full"></div>
            <div className="absolute bottom-40 right-1/3 w-14 h-14 bg-gray-400 rounded-full"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6">
                Our Journey
              </h2>
              <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
                From humble beginnings to global recognition, discover the milestones that shaped Apex Nutrition&apos;s path to excellence.
              </p>
            </div>

            {/* Interactive Timeline */}
            <div ref={mindMapRef} className="relative max-w-6xl mx-auto">
              {/* Timeline Container */}
              <div className="relative">
                 {/* Timeline Line (solid red) */}
                 <div className="absolute left-1/2 -translate-x-1/2 w-1 bg-apex-red h-full rounded-full z-10"></div>

                {/* Timeline Items */}
                <div className="space-y-16">
                  {/* 2010 - Foundation */}
                  <div className={`relative flex items-center transition-all duration-1000 ${mindMapVisible ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'}`} style={{ transitionDelay: mindMapVisible ? '0.2s' : '0s' }}>
                    <div className="w-1/2 pr-8 text-right">
                      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                        <div className="flex items-center justify-end mb-4">
                          <div className="w-12 h-12 bg-white rounded-full border-2 border-apex-red flex items-center justify-center mr-4">
                            <Trophy className="h-6 w-6 text-apex-red" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">2010</h3>
                            <p className="text-apex-red font-semibold">Foundation</p>
                          </div>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Apex Nutrition Founded</h4>
                        <p className="text-gray-600 leading-relaxed">
                          Prof. Dr. Du Toit Loots establishes Apex Nutrition with a vision to revolutionize sports nutrition through scientific research and athletic excellence.
                        </p>
                        <div className="mt-4 flex items-center justify-end">
                          <span className="text-sm text-gray-500">Company established</span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-apex-red rounded-full border-4 border-white shadow-lg"></div>
                    <div className="w-1/2 pl-8"></div>
            </div>

                  {/* 2012 - First Product */}
                  <div className={`relative flex items-center transition-all duration-1000 ${mindMapVisible ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'}`} style={{ transitionDelay: mindMapVisible ? '0.4s' : '0s' }}>
                    <div className="w-1/2 pr-8"></div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-apex-red rounded-full border-4 border-white shadow-lg"></div>
                    <div className="w-1/2 pl-8">
                      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                        <div className="flex items-center mb-4">
                                                      <div className="w-12 h-12 bg-white rounded-full border-2 border-apex-red flex items-center justify-center mr-4">
                             <TestTube className="h-6 w-6 text-apex-red" />
                           </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">2012</h3>
                                                         <p className="text-apex-red font-semibold">First Product</p>
                          </div>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Breakthrough Formulation</h4>
                        <p className="text-gray-600 leading-relaxed">
                          Launch of our first scientifically formulated supplement, marking the beginning of our commitment to evidence-based nutrition.
                        </p>
                        <div className="mt-4 flex items-center">
                          <span className="text-sm text-gray-500">Initial formulation launched</span>
                        </div>
            </div>
          </div>
        </div>

                  {/* 2015 - Clinical Trials */}
                  <div className={`relative flex items-center transition-all duration-1000 ${mindMapVisible ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'}`} style={{ transitionDelay: mindMapVisible ? '0.6s' : '0s' }}>
                    <div className="w-1/2 pr-8 text-right">
                      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                        <div className="flex items-center justify-end mb-4">
                                                      <div className="w-12 h-12 bg-white rounded-full border-2 border-apex-red flex items-center justify-center mr-4 shadow-lg">
                             <Microscope className="h-6 w-6 text-apex-red" />
                           </div>
            <div>
                            <h3 className="text-xl font-bold text-gray-900">2015</h3>
                                                         <p className="text-apex-red font-semibold">Clinical Validation</p>
                          </div>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Human Clinical Trials</h4>
                        <p className="text-gray-600 leading-relaxed">
                          Comprehensive clinical trials validate our formulations, establishing the scientific foundation for all future products.
                        </p>
                        <div className="mt-4 flex items-center justify-end">
                          <span className="text-sm text-gray-500">Research validation completed</span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-apex-red rounded-full border-4 border-white shadow-lg"></div>
                    <div className="w-1/2 pl-8"></div>
                  </div>

                  {/* 2018 - Research Excellence */}
                  <div className={`relative flex items-center transition-all duration-1000 ${mindMapVisible ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'}`} style={{ transitionDelay: mindMapVisible ? '0.8s' : '0s' }}>
                    <div className="w-1/2 pr-8"></div>
                                          <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-apex-red rounded-full border-4 border-white shadow-lg"></div>
                    <div className="w-1/2 pl-8">
                      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                        <div className="flex items-center mb-4">
                                                      <div className="w-12 h-12 bg-white rounded-full border-2 border-apex-red flex items-center justify-center mr-4">
                             <Award className="h-6 w-6 text-apex-red" />
                           </div>
                  <div>
                            <h3 className="text-xl font-bold text-gray-900">2018</h3>
                                                         <p className="text-apex-red font-semibold">Research Excellence</p>
                          </div>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">100+ Publications</h4>
                        <p className="text-gray-600 leading-relaxed">
                          Achievement of over 100 scientific publications, establishing Apex as a leader in sports nutrition research.
                        </p>
                        <div className="mt-4 flex items-center">
                          <span className="text-sm text-gray-500">Scientific recognition</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2020 - Global Expansion */}
                  <div className={`relative flex items-center transition-all duration-1000 ${mindMapVisible ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'}`} style={{ transitionDelay: mindMapVisible ? '1.0s' : '0s' }}>
                    <div className="w-1/2 pr-8 text-right">
                      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                        <div className="flex items-center justify-end mb-4">
                                                      <div className="w-12 h-12 bg-white rounded-full border-2 border-apex-red flex items-center justify-center mr-4">
                             <Globe className="h-6 w-6 text-apex-red" />
                </div>
                  <div>
                            <h3 className="text-xl font-bold text-gray-900">2020</h3>
                                                         <p className="text-apex-red font-semibold">Global Reach</p>
                          </div>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Worldwide Expansion</h4>
                        <p className="text-gray-600 leading-relaxed">
                          Apex Nutrition products reach international markets, serving elite athletes across multiple continents.
                        </p>
                        <div className="mt-4 flex items-center justify-end">
                          <span className="text-sm text-gray-500">International markets</span>
                        </div>
                      </div>
                    </div>
                                          <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-apex-red rounded-full border-4 border-white shadow-lg"></div>
                    <div className="w-1/2 pl-8"></div>
                  </div>

                  {/* 2023 - Elite Partnerships */}
                  <div className={`relative flex items-center transition-all duration-1000 ${mindMapVisible ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'}`} style={{ transitionDelay: mindMapVisible ? '1.2s' : '0s' }}>
                    <div className="w-1/2 pr-8"></div>
                     <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-apex-red rounded-full border-4 border-white shadow-lg"></div>
                    <div className="w-1/2 pl-8">
                      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                        <div className="flex items-center mb-4">
                                                      <div className="w-12 h-12 bg-white rounded-full border-2 border-apex-red flex items-center justify-center mr-4">
                             <Users className="h-6 w-6 text-apex-red" />
                </div>
                  <div>
                            <h3 className="text-xl font-bold text-gray-900">2023</h3>
                            <p className="text-apex-red font-semibold">Elite Partnerships</p>
                          </div>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Athlete Success Stories</h4>
                        <p className="text-gray-600 leading-relaxed">
                          Partnerships with top-tier athletes and teams worldwide, proving the effectiveness of our formulations in elite competition.
                        </p>
                        <div className="mt-4 flex items-center">
                          <span className="text-sm text-gray-500">Global athlete network</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Future Vision */}
              <div className={`text-center mt-20 transition-all duration-1000 ${mindMapVisible ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'}`} style={{ transitionDelay: mindMapVisible ? '1.4s' : '0s' }}>
                                 <div className="bg-gradient-to-br from-apex-red via-red-800 to-black rounded-3xl p-8 lg:p-12 shadow-2xl text-white max-w-4xl mx-auto relative overflow-hidden">
                  {/* Light shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full animate-shine"></div>
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Star className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-4">Continuing Our Legacy</h3>
                  <p className="text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto opacity-95">
                    As we look to the future, Apex Nutrition remains committed to advancing sports nutrition through cutting-edge research,
                    innovative formulations, and unwavering dedication to athlete success.
                  </p>
            </div>
             </div>
           </div>
        </div>
      </section>

      {/* Athletic Achievements */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-gray-100 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6">
              Athletic Excellence
            </h2>
            <p className="text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto">
              Prof. Dr. Loots&apos; personal athletic achievements and hands-on experience across multiple sports disciplines inform every Apex formulation.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { sport: 'Bodybuilding', achievement: 'Drug Free Mr Universe Champion', icon: '🏆' },
              { sport: 'Rugby', achievement: 'Performance Specialist', icon: '🏉' },
              { sport: 'Cycling', achievement: 'Endurance Expert', icon: '🚴' },
              { sport: 'Athletics', achievement: 'Speed & Power Coach', icon: '🏃' },
              { sport: 'Martial Arts', achievement: 'Combat Sports Nutrition', icon: '🥋' },
              { sport: 'Boxing', achievement: 'Fight Performance', icon: '🥊' },
              { sport: 'Swimming', achievement: 'Aquatic Sports Specialist', icon: '🏊' },
              { sport: 'Multi-Sport', achievement: 'Cross-Discipline Expert', icon: '⭐' }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm lg:text-base">{item.sport}</h3>
                <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">{item.achievement}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-apex-red via-red-700 to-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-8">
            Ready to Experience the Difference?
          </h2>
          <p className="text-lg lg:text-xl mb-10 max-w-3xl mx-auto opacity-95">
            Join thousands of athletes who trust Apex Nutrition for their performance and recovery needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button size="lg" className="bg-white text-apex-red hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                Shop Our Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-apex-red shadow-lg hover:shadow-xl transition-all duration-300">
                Contact Our Team
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}