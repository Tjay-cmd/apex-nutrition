"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trophy, Users, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Athlete {
  id: string;
  name: string;
  sport: string;
  team: string;
  image: string;
  description: string;
  achievements: string[];
}

const athletes: Athlete[] = [
  {
    id: '1',
    name: 'Leopards Rugby Team',
    sport: 'Rugby Union',
    team: 'Leopards Rugby',
    image: '/lepords/210813-leopards-first-division-trophy.jpg',
    description: 'Official partners of the Leopards Rugby team, providing premium supplements to support their performance and recovery needs.',
    achievements: [
      'Official Supplement Partner',
      'Performance & Recovery Support',
      'Team Nutrition Programs'
    ]
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    sport: 'CrossFit',
    team: 'Elite Fitness',
    image: '/athlete/powerful-strong-woman-raises-arm-shows-biceps-holds-fitness-mat-gym-training-dressed-active-wear.jpg',
    description: 'CrossFit athlete and fitness influencer who trusts Apex Nutrition for her training and competition preparation.',
    achievements: [
      'CrossFit Games Competitor',
      'Fitness Influencer',
      'Performance Coach'
    ]
  },
  {
    id: '3',
    name: 'Mike Rodriguez',
    sport: 'Bodybuilding',
    team: 'Pro Bodybuilding',
    image: '/athlete/full-shot-man-wearing-heaphones.jpg',
    description: 'Professional bodybuilder and certified trainer who relies on Apex supplements for muscle building and recovery.',
    achievements: [
      'IFBB Pro Bodybuilder',
      'Certified Trainer',
      'Nutrition Specialist'
    ]
  },
  {
    id: '4',
    name: 'Emma Thompson',
    sport: 'Marathon Running',
    team: 'Elite Runners',
    image: '/athlete/front-view-fit-man-running-equipment.jpg',
    description: 'Marathon runner and endurance athlete who uses Apex supplements for energy and recovery during training.',
    achievements: [
      'Boston Marathon Finisher',
      'Ultra-Marathon Runner',
      'Endurance Coach'
    ]
  }
];

const AthletePartnerships = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-apex-red to-red-600 w-12 h-1 rounded-full mr-4"></div>
            <Trophy className="h-6 w-6 text-apex-red" />
            <div className="bg-gradient-to-r from-apex-red to-red-600 w-12 h-1 rounded-full ml-4"></div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Trusted by Elite Athletes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join the ranks of professional athletes and teams who trust Apex Nutrition for their performance and recovery needs
          </p>
        </div>

        {/* Featured Partnership - Leopards Rugby */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-apex-red to-red-600 rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Image Section */}
              <div className="relative h-64 lg:h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-apex-red/20 to-red-600/20" />
                                 <Image
                   src="/lepords/210813-leopards-first-division-trophy.jpg"
                   alt="Leopards Rugby Team"
                   fill
                   className="object-cover"
                   sizes="(max-width: 1024px) 100vw, 50vw"
                 />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="h-5 w-5" />
                    <span className="text-sm font-semibold">Official Partner</span>
                  </div>
                  <h3 className="text-2xl font-bold">Leopards Rugby</h3>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="mb-6">
                  <h3 className="text-3xl font-bold text-white mb-4">
                    Official Supplement Partner
                  </h3>
                  <p className="text-red-100 text-lg mb-6">
                    We're proud to be the official supplement partner of the Leopards Rugby team,
                    providing premium nutrition support for their performance and recovery needs.
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-red-100">Performance optimization for match days</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-red-100">Recovery support for intense training</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-red-100">Team nutrition programs and education</span>
                  </div>
                </div>

                <Button
                  asChild
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                >
                  <Link href="/athletes">
                    Learn More About Our Partnership
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Other Athlete Partnerships */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Meet Our Athletes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {athletes.slice(1).map((athlete) => (
              <div
                key={athlete.id}
                className="group relative bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 overflow-hidden hover:shadow-2xl hover:shadow-gray-500/20 hover:-translate-y-2 transition-all duration-300"
              >
                {/* Athlete Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={athlete.image}
                    alt={athlete.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Sport Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-apex-red/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {athlete.sport}
                    </div>
                  </div>
                </div>

                {/* Athlete Info */}
                <div className="p-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-apex-red transition-colors duration-300">
                    {athlete.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {athlete.team}
                  </p>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {athlete.description}
                  </p>

                  {/* Achievements */}
                  <div className="space-y-2">
                    {athlete.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Star className="h-3 w-3 text-apex-red flex-shrink-0" />
                        <span className="text-xs text-gray-600">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Join Our Athlete Network
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Discover how Apex Nutrition supports elite athletes and teams in achieving their performance goals.
              Learn about our partnerships and how we can support your athletic journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                asChild
                className="group relative bg-gradient-to-r from-apex-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-10 rounded-2xl shadow-xl hover:shadow-red-500/30 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 overflow-hidden"
              >
                <Link href="/athletes" className="flex items-center">
                  <div className="relative z-10 flex items-center">
                    <Users className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="text-lg">Meet Our Athletes</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-apex-red/0 via-white/10 to-apex-red/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="group relative border-2 border-apex-red text-apex-red hover:bg-apex-red hover:text-white font-bold py-4 px-10 rounded-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-apex-red/25 overflow-hidden"
              >
                <Link href="/partnerships" className="flex items-center">
                  <div className="relative z-10 flex items-center">
                    <ArrowRight className="h-5 w-5 mr-3 group-hover:translate-x-1 transition-transform duration-300" />
                    <span className="text-lg">Partnership Opportunities</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-apex-red/0 via-white/20 to-apex-red/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AthletePartnerships;