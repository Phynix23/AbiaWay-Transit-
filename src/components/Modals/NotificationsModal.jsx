import React from 'react';

const NotificationsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="modal-overlay absolute inset-0" onClick={onClose}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-4">
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Notifications</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <i data-lucide="x" className="w-6 h-6"></i>
            </button>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="bg-green-500/10 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium">Route Delay Alert</p>
                <span className="text-xs text-gray-400">5 min ago</span>
              </div>
              <p className="text-sm text-gray-400">Osisioma to Park route experiencing 10 min delay</p>
            </div>
            <div className="bg-blue-500/10 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium">Weather Alert</p>
                <span className="text-xs text-gray-400">1 hour ago</span>
              </div>
              <p className="text-sm text-gray-400">Heavy rain expected at 6 PM</p>
            </div>
          </div>
          
          <button className="w-full btn-secondary py-3 rounded-lg" onClick={onClose}>
            Mark All as Read
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;
