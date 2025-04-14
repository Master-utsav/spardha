"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from "@/lib/utils";
import { loadRazorpay } from '@/lib/razorpay';
import { RazorpayOptions, RazorpayPaymentResponse } from '@/types/razorpay';

const pricingTiers = [
  {
    name: 'Basic',
    price: 49,
    description: 'Perfect for getting started',
    features: [
      'Create 1 Quiz (Code Clash or Bug Bash)',
      'Max 20 Questions per Quiz',
      'Basic Competition Access'
    ],
    tier: 'basic'
  },
  {
    name: 'Popular',
    price: 75,
    description: 'Most popular plan for serious learners',
    features: [
      '3 Quizzes (Bug Bash or Code Clash)',
      'Max 25 Questions per Quiz',
      '1 Code Mirage Included',
      'Enhanced Competition Access'
    ],
    tier: 'popular',
    highlight: true
  },
  {
    name: 'Premium',
    price: 149,
    description: 'Unlimited learning and competition',
    features: [
      '5 Quizzes in Bug Bash',
      '5 Quizzes in Code Clash',
      '5 Code Mirage Quizzes',
      'Max 30 Questions per Quiz',
      'Full Platform Access'
    ],
    tier: 'premium'
  }
];

const PricingPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handlePurchase = async (tier: typeof pricingTiers[0]) => {
    try {
      const razorpay = await loadRazorpay();
      
      // Replace with your actual Razorpay key and backend endpoint
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: tier.price * 100,  // Convert to paise
          currency: 'INR',
          receipt: `plan_${tier.tier}_${Date.now()}`
        })
      });

      const orderData = await response.json();

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || '',
        amount: tier.price * 100,
        currency: 'INR',
        name: 'QuizPlatform',
        description: `${tier.name} Plan`,
        order_id: orderData.id,
        handler: async (response: RazorpayPaymentResponse) => {
          // Handle successful payment
          await fetch('/api/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              ...response,
              plan: tier.tier
            })
          });
          
          // Redirect or show success message
          alert(`Successfully purchased ${tier.name} plan!`);
        },
        theme: {
          color: '#05445e'  // Navy Blue theme color
        }
      };

      const paymentObject = new razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <div id='pricing' className="min-h-screen bg-babyBlue py-12 px-4 sm:px-6 lg:px-8 rounded-lg">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-navyBlue mb-12">
          Choose Your Quiz Plan
        </h1>
        <div className="grid md:grid-cols-3 gap-6">
          {pricingTiers.map((tier) => (
            <Card 
              key={tier.tier}
              className={cn(
                "w-full p-6 transition-all duration-300 hover:shadow-xl",
                tier.highlight 
                  ? "border-2 border-blueGrotto scale-105 bg-blueGreen/10" 
                  : "border border-blueGrotto/30"
              )}
            >
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-navyBlue font-noto">
                  {tier.name}
                </CardTitle>
                <p className="text-sm text-blueGrotto">{tier.description}</p>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-navyBlue mb-4 font-noto">
                  ₹{tier.price}
                </div>
                <ul className="space-y-2 mb-6 font-body">
                  {tier.features.map((feature, index) => (
                    <li 
                      key={index} 
                      className="flex items-start text-sm text-navyBlue"
                    >
                      <svg 
                        className="w-5 h-5 mr-2 text-blueGrotto" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={() => handlePurchase(tier)}
                  className="w-full bg-navyBlue hover:bg-blueGrotto text-white"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;