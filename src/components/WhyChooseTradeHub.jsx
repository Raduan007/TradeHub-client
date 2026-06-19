"use client";

import { FaLock, FaCheckCircle, FaSearch, FaShoppingCart } from "react-icons/fa";

export default function WhyChooseTradeHub() {
  const features = [
    {
      icon: FaLock,
      title: "Secure Payments",
      description: "Your transactions are protected with industry-leading encryption and fraud detection."
    },
    {
      icon: FaCheckCircle,
      title: "Verified Sellers",
      description: "All sellers are verified to ensure you're buying from trusted and reliable sources."
    },
    {
      icon: FaSearch,
      title: "Fast Search",
      description: "Find exactly what you're looking for with our advanced search and filtering options."
    },
    {
      icon: FaShoppingCart,
      title: "Easy Buying",
      description: "Simple checkout process with multiple payment options and quick delivery tracking."
    }
  ];

  return (
    <section className="bg-gray-50 dark:bg-gradient-to-r dark:from-slate-950 dark:to-blue-950 py-20 relative overflow-hidden">
      {/* Background animated elements */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl animate-pulse opacity-50"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-200 dark:bg-purple-900/20 rounded-full blur-3xl animate-pulse opacity-50" style={{ animationDelay: "1s" }}></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slideInUp">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-black dark:text-white">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">TradeHub</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto animate-slideInUp" style={{ animationDelay: "0.2s" }}>
            We provide a safe, reliable, and user-friendly marketplace for buying and selling second-hand goods.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white dark:bg-white/5 backdrop-blur border border-gray-200 dark:border-white/10 rounded-xl p-8 hover:shadow-2xl hover:border-blue-500 dark:hover:border-blue-400 transition transform hover:scale-105 hover:-translate-y-4 duration-500 animate-scaleIn"
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                {/* Animated background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Icon with floating animation */}
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4 shadow-lg relative z-10 animate-float" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                  <Icon className="text-white" size={28} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-3 text-black dark:text-white relative z-10 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition duration-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed relative z-10">
                  {feature.description}
                </p>

                {/* Animated bottom line */}
                <div className="mt-4 h-1 w-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full group-hover:w-full transition-all duration-500"></div>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer" style={{ animationDelay: `${index * 0.1}s` }}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info with animation */}
        <div className="mt-16 text-center">
          <div 
            className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-6 py-3 rounded-full mb-6 animate-slideInUp transform hover:scale-105 transition-transform duration-300 hover:shadow-lg" 
            style={{ animationDelay: "0.6s" }}
          >
            <span className="text-lg animate-bounce">⭐</span>
            <span className="font-semibold">Trusted by thousands of users worldwide</span>
          </div>
        </div>

        {/* Stats animation at bottom */}
        <div className="grid grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
          {[
            { number: "10K+", label: "Happy Users" },
            { number: "50K+", label: "Products" },
            { number: "99.9%", label: "Uptime" }
          ].map((stat, index) => (
            <div 
              key={index}
              className="text-center animate-slideInUp p-4 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
              style={{ animationDelay: `${0.7 + index * 0.1}s` }}
            >
              <p className="text-2xl lg:text-3xl font-bold text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition">{stat.number}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
