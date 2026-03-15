import React, { createContext, useState, useContext } from 'react';

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [currentBooking, setCurrentBooking] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([
    {
      id: 'BK-001',
      route: 'Umuahia → Aba',
      date: '2024-03-14',
      time: '08:30',
      seats: ['A12'],
      fare: 350,
      status: 'completed',
      bus: 'AB-101'
    },
    {
      id: 'BK-002',
      route: 'Aba → Umuahia',
      date: '2024-03-13',
      time: '17:45',
      seats: ['B04', 'B05'],
      fare: 700,
      status: 'completed',
      bus: 'AB-102'
    }
  ]);
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);

  const createBooking = (bookingDetails) => {
    const newBooking = {
      id: `BK-${Date.now()}`,
      ...bookingDetails,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    setCurrentBooking(newBooking);
    setBookingHistory(prev => [newBooking, ...prev]);
    return newBooking;
  };

  const cancelBooking = (bookingId) => {
    setBookingHistory(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' } 
          : booking
      )
    );
  };

  const saveRoute = (route) => {
    setSavedRoutes(prev => {
      if (prev.some(r => r.id === route.id)) return prev;
      return [route, ...prev].slice(0, 10);
    });
  };

  const addRecentSearch = (search) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(s => 
        s.from !== search.from || s.to !== search.to
      );
      return [search, ...filtered].slice(0, 5);
    });
  };

  return (
    <BookingContext.Provider value={{
      currentBooking,
      bookingHistory,
      savedRoutes,
      recentSearches,
      createBooking,
      cancelBooking,
      saveRoute,
      addRecentSearch
    }}>
      {children}
    </BookingContext.Provider>
  );
};