import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-8 pt-6 border-t border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <h4 className="font-semibold mb-3">AbiaWay Transit</h4>
          <p className="text-xs text-gray-400">
            Smart transit system for Abia State. Making travel easier, safer, and more efficient.
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-primary transition">About Us</a></li>
            <li><a href="#" className="hover:text-primary transition">Contact</a></li>
            <li><a href="#" className="hover:text-primary transition">FAQs</a></li>
            <li><a href="#" className="hover:text-primary transition">Support</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-primary transition">Terms of Service</a></li>
            <li><a href="#" className="hover:text-primary transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-primary transition">Cookie Policy</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-3">Download App</h4>
          <div className="space-y-2">
            <button className="btn-secondary w-full text-sm py-2">
              <i data-lucide="apple" className="w-4 h-4 inline mr-2"></i>
              App Store
            </button>
            <button className="btn-secondary w-full text-sm py-2">
              <i data-lucide="chrome" className="w-4 h-4 inline mr-2"></i>
              Google Play
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Abia One Transit System. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;