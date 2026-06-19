"use client";

import { FaStar } from "react-icons/fa";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Ahmed Hassan",
      role: "Regular Buyer",
      avatar: "AH",
      rating: 5,
      quote: "Very easy to buy. The platform is user-friendly and the products are genuine. Highly recommended!",
      color: "from-blue-500 to-blue-600"
    },
    {
      name: "Fatima Khan",
      role: "Active Seller",
      avatar: "FK",
      rating: 5,
      quote: "Selling on TradeHub is seamless. Great customer support and fair pricing. Best marketplace ever!",
      color: "from-purple-500 to-purple-600"
    },
    {
      name: "Mohammed Ali",
      role: "Verified Buyer",
      avatar: "MA",
      rating: 5,
      quote: "Fast delivery, secure payments, and authentic items. Everything went smoothly from start to finish.",
      color: "from-pink-500 to-pink-600"
    }
  ];

  return (
    <section className="bg-gray-50 dark:bg-gradient-to-r dark:from-slate-950 dark:to-blue-950 py-20 relative overflow-hidden">
      {/* Background animated elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 dark:bg-purple-900/20 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: "1s" }}></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slideInUp">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-black dark:text-white">
            What Our Customers <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Say</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto animate-slideInUp" style={{ animationDelay: "0.2s" }}>
            Join thousands of satisfied customers who trust TradeHub for their buying and selling needs.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-white dark:bg-white/5 backdrop-blur border border-gray-200 dark:border-white/10 rounded-xl p-8 hover:shadow-2xl hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-500 hover:scale-105 hover:-translate-y-4 animate-scaleIn"
              style={{ animationDelay: `${0.1 + index * 0.15}s` }}
            >
              {/* Animated background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Quote Icon */}
              <div className="relative z-10 text-4xl text-blue-500 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">"</div>

              {/* Stars */}
              <div className="relative z-10 flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar
                    key={i}
                    className="text-yellow-400 animate-slideInUp"
                    size={18}
                    style={{ animationDelay: `${0.2 + index * 0.15 + i * 0.05}s` }}
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 dark:text-gray-300 text-base mb-6 relative z-10 italic leading-relaxed">
                {testimonial.quote}
              </p>

              {/* User Info */}
              <div className="relative z-10 flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-white/10">
                {/* Avatar */}
                <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300 animate-float`} style={{ animationDelay: `${0.3 + index * 0.15}s` }}>
                  {testimonial.avatar}
                </div>

                {/* Name and Role */}
                <div>
                  <p className="font-semibold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition duration-300">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              {/* Animated shine effect */}
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer"></div>
              </div>

              {/* Animated border accent */}
              <div className="absolute top-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-xl group-hover:w-full transition-all duration-500"></div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {[
            { number: "4.9/5", label: "Average Rating" },
            { number: "2,500+", label: "Reviews" },
            { number: "98%", label: "Satisfaction Rate" }
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 animate-slideInUp"
              style={{ animationDelay: `${0.6 + index * 0.1}s` }}
            >
              <p className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-2">
                {stat.number}
              </p>
              <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center animate-slideInUp" style={{ animationDelay: "1s" }}>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Ready to start your trading journey?
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold transform hover:scale-105 hover:shadow-2xl transition-all duration-300">
            Join TradeHub Now
          </button>
        </div>
      </div>
    </section>
  );
}
