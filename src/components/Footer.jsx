import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gradient-to-r dark:from-blue-900 dark:to-slate-900 border-t border-gray-200 dark:border-blue-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img 
                src="/images/company.png" 
                alt="TradeHub Logo" 
                className="h-10 w-auto"
              />
              <span className="text-black dark:text-white font-bold text-xl">TradeHub</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              The premier marketplace for second-hand goods. Buy and sell sustainably, saving money while helping the environment.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-blue-600" />
                <a href="mailto:support@tradehub.com" className="hover:text-blue-600">support@tradehub.com</a>
              </div>
              <div className="flex items-center gap-2">
                <FaPhone className="text-blue-600" />
                <span>01609247375</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-600" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
            {/* Social Links */}
            <div className="flex gap-4 mt-4">
              <a href="https://www.facebook.com/raduan.hossen.24521" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                <FaFacebook size={20} />
              </a>
              <a href="https://x.com/raduan007ei" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                <FaTwitter size={20} />
              </a>
              <a href="https://www.instagram.com/raduan.hossen/" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                <FaInstagram size={20} />
              </a>
              <a href="https://www.linkedin.com/in/raduanhossen857/" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-black dark:text-white font-semibold text-lg mb-4">Quick Links</h3>
            <nav className="space-y-2">
              <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Home</Link><br />
              <Link href="/products" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Products</Link><br />
              <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">About Us</Link><br />
              <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Contact</Link>
            </nav>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-black dark:text-white font-semibold text-lg mb-4">Account</h3>
            <nav className="space-y-2">
              <Link href="/login" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Sign In</Link><br />
              <Link href="/register" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Register</Link><br />
              <Link href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Dashboard</Link><br />
              <Link href="/orders" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">My Orders</Link>
            </nav>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-black dark:text-white font-semibold text-lg mb-4">Categories</h3>
            <nav className="space-y-2">
              <Link href="/category/electronics" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Electronics</Link><br />
              <Link href="/category/furniture" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Furniture</Link><br />
              <Link href="/category/vehicles" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Vehicles</Link><br />
              <Link href="/category/fashion" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Fashion</Link><br />
              <Link href="/category/mobile" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Mobile Phones</Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-200 dark:border-blue-800 bg-gray-100 dark:bg-blue-950 py-6">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center flex-col md:flex-row gap-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">© 2026 TradeHub. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/privacy" className="hover:text-blue-600">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-blue-600">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-blue-600">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;