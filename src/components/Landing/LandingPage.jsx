import React from 'react';
import { Bus, Wallet, Clock, Shield, ArrowRight, MapPin, Smartphone, Users } from 'lucide-react';

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
            <Bus className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold">Abia Way</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-300 hover:text-white transition">About</button>
          <button className="text-gray-300 hover:text-white transition">Contact</button>
          <button 
            onClick={onGetStarted}
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-semibold transition"
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Smart Transit for{' '}
              <span className="text-green-400">Abia State</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Real-time bus tracking, digital payments, and seamless journey planning for modern public transportation.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={onGetStarted}
                className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-2 transition"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-xl font-semibold text-lg transition">
                Learn More
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-green-600/20 to-blue-600/20 rounded-2xl border border-white/10 p-8">
              <img 
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Bus" 
                className="rounded-xl w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Abia Way?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-card p-8 text-center hover:scale-105 transition">
            <div className="w-16 h-16 bg-green-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Live Tracking</h3>
            <p className="text-gray-400">Track buses in real-time on an interactive map with accurate ETAs</p>
          </div>
          <div className="glass-card p-8 text-center hover:scale-105 transition">
            <div className="w-16 h-16 bg-green-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Digital Wallet</h3>
            <p className="text-gray-400">Cashless payments with instant top-up and transaction history</p>
          </div>
          <div className="glass-card p-8 text-center hover:scale-105 transition">
            <div className="w-16 h-16 bg-green-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time ETA</h3>
            <p className="text-gray-400">Know exactly when your bus will arrive with accurate predictions</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
            <h4 className="font-semibold mb-2">Sign Up</h4>
            <p className="text-sm text-gray-400">Create your free account</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
            <h4 className="font-semibold mb-2">Load Wallet</h4>
            <p className="text-sm text-gray-400">Add funds to your digital wallet</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
            <h4 className="font-semibold mb-2">Plan Trip</h4>
            <p className="text-sm text-gray-400">Search and book your route</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
            <h4 className="font-semibold mb-2">Travel</h4>
            <p className="text-sm text-gray-400">Track and pay as you go</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-16">
        <div className="glass-card p-12">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">10K+</div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">50+</div>
              <div className="text-gray-400">Buses Tracked</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">100K+</div>
              <div className="text-gray-400">Trips Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">4.8★</div>
              <div className="text-gray-400">User Rating</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer - Only on Landing Page */}
<footer className="border-t border-white/10 mt-16">
  <div className="container mx-auto px-4 py-12">
    <div className="grid md:grid-cols-4 gap-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Bus className="w-6 h-6 text-green-400" />
          <span className="font-bold text-lg">Abia Way</span>
        </div>
        <p className="text-sm text-gray-400">Smart transit system for Abia State. Making travel easier, safer, and more efficient.</p>
      </div>
      <div>
        <h4 className="font-semibold mb-4">Quick Links</h4>
        <ul className="space-y-2 text-sm text-gray-400">
          <li><a href="#" className="hover:text-green-400 transition">About Us</a></li>
          <li><a href="#" className="hover:text-green-400 transition">Contact</a></li>
          <li><a href="#" className="hover:text-green-400 transition">FAQs</a></li>
          <li><a href="#" className="hover:text-green-400 transition">Support</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-4">Legal</h4>
        <ul className="space-y-2 text-sm text-gray-400">
          <li><a href="#" className="hover:text-green-400 transition">Terms of Service</a></li>
          <li><a href="#" className="hover:text-green-400 transition">Privacy Policy</a></li>
          <li><a href="#" className="hover:text-green-400 transition">Cookie Policy</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-4">Download App</h4>
        <div className="space-y-2">
          <button className="w-full bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition">
            <i data-lucide="apple" className="w-4 h-4 inline mr-2"></i>
            App Store
          </button>
          <button className="w-full bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition">
            <i data-lucide="chrome" className="w-4 h-4 inline mr-2"></i>
            Google Play
          </button>
        </div>
      </div>
    </div>
    <div className="mt-8 pt-8 text-center text-xs text-gray-500 border-t border-white/10">
      © {new Date().getFullYear()} Abia Way Transit System. All rights reserved.
    </div>
  </div>
</footer>
    </div>
  );
};

export default LandingPage;