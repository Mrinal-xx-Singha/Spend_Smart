"use client";
import React, { useState } from "react";
import { Check } from "lucide-react";

const Upgrades = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: "basic",
      name: "Basic Plan",
      description: "Perfect for getting started",
      price: 9,
      features: [
        "5 Budget Creation",
        "2GB Storage",
        "Basic Analytics",
        "Email Support",
      ],
    },
    {
      id: "pro",
      name: "Pro Plan",
      description: "For growing businesses",
      price: 29,
      features: [
        "Unlimited Budget Creation",
        "10GB Storage",
        "Advanced Analytics",
        "Priority Support",
        "Custom Domain",
        "Team Collaboration",
      ],
    },
  ];

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const handleUpgrade = () => {
    if (selectedPlan) {
      // Here you would typically integrate with your payment system
      alert(`Processing upgrade to ${selectedPlan} plan`);
    } else {
      alert("Please select a plan first");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Select the perfect plan for your needs
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => handlePlanSelect(plan.id)}
              className={`cursor-pointer border-2 rounded-lg shadow-sm divide-y divide-gray-200 bg-white hover:shadow-lg transition-all duration-300 ${
                selectedPlan === plan.id
                  ? "border-violet-500 scale-105"
                  : plan.id === "pro"
                  ? "border-gray-200 hover:border-blue-300"
                  : "border-gray-200"
              }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {plan.name}
                  </h3>
                  {plan.id === "pro" && (
                    <span className="px-3 py-1 text-sm text-blue-600 bg-blue-100 rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                <p className="mt-4 text-gray-500">{plan.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-500">/month</span>
                </p>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex">
                      <Check
                        className={`h-5 w-5 mr-2 ${
                          selectedPlan === plan.id
                            ? "text-blue-500"
                            : "text-green-500"
                        }`}
                      />
                      <span className="text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div
                  className={`mt-8 p-1 rounded-md ${
                    selectedPlan === plan.id ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="relative">
                    {selectedPlan === plan.id && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-full w-full animate-pulse bg-blue-100 rounded-md opacity-30"></div>
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpgrade();
                      }}
                      className={`w-full py-2 px-4 rounded-md transition-colors duration-200 ${
                        selectedPlan === plan.id
                          ? "bg-primary text-white hover:bg-primary/90"
                          : "bg-gray-800 text-white hover:bg-gray-700"
                      }`}
                    >
                      {selectedPlan === plan.id
                        ? "Confirm Selection"
                        : `Choose ${plan.name}`}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedPlan && (
          <div className="mt-8 text-center text-sm text-gray-500">
            Selected plan: {plans.find((p) => p.id === selectedPlan).name}
          </div>
        )}
      </div>
    </div>
  );
};

export default Upgrades;
