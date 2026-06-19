"use client";

import Link from "next/link";
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";

export default function HeroSection() {
  return (
    <section className="relative bg-gray-50 dark:bg-gradient-to-r dark:from-blue-950 dark:to-slate-950 py-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-20 animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="z-10">
            {/* Badge */}
            <div 
              className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full mb-6 text-sm font-semibold animate-slideInLeft"
              style={{ animationDelay: "0.1s" }}
            >
              <span className="text-lg">✈️</span>
              Sustainable Marketplace
            </div>

            {/* Heading */}
            <h1 
              className="text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-slideInLeft"
              style={{ animationDelay: "0.2s" }}
            >
              Buy & Sell{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                Second-Hand
              </span>{" "}
              Goods Effortlessly
            </h1>

            {/* Description */}
            <p 
              className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-lg animate-slideInLeft"
              style={{ animationDelay: "0.3s" }}
            >
              Join thousands of buyers and sellers in the most trusted marketplace for pre-owned items. Save money, reduce waste, live better.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition transform hover:scale-105 hover:shadow-lg animate-slideInUp"
                style={{ animationDelay: "0.4s" }}
              >
                Browse Products
                <FaArrowRight size={18} />
              </Link>
              <Link
                href="/sell"
                className="inline-flex items-center justify-center border-2 border-gray-300 dark:border-gray-600 text-black dark:text-white px-8 py-3 rounded-lg font-semibold hover:border-blue-600 dark:hover:border-blue-500 transition transform hover:scale-105 hover:shadow-lg animate-slideInUp"
                style={{ animationDelay: "0.5s" }}
              >
                Start Selling
              </Link>
            </div>

            {/* Stats */}
            <div 
              className="grid grid-cols-3 gap-8 animate-slideInUp"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="hover:transform hover:scale-110 transition">
                <p className="text-3xl font-bold text-black dark:text-white">17+</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Listings</p>
              </div>
              <div className="hover:transform hover:scale-110 transition">
                <p className="text-3xl font-bold text-black dark:text-white">5+</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Trusted Sellers</p>
              </div>
              <div className="hover:transform hover:scale-110 transition">
                <p className="text-3xl font-bold text-black dark:text-white">2+</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Deals Completed</p>
              </div>
            </div>
          </div>

          {/* Right Side - Image Grid */}
          <div className="relative z-10">
            <div className="grid grid-cols-2 gap-4">
              {/* Top Left */}
              <div 
                className="rounded-lg overflow-hidden h-48 bg-gradient-to-br from-purple-400 to-pink-400 transform transition hover:scale-110 hover:shadow-2xl animate-scaleIn"
                style={{ animationDelay: "0.2s" }}
              >
                <img
                  src="/images/products/product1.jpg"
                  alt="Product 1"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Top Right */}
              <div 
                className="rounded-lg overflow-hidden h-48 bg-gradient-to-br from-blue-400 to-cyan-400 transform transition hover:scale-110 hover:shadow-2xl animate-scaleIn"
                style={{ animationDelay: "0.3s" }}
              >
                <img
                  src="/images/products/product2.jpg"
                  alt="Product 2"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bottom Left */}
              <div 
                className="rounded-lg overflow-hidden h-48 bg-gradient-to-br from-green-400 to-emerald-400 transform transition hover:scale-110 hover:shadow-2xl animate-scaleIn"
                style={{ animationDelay: "0.4s" }}
              >
                <img
                  src="/images/products/product3.jpg"
                  alt="Product 3"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bottom Right */}
              <div 
                className="rounded-lg overflow-hidden h-48 bg-gradient-to-br from-orange-400 to-red-400 transform transition hover:scale-110 hover:shadow-2xl animate-scaleIn"
                style={{ animationDelay: "0.5s" }}
              >
                <img
                  src="/images/products/product4.jpg"
                  alt="Product 4"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* New Listings Badge */}
            <div 
              className="absolute -top-8 -right-8 bg-white/10 backdrop-blur border border-white/20 text-white rounded-lg p-4 shadow-lg animate-float"
              style={{ animationDelay: "0.7s" }}
            >
              <p className="font-semibold text-sm">New Listings</p>
              <p className="text-2xl font-bold">+17 <span className="text-sm font-normal">This month</span></p>
            </div>

            {/* Buyer Protection Badge - Transparent */}
            <div 
              className="absolute bottom-12 -left-32 bg-white/10 backdrop-blur border border-white/20 text-white rounded-lg p-4 flex items-center gap-3 animate-float"
              style={{ animationDelay: "0.9s" }}
            >
              <FaCheckCircle className="text-green-500" size={24} />
              <div>
                <p className="font-semibold">Buyer Protection</p>
                <p className="text-sm text-gray-300">100% Guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
