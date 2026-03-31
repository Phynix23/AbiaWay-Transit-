import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

// Real-time user database (in production, this would be from your backend)
const USER_DATABASE = {
  'abuoma@abiaway.gov.ng': {
    id: 'USR-001',
    name: 'Abuoma David',
    password: 'Abuoma@123',
    role: 'passenger',
    tier: 'Premium',
    avatar: 'AD',
    phone: '+234-801-234-5678',
    joinDate: '2024-01-15',
    lastLogin: null
  },
  'chidi@abiaway.gov.ng': {
    id: 'USR-002',
    name: 'Chidi Okonkwo',
    password: 'Driver@123',
    role: 'driver',
    tier: 'Professional',
    avatar: 'CO',
    phone: '+234-802-345-6789',
    joinDate: '2024-02-20',
    lastLogin: null
  },
  'admin@abiaway.gov.ng': {
    id: 'ADM-001',
    name: 'Admin User',
    password: 'Admin@123',
    role: 'admin',
    tier: 'Administrator',
    avatar: 'AU',
    phone: '+234-803-456-7890',
    joinDate: '2024-01-01',
    lastLogin: null
  },
  'ngozi@abiaway.gov.ng': {
    id: 'USR-003',
    name: 'Ngozi Eze',
    password: 'Ngozi@123',
    role: 'passenger',
    tier: 'Gold',
    avatar: 'NE',
    phone: '+234-804-567-8901',
    joinDate: '2024-03-01',
    lastLogin: null
  }
};

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(null);
  const [activeField, setActiveField] = useState(null);
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const { login } = useAuth();
  const { showNotification } = useNotification();

  // Load saved email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Email suggestions (auto-complete)
  useEffect(() => {
    if (email.length > 2 && !email.includes('@')) {
      const suggestions = Object.keys(USER_DATABASE).filter(userEmail => 
        userEmail.toLowerCase().includes(email.toLowerCase())
      ).slice(0, 3);
      setEmailSuggestions(suggestions);
    } else {
      setEmailSuggestions([]);
    }
  }, [email]);

  // Lockout timer
  useEffect(() => {
    if (loginAttempts >= 5) {
      setIsLocked(true);
      const timer = setTimeout(() => {
        setIsLocked(false);
        setLoginAttempts(0);
        showNotification('Account Unlocked', 'You can now try logging in again', 'info');
      }, 300000); // 5 minutes lockout
      setLockTimer(timer);
      
      return () => clearTimeout(timer);
    }
  }, [loginAttempts]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address (e.g., name@domain.com)';
    } else if (!Object.keys(USER_DATABASE).includes(email.toLowerCase())) {
      newErrors.email = 'No account found with this email';
    }
    
    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[A-Z])(?=.*[0-9])/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter and one number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRealTimeValidation = (field, value) => {
    if (field === 'email') {
      if (value && !/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(value)) {
        setErrors(prev => ({ ...prev, email: 'Invalid email format' }));
      } else if (value && !Object.keys(USER_DATABASE).includes(value.toLowerCase())) {
        setErrors(prev => ({ ...prev, email: 'Email not registered' }));
      } else {
        setErrors(prev => ({ ...prev, email: '' }));
      }
    }
    
    if (field === 'password') {
      if (value && value.length < 6) {
        setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
      } else if (value && !/(?=.*[A-Z])(?=.*[0-9])/.test(value)) {
        setErrors(prev => ({ ...prev, password: 'Must contain uppercase & number' }));
      } else {
        setErrors(prev => ({ ...prev, password: '' }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLocked) {
      showNotification('Account Locked', 'Too many failed attempts. Please try again later.', 'error');
      return;
    }
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = USER_DATABASE[email.toLowerCase()];
    
    // Real-time password verification
    if (user && user.password === password) {
      // Update last login time
      user.lastLogin = new Date().toISOString();
      
      // Handle remember me
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('userToken', `token_${user.id}_${Date.now()}`);
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('userToken');
      }
      
      // Store session
      sessionStorage.setItem('currentUser', JSON.stringify({
        ...user,
        password: undefined // Don't store password in session
      }));
      
      // Call login function from AuthContext
      const result = await login(email, password, user);
      
      if (result.success) {
        showNotification(
          'Welcome back!', 
          `Successfully logged in as ${user.name}`,
          'success'
        );
        
        // Reset login attempts on success
        setLoginAttempts(0);
        onClose();
        setEmail('');
        setPassword('');
        setErrors({});
      }
    } else {
      // Increment failed attempts
      setLoginAttempts(prev => prev + 1);
      const remainingAttempts = 4 - loginAttempts;
      
      showNotification(
        'Login Failed', 
        `Invalid credentials. ${remainingAttempts} attempts remaining before account lock.`,
        'error'
      );
      
      setErrors({ form: 'Invalid email or password' });
      
      // Clear password field on failure
      setPassword('');
    }
    
    setLoading(false);
  };

  const handleForgotPassword = () => {
    if (!email) {
      showNotification('Email Required', 'Please enter your email address first', 'warning');
      setActiveField('email');
      return;
    }
    
    const user = USER_DATABASE[email.toLowerCase()];
    if (user) {
      // Simulate sending reset link
      showNotification(
        'Password Reset', 
        `Reset link sent to ${email}. Check your inbox.`,
        'info'
      );
    } else {
      showNotification(
        'Email Not Found', 
        'No account found with this email address.',
        'error'
      );
    }
  };

  const handleQuickDemo = (demoUser) => {
    setEmail(demoUser);
    setPassword(USER_DATABASE[demoUser].password);
    setErrors({});
    setTimeout(() => {
      document.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true }));
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-[9999] animate-fadeIn">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-4 animate-slideUp">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-white/10 shadow-2xl">
          {/* Header with Lock Status */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white">Welcome Back</h3>
              <p className="text-sm text-gray-400 mt-1">Sign in to continue to Abia Way</p>
            </div>
            <div className="flex gap-2">
              {isLocked && (
                <div className="px-2 py-1 bg-red-500/20 rounded-lg text-red-400 text-xs">
                  🔒 Locked
                </div>
              )}
              <button 
                onClick={onClose} 
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
              >
                <i data-lucide="x" className="w-4 h-4 text-gray-400"></i>
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Email Field with Suggestions */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <i data-lucide="mail" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"></i>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    handleRealTimeValidation('email', e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  onFocus={() => setActiveField('email')}
                  onBlur={() => setTimeout(() => setActiveField(null), 200)}
                  placeholder="Enter your email"
                  className={`w-full bg-white/10 border ${
                    errors.email ? 'border-red-500' : errors.email === '' ? 'border-green-500' : 'border-white/20'
                  } rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition`}
                  disabled={isLocked}
                />
                {email && errors.email === '' && (
                  <i data-lucide="check-circle" className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500"></i>
                )}
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <i data-lucide="alert-circle" className="w-3 h-3"></i>
                  {errors.email}
                </p>
              )}
              
              {/* Email Suggestions */}
              {activeField === 'email' && emailSuggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-gray-800 rounded-lg border border-white/10 overflow-hidden">
                  {emailSuggestions.map(suggestion => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => {
                        setEmail(suggestion);
                        setEmailSuggestions([]);
                        handleRealTimeValidation('email', suggestion);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Password Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <i data-lucide="lock" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    handleRealTimeValidation('password', e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  placeholder="Enter your password"
                  className={`w-full bg-white/10 border ${
                    errors.password ? 'border-red-500' : errors.password === '' ? 'border-green-500' : 'border-white/20'
                  } rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition`}
                  disabled={isLocked}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  <i data-lucide={showPassword ? 'eye-off' : 'eye'} className="w-5 h-5"></i>
                </button>
                {password && errors.password === '' && (
                  <i data-lucide="check-circle" className="absolute right-12 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500"></i>
                )}
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <i data-lucide="alert-circle" className="w-3 h-3"></i>
                  {errors.password}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters with uppercase and number
              </p>
            </div>
            
            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/10 checked:bg-green-600 focus:ring-green-500"
                  disabled={isLocked}
                />
                <span className="text-sm text-gray-400">Remember me</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-green-400 hover:text-green-300 transition"
                disabled={isLocked}
              >
                Forgot Password?
              </button>
            </div>
            
            {/* Login Attempts Warning */}
            {loginAttempts > 0 && loginAttempts < 5 && (
              <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-400 text-sm flex items-center gap-2">
                  <i data-lucide="alert-triangle" className="w-4 h-4"></i>
                  {5 - loginAttempts} login attempt(s) remaining before account lock
                </p>
              </div>
            )}
            
            {errors.form && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <i data-lucide="alert-triangle" className="w-4 h-4"></i>
                  {errors.form}
                </p>
              </div>
            )}
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || isLocked}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verifying credentials...
                </>
              ) : (
                <>
                  <i data-lucide="log-in" className="w-5 h-5"></i>
                  Sign In
                </>
              )}
            </button>
          </form>
          
          {/* Quick Demo Accounts */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-xs text-gray-500 text-center mb-3">Quick Demo Accounts</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleQuickDemo('abuoma@abiaway.gov.ng')}
                className="text-xs bg-white/5 hover:bg-white/10 p-2 rounded-lg transition flex items-center justify-center gap-1"
              >
                <i data-lucide="user" className="w-3 h-3"></i>
                Passenger
              </button>
              <button
                onClick={() => handleQuickDemo('chidi@abiaway.gov.ng')}
                className="text-xs bg-white/5 hover:bg-white/10 p-2 rounded-lg transition flex items-center justify-center gap-1"
              >
                <i data-lucide="truck" className="w-3 h-3"></i>
                Driver
              </button>
              <button
                onClick={() => handleQuickDemo('admin@abiaway.gov.ng')}
                className="text-xs bg-white/5 hover:bg-white/10 p-2 rounded-lg transition flex items-center justify-center gap-1"
              >
                <i data-lucide="shield" className="w-3 h-3"></i>
                Admin
              </button>
              <button
                onClick={() => handleQuickDemo('ngozi@abiaway.gov.ng')}
                className="text-xs bg-white/5 hover:bg-white/10 p-2 rounded-lg transition flex items-center justify-center gap-1"
              >
                <i data-lucide="star" className="w-3 h-3"></i>
                Gold Member
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;