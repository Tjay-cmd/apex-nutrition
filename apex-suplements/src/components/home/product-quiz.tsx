"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Target, Zap, Heart, Shield, ArrowRight, CheckCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuizAnswer {
  question: string;
  answer: string;
}

interface Recommendation {
  category: string;
  products: string[];
  description: string;
  icon: React.ReactNode;
  color: string;
}

const ProductQuiz = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: 'goal',
      question: "What's your main fitness or wellness goal right now?",
      options: [
        { value: 'build-muscle', label: 'Build lean muscle', icon: <Target className="h-5 w-5" /> },
        { value: 'strength-power', label: 'Increase strength/power (for hard gainers)', icon: <Zap className="h-5 w-5" /> },
        { value: 'energy-endurance', label: 'Boost energy/endurance for training', icon: <Zap className="h-5 w-5" /> },
        { value: 'weight-loss', label: 'Lose weight and tone up', icon: <Target className="h-5 w-5" /> },
        { value: 'joint-health', label: 'Improve joint health', icon: <Shield className="h-5 w-5" /> },
        { value: 'general-health', label: 'Maintain general health/vitamins', icon: <Heart className="h-5 w-5" /> },
        { value: 'kids', label: 'Support a child\'s nutrition', icon: <Heart className="h-5 w-5" /> }
      ]
    },
    {
      id: 'training-level',
      question: "How would you describe your training level?",
      options: [
        { value: 'competitive', label: 'Competitive athlete / high metabolic rate', icon: <Star className="h-5 w-5" /> },
        { value: 'regular', label: 'Regular gym-goer', icon: <Target className="h-5 w-5" /> },
        { value: 'casual', label: 'Casual / just starting out', icon: <Heart className="h-5 w-5" /> }
      ]
    },
    {
      id: 'format',
      question: "Which format do you prefer?",
      options: [
        { value: 'powder', label: 'Shake/powder', icon: <Target className="h-5 w-5" /> },
        { value: 'capsule', label: 'Capsule/tablet', icon: <Shield className="h-5 w-5" /> },
        { value: 'pre-workout', label: 'Pre-workout drink/tablet', icon: <Zap className="h-5 w-5" /> },
        { value: 'no-preference', label: 'No preference', icon: <Heart className="h-5 w-5" /> }
      ]
    },
    {
      id: 'dietary',
      question: "Do you have any dietary restrictions?",
      options: [
        { value: 'lactose-intolerant', label: 'Lactose intolerant', icon: <Shield className="h-5 w-5" /> },
        { value: 'vegan', label: 'Vegan / plant-based', icon: <Heart className="h-5 w-5" /> },
        { value: 'none', label: 'None', icon: <Target className="h-5 w-5" /> }
      ]
    }
  ];

  const recommendations: { [key: string]: Recommendation } = {
    'build-muscle-competitive': {
      category: 'Lean Muscle Building',
      products: ['Anabolic Muscle-Up', 'Apex Premium Whey', 'CRT Creatine'],
      description: 'High-performance muscle building supplements for competitive athletes',
      icon: <Target className="h-6 w-6" />,
      color: 'from-apex-red to-red-600'
    },
    'build-muscle-regular': {
      category: 'Lean Muscle Building',
      products: ['Apex Premium Whey', 'CRT Creatine'],
      description: 'Premium muscle building supplements for regular training',
      icon: <Target className="h-6 w-6" />,
      color: 'from-apex-red to-red-600'
    },
    'strength-power': {
      category: 'Hard Gainers',
      products: ['Anabolic Muscle-Up', 'Mass Gainer Pro'],
      description: 'Specialized supplements for strength and power gains',
      icon: <Zap className="h-6 w-6" />,
      color: 'from-apex-gold to-yellow-500'
    },
    'energy-endurance': {
      category: 'Pre-Workout & Energy',
      products: ['Inferno NAD Pre-Workout', 'Biotransform', 'Energy Boost'],
      description: 'Performance enhancers for maximum energy and endurance',
      icon: <Zap className="h-6 w-6" />,
      color: 'from-apex-gold to-yellow-500'
    },
    'weight-loss': {
      category: 'Weight Loss',
      products: ['Lipoburn X-Treme', 'Fat Burner Pro'],
      description: 'Effective weight loss and toning supplements',
      icon: <Target className="h-6 w-6" />,
      color: 'from-gray-500 to-gray-700'
    },
    'joint-health': {
      category: 'Joint Support',
      products: ['Joint Support Plus', 'Glucosamine Complex'],
      description: 'Supplements for joint health and recovery',
      icon: <Shield className="h-6 w-6" />,
      color: 'from-orange-500 to-orange-600'
    },
    'general-health': {
      category: 'General Wellness',
      products: ['Daily Vitamins', 'Omega-3 Complex', 'Multivitamin'],
      description: 'Essential vitamins and minerals for overall health',
      icon: <Heart className="h-6 w-6" />,
      color: 'from-orange-500 to-orange-600'
    },
    'kids': {
      category: 'Kids Nutrition',
      products: ['Kids Multivitamin', 'Children\'s Omega-3'],
      description: 'Safe and effective supplements for children',
      icon: <Heart className="h-6 w-6" />,
      color: 'from-orange-500 to-orange-600'
    }
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    const questionIndex = newAnswers.findIndex(a => a.question === questions[currentStep].question);

    if (questionIndex >= 0) {
      newAnswers[questionIndex].answer = answer;
    } else {
      newAnswers.push({
        question: questions[currentStep].question,
        answer
      });
    }

    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const getRecommendation = () => {
    const goal = answers.find(a => a.question === questions[0].question)?.answer;
    const trainingLevel = answers.find(a => a.question === questions[1].question)?.answer;

    if (goal === 'build-muscle') {
      return trainingLevel === 'competitive' ? 'build-muscle-competitive' : 'build-muscle-regular';
    }

    return goal;
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers([]);
    setShowResults(false);
  };

  if (showResults) {
    const recommendationKey = getRecommendation();
    const recommendation = recommendations[recommendationKey] || recommendations['general-health'];

    return (
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Your Personalized Recommendation
            </h2>
            <p className="text-lg text-gray-600">
              Based on your goals and preferences, here's what we recommend:
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200/50 p-8 shadow-xl">
            <div className="flex items-center mb-6">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${recommendation.color} text-white mr-4`}>
                {recommendation.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{recommendation.category}</h3>
                <p className="text-gray-600">{recommendation.description}</p>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Recommended Products:</h4>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {recommendation.products.map((product, index) => (
                   <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                     <CheckCircle className="h-5 w-5 text-apex-red mr-3" />
                     <span className="font-medium text-gray-900">{product}</span>
                   </div>
                 ))}
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-gradient-to-r from-apex-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-8 rounded-xl text-lg shadow-xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <Link href={`/shop?category=${recommendation.category.toLowerCase().replace(/\s+/g, '-')}`}>
                  View Recommended Products
                </Link>
              </Button>
                             <Button
                 onClick={resetQuiz}
                 variant="outline"
                 className="border-2 border-gray-300 text-gray-900 font-bold py-3 px-8 rounded-xl text-lg hover:bg-gray-50 hover:text-gray-900 transition-all duration-300"
               >
                 Take Quiz Again
               </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

    return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {currentStep === 0 ? (
          // Initial state - just the header and Take Quiz button
          <>
            {/* Quiz Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Do you know what you need?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Take our quick quiz to discover the perfect supplements for your goals and lifestyle
              </p>
            </div>

            {/* Start Quiz Button */}
            <div className="text-center">
              <Button
                onClick={() => setCurrentStep(1)}
                className="bg-gradient-to-r from-apex-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-8 rounded-xl text-lg shadow-xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
              >
                Take Quiz
              </Button>
            </div>
          </>
        ) : (
          // Quiz in progress - show questions
          <>
            {/* Quiz Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Let's find your perfect match
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Answer a few questions to get personalized recommendations
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Question {currentStep} of {questions.length}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round((currentStep / questions.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-apex-red to-red-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Question */}
            <div className="bg-white rounded-2xl border border-gray-200/50 p-8 shadow-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {questions[currentStep - 1].question}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions[currentStep - 1].options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-apex-red hover:bg-red-50 transition-all duration-300 text-left group"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-apex-red group-hover:text-white mr-4 transition-colors duration-300">
                      <div className="text-gray-600 group-hover:text-white">
                        {option.icon}
                      </div>
                    </div>
                    <span className="font-medium text-gray-900">{option.label}</span>
                    <ArrowRight className="h-5 w-5 text-gray-400 ml-auto group-hover:text-apex-red transition-colors duration-300" />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ProductQuiz;