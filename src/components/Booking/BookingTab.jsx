import React, { useState } from 'react';
import { useBooking } from '../../contexts/BookingContext';
import { useWallet } from '../../contexts/WalletContext';
import { useNotification } from '../../contexts/NotificationContext';
import RouteSearch from './RouteSearch';
import SeatSelection from './SeatSelection';
import PaymentMethod from './PaymentMethod';
import BookingSummary from './BookingSummary';
import BookingHistory from './BookingHistory';
import SavedRoutes from './SavedRoutes';

const BookingTab = () => {
  const [step, setStep] = useState(1);
  const [bookingDetails, setBookingDetails] = useState({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0],
    time: '08:00',
    passengers: 1,
    route: null,
    seats: [],
    vehicleType: 'standard',
    paymentMethod: 'wallet'
  });

  const { createBooking, addRecentSearch } = useBooking();
  const { balance, deductFunds } = useWallet();
  const { showNotification } = useNotification();

  const handleSearch = (searchData) => {
    setBookingDetails(prev => ({ ...prev, ...searchData }));
    addRecentSearch(searchData);
    setStep(2);
  };

  const handleRouteSelect = (route) => {
    setBookingDetails(prev => ({ ...prev, route }));
    setStep(3);
  };

  const handleSeatSelect = (seats) => {
    setBookingDetails(prev => ({ ...prev, seats }));
    setStep(4);
  };

  const handlePayment = async () => {
    const amount = bookingDetails.route.fare * bookingDetails.passengers;
    
    if (bookingDetails.paymentMethod === 'wallet' && balance < amount) {
      showNotification('Insufficient Balance', 'Please top up your wallet');
      return;
    }

    if (bookingDetails.paymentMethod === 'wallet') {
      deductFunds(amount, `Bus Booking: ${bookingDetails.from} → ${bookingDetails.to}`);
    }

    const newBooking = createBooking({
      ...bookingDetails,
      fare: amount,
      status: 'confirmed'
    });

    showNotification(
      'Booking Confirmed! 🎉',
      `Your trip from ${bookingDetails.from} to ${bookingDetails.to} is confirmed`
    );

    // Reset after 3 seconds
    setTimeout(() => {
      setStep(1);
      setBookingDetails({
        from: '',
        to: '',
        date: new Date().toISOString().split('T')[0],
        time: '08:00',
        passengers: 1,
        route: null,
        seats: [],
        vehicleType: 'standard',
        paymentMethod: 'wallet'
      });
    }, 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Booking Area */}
      <div className="lg:col-span-2 space-y-6">
        {/* Progress Steps */}
        <div className="glass-card p-6">
          <div className="flex justify-between mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex-1 relative">
                <div className={`step-indicator flex items-center ${
                  s < step ? 'completed' : s === step ? 'active' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    s < step 
                      ? 'bg-green-600 text-white' 
                      : s === step 
                      ? 'bg-primary text-white ring-4 ring-primary/30' 
                      : 'bg-white/10 text-gray-400'
                  }`}>
                    {s < step ? <i data-lucide="check" className="w-4 h-4" /> : s}
                  </div>
                  <div className={`flex-1 h-1 ml-2 ${
                    s < step ? 'bg-green-600' : 'bg-white/10'
                  }`} />
                </div>
                <p className="text-xs mt-2 text-gray-400">
                  {s === 1 && 'Search'}
                  {s === 2 && 'Select Route'}
                  {s === 3 && 'Choose Seats'}
                  {s === 4 && 'Payment'}
                </p>
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">
            {step === 1 && (
              <RouteSearch 
                onSearch={handleSearch} 
                initialData={bookingDetails}
              />
            )}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">
                  Available Routes from {bookingDetails.from} to {bookingDetails.to}
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      id: 1,
                      name: 'Express Route',
                      via: 'Umuahia-Aba Expressway',
                      duration: '25 mins',
                      fare: 3500,
                      departures: ['08:00', '08:30', '09:00', '09:30'],
                      available: 24
                    },
                    {
                      id: 2,
                      name: 'Local Route',
                      via: 'Bende Road',
                      duration: '35 mins',
                      fare: 2000,
                      departures: ['08:15', '08:45', '09:15', '09:45'],
                      available: 18
                    },
                    {
                      id: 3,
                      name: 'Scenic Route',
                      via: 'Ohafia',
                      duration: '45 mins',
                      fare: 1550,
                      departures: ['08:30', '09:00', '09:30', '10:00'],
                      available: 32
                    }
                  ].map(route => (
                    <div
                      key={route.id}
                      className={`route-item p-4 cursor-pointer transition-all hover:scale-[1.02] ${
                        bookingDetails.route?.id === route.id ? 'selected border-primary' : ''
                      }`}
                      onClick={() => {
                        setBookingDetails(prev => ({ ...prev, route }));
                        handleRouteSelect(route);
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-lg">{route.name}</h4>
                            <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">
                              {route.duration}
                            </span>
                            <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                              {route.available} seats left
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 mb-2">
                            <i data-lucide="map-pin" className="w-3 h-3 inline mr-1"></i>
                            Via: {route.via}
                          </p>
                          <div className="flex gap-2 mt-2">
                            {route.departures.map(time => (
                              <button
                                key={time}
                                className="text-xs px-3 py-1 bg-white/10 rounded-lg hover:bg-primary/20 transition"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setBookingDetails(prev => ({ ...prev, time }));
                                }}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-3xl font-bold text-primary">₦{route.fare}</p>
                          <p className="text-xs text-gray-400">per seat</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {step === 3 && (
              <SeatSelection 
                onSelect={handleSeatSelect}
                selectedSeats={bookingDetails.seats}
                passengers={bookingDetails.passengers}
              />
            )}
            {step === 4 && (
              <div className="space-y-6">
                <PaymentMethod 
                  selected={bookingDetails.paymentMethod}
                  onSelect={(method) => setBookingDetails(prev => ({ ...prev, paymentMethod: method }))}
                />
                <BookingSummary 
                  details={bookingDetails}
                  onConfirm={handlePayment}
                />
              </div>
            )}
          </div>
        </div>

        {/* Recent Bookings */}
        <BookingHistory />
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Saved Routes */}
        <SavedRoutes onSelect={(route) => {
          setBookingDetails(prev => ({ ...prev, ...route }));
          setStep(2);
        }} />

        {/* Promotions */}
        <div className="glass-card p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <i data-lucide="gift" className="text-primary"></i>
            Special Offers
          </h3>
          <div className="space-y-3">
            <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">First Ride</p>
                  <p className="text-xs text-gray-400">50% off your first booking</p>
                </div>
                <span className="text-xs bg-purple-500/30 px-2 py-1 rounded-full">NEW</span>
              </div>
              <p className="text-xs text-primary mt-2">Code: WELCOME50</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg border border-green-500/30">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">Weekend Special</p>
                  <p className="text-xs text-gray-400">25% off express rides</p>
                </div>
                <span className="text-xs bg-green-500/30 px-2 py-1 rounded-full">WEEKEND</span>
              </div>
              <p className="text-xs text-primary mt-2">Valid Sat-Sun</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">Group Discount</p>
                  <p className="text-xs text-gray-400">20% off for 4+ passengers</p>
                </div>
                <span className="text-xs bg-yellow-500/30 px-2 py-1 rounded-full">GROUP</span>
              </div>
              <p className="text-xs text-primary mt-2">Auto-applied at checkout</p>
            </div>
          </div>
        </div>

        {/* Travel Tips */}
        <div className="glass-card p-4">
          <h3 className="text-lg font-semibold mb-3">✨ Travel Tips</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <i data-lucide="clock" className="w-4 h-4 text-primary mt-0.5"></i>
              <span>Arrive 15 mins before departure</span>
            </li>
            <li className="flex items-start gap-2">
              <i data-lucide="credit-card" className="w-4 h-4 text-primary mt-0.5"></i>
              <span>Use wallet for 5% cashback</span>
            </li>
            <li className="flex items-start gap-2">
              <i data-lucide="smartphone" className="w-4 h-4 text-primary mt-0.5"></i>
              <span>Digital tickets save paper</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BookingTab;