"use client";

import { FaUserPlus, FaImage, FaComments, FaCheckCircle } from "react-icons/fa";

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Create Account",
      description: "Sign up for free and complete your profile in minutes.",
      icon: FaUserPlus
    },
    {
      number: 2,
      title: "Post Product",
      description: "Upload photos and details of your items to sell.",
      icon: FaImage
    },
    {
      number: 3,
      title: "Receive Offers",
      description: "Get offers from interested buyers in real-time.",
      icon: FaComments
    },
    {
      number: 4,
      title: "Sell Successfully",
      description: "Complete the transaction and earn money instantly.",
      icon: FaCheckCircle
    }
  ];

  return (
    <section className="bg-white dark:bg-gradient-to-r dark:from-blue-950 dark:to-slate-950 py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 dark:bg-blue-900/10 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 dark:bg-purple-900/10 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: "1s" }}></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 animate-slideInUp">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-black dark:text-white">
            How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Works</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto animate-slideInUp" style={{ animationDelay: "0.2s" }}>
            Follow these 4 simple steps to start buying or selling on TradeHub
          </p>
        </div>

        {/* Steps Container */}
        <div className="relative">
          {/* Desktop Connector Line */}
          <div className="hidden lg:block absolute top-1/4 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 transform -translate-y-1/2 animate-pulse"></div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="relative animate-slideInUp"
                  style={{ animationDelay: `${0.1 + index * 0.15}s` }}
                >
                  {/* Card */}
                  <div className="group bg-gray-50 dark:bg-white/5 backdrop-blur border border-gray-200 dark:border-white/10 rounded-xl p-8 hover:shadow-2xl hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-500 hover:scale-110 hover:-translate-y-4">
                    {/* Step Number Circle */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-4 border-white dark:border-slate-950 animate-float" style={{ animationDelay: `${0.3 + index * 0.15}s` }}>
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className="flex justify-center mb-6 mt-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                        <Icon className="text-white" size={32} />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-center mb-3 text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition duration-300">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 text-sm text-center leading-relaxed">
                      {step.description}
                    </p>

                    {/* Animated shine */}
                    <div className="absolute inset-0 rounded-xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    </div>
                  </div>

                  {/* Arrow connector - visible on larger screens */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/4 -right-4 transform translate-x-1/2">
                      <div className="animate-slideInRight" style={{ animationDelay: `${0.5 + index * 0.15}s` }}>
                        <svg className="w-8 h-8 text-gradient-to-r from-blue-500 to-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Mobile vertical connector */}
                  {index < steps.length - 1 && (
                    <div className="block lg:hidden text-center mt-6">
                      <div className="animate-slideInUp" style={{ animationDelay: `${0.5 + index * 0.15}s` }}>
                        <svg className="w-6 h-6 text-gradient-to-b from-blue-500 to-purple-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center animate-slideInUp" style={{ animationDelay: "0.8s" }}>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold transform hover:scale-105 hover:shadow-2xl transition-all duration-300">
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
}
