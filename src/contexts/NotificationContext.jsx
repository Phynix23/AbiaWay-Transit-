import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({ show: false, title: '', message: '' });

  const showNotification = (title, message) => {
    setNotification({ show: true, title, message });
    setTimeout(() => {
      setNotification({ show: false, title: '', message: '' });
    }, 3000);
  };

  const hideNotification = () => {
    setNotification({ show: false, title: '', message: '' });
  };

  return (
    <NotificationContext.Provider value={{ notification, showNotification, hideNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};