import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showNotification } = useNotification();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await login(email, password);
    
    if (result.success) {
      showNotification('Welcome back!', 'Successfully logged in');
      onClose();
      setEmail('');
      setPassword('');
    } else {
      showNotification('Login failed', 'Invalid email or password');
    }
    
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="modal-overlay absolute inset-0" onClick={onClose}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-4">
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Sign In</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <i data-lucide="x" className="w-6 h-6"></i>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                  required
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary py-3"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary py-3"
              >
                Cancel
              </button>
            </div>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
              Demo: any email/password works
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;