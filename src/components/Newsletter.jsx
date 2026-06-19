"use client";

import { useState } from "react";
import { FaEnvelope, FaArrowRight, FaCheckCircle } from "react-icons/fa";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubscribed(true);
      setEmail("");
      setIsLoading(false);
      
      // Reset after 3 seconds
      setTimeout(() => setSubscribed(false), 3000);
    }, 1500);
  };

  return (
    <section className="relative bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-900 dark:to-purple-900 py-20 overflow-hidden newsletter-section">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-float"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-slideInUp">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-white/90 text-lg mb-2 animate-slideInUp" style={{ animationDelay: "0.2s" }}>
            Subscribe to our newsletter to get the latest deals, products, and exclusive offers.
          </p>
          <p className="text-white/80 text-sm animate-slideInUp" style={{ animationDelay: "0.3s" }}>
            Join 10,000+ subscribers and never miss out
          </p>
        </div>

        {/* Newsletter Form */}
        <div className="animate-slideInUp" style={{ animationDelay: "0.4s" }}>
          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              {/* Email Input */}
              <div className="flex-1 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
                <div className="relative flex items-center bg-white dark:bg-gray-900 rounded-lg px-4 py-3 shadow-lg group-hover:shadow-2xl transition-all duration-300">
                  <FaEnvelope className="text-gray-400 mr-3" size={18} />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 bg-transparent outline-none text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Subscribe Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="bg-white dark:bg-gray-900 text-blue-600 dark:text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-blue-600 dark:border-white border-t-transparent rounded-full animate-spin"></div>
                    Subscribing...
                  </>
                ) : (
                  <>
                    Subscribe
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
                  </>
                )}
              </button>
            </form>
          ) : (
            // Success Message
            <div className="bg-white/20 backdrop-blur border border-white/30 rounded-lg p-8 text-center max-w-2xl mx-auto animate-scaleIn">
              <div className="flex justify-center mb-4 animate-float">
                <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center">
                  <FaCheckCircle className="text-white" size={32} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
              <p className="text-white/90">
                You've successfully subscribed to our newsletter. Check your email for confirmation.
              </p>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {[
            { icon: "📧", title: "Weekly Deals", description: "Get exclusive offers every week" },
            { icon: "🎁", title: "Special Offers", description: "Early access to promotions" },
            { icon: "🔔", title: "New Products", description: "Never miss new listings" }
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6 text-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 animate-slideInUp"
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h4 className="font-semibold mb-2">{feature.title}</h4>
              <p className="text-sm text-white/80">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Privacy notice */}
        <p className="text-center text-white/70 text-sm mt-12 animate-fadeIn" style={{ animationDelay: "0.8s" }}>
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
