import React from 'react';
import { Bus, Wallet, Clock, Shield, ArrowRight } from 'lucide-react';

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">Abia Way</span>
          </div>
          <button 
            onClick={onGetStarted}
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-semibold transition"
          >
            Launch App
          </button>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Smart Transit for{' '}
              <span className="text-green-400">Abia State</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Real-time bus tracking, digital payments, and seamless journey planning for modern public transportation.
            </p>
            <button 
              onClick={onGetStarted}
              className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-2 transition"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <img 
              src="/bus-hero.svg" 
              alt="Bus" 
              className="rounded-2xl"
              onError={(e) => e.target.style.display = 'none'} // Hide if image missing
            />
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="glass-card p-6">
            <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center mb-4">
              <Bus className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Live Tracking</h3>
            <p className="text-gray-400">Track buses in real-time on an interactive map</p>
          </div>
          <div className="glass-card p-6">
            <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center mb-4">
              <Wallet className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Digital Wallet</h3>
            <p className="text-gray-400">Cashless payments with quick top-up options</p>
          </div>
          <div className="glass-card p-6">
            <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time ETA</h3>
            <p className="text-gray-400">Know exactly when your bus will arrive</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;