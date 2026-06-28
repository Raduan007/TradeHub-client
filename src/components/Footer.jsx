import React from "react";
import Link from "next/link";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gradient-to-r dark:from-blue-900 dark:to-slate-900 border-t border-gray-200 dark:border-blue-800">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Mobile Footer */}
        <div className="md:hidden flex flex-col items-center text-center">
          <img
            src="/images/company.png"
            alt="TradeHub"
            className="h-14 w-auto mb-4"
          />

          <h2 className="text-xl font-bold text-black dark:text-white">
            TradeHub
          </h2>

          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 max-w-xs">
            Buy and sell second-hand products easily and securely.
          </p>

          <div className="mt-5 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center justify-center gap-2">
              <FaEnvelope className="text-blue-600" />
              <span>support@tradehub.com</span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <FaPhone className="text-blue-600" />
              <span>01609247375</span>
            </div>
          </div>

          <div className="flex gap-5 mt-5">
            <a
              href="https://www.facebook.com/raduan.hossen.24521"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
            >
              <FaFacebook size={20} />
            </a>

            <a
              href="https://x.com/raduan007ei"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
            >
              <FaTwitter size={20} />
            </a>

            <a
              href="https://www.instagram.com/raduan.hossen/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
            >
              <FaInstagram size={20} />
            </a>

            <a
              href="https://www.linkedin.com/in/raduanhossen857/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
            >
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>

        {/* Desktop Footer */}
        <div className="hidden md:grid grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img
                src="/images/company.png"
                alt="TradeHub Logo"
                className="h-10 w-auto"
              />
              <span className="text-black dark:text-white font-bold text-xl">
                TradeHub
              </span>
            </Link>

            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              The premier marketplace for second-hand goods. Buy and sell
              sustainably while saving money and helping the environment.
            </p>

            <div className="flex gap-4 mt-4">
              <FaFacebook
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 cursor-pointer"
                size={20}
              />
              <FaTwitter
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 cursor-pointer"
                size={20}
              />
              <FaInstagram
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 cursor-pointer"
                size={20}
              />
              <FaLinkedin
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 cursor-pointer"
                size={20}
              />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-black dark:text-white font-semibold text-lg mb-4">
              Quick Links
            </h3>

            <div className="flex flex-col gap-2">
              <Link href="/">Home</Link>
              <Link href="/products">Products</Link>
              <Link href="/about">About Us</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-black dark:text-white font-semibold text-lg mb-4">
              Account
            </h3>

            <div className="flex flex-col gap-2">
              <Link href="/login">Sign In</Link>
              <Link href="/auth/signup">Register</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/login?callbackUrl=/dashboard/buyer/orders">My Orders</Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-black dark:text-white font-semibold text-lg mb-4">
              Categories
            </h3>

            <div className="flex flex-col gap-2">
              <Link href="/products?category=electronics">Electronics</Link>
              <Link href="/products?category=furniture">Furniture</Link>
              <Link href="/products?category=vehicles">Vehicles</Link>
              <Link href="/products?category=fashion">Fashion</Link>
              <Link href="/products?category=mobile">Mobile Phones</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-200 dark:border-blue-800 py-4">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2026 TradeHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;