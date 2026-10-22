import React, { useState } from 'react';
import { X, User, Mail, Lock, Phone, MapPin, CheckCircle, Heart, Clock, LogOut } from 'lucide-react';
import { CustomerUser, PurchaseInquiry } from '../../types/vehicle';
import { setCustomerSession, getInquiries } from '../../services/storeService';

interface CustomerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CustomerUser | null;
  onUserChange: (user: CustomerUser | null) => void;
  onViewFavorites: () => void;
  onBrowse: () => void;
}

export const CustomerAccountModal: React.FC<CustomerAccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
  onViewFavorites,
  onBrowse
}) => {
  const [tab, setTab] = useState<'login' | 'register' | 'profile' | 'inquiries'>('login');
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    // Simulate user session
    const customer: CustomerUser = {
      id: `cust-${Date.now()}`,
      email,
      name: name || email.split('@')[0],
      phone: phone || '(214) 555-0199',
      city: city || 'Dallas, TX',
      createdAt: new Date().toISOString(),
      notificationPreferences: {
        emailAlerts: true,
        smsAlerts: false,
        priceDropAlerts: true
      }
    };
    setCustomerSession(customer);
    onUserChange(customer);
    setSuccessMsg('Signed in successfully.');
    setErrorMsg('');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      setErrorMsg('Please enter your full name and valid email.');
      return;
    }
    const customer: CustomerUser = {
      id: `cust-${Date.now()}`,
      email,
      name,
      phone: phone || '(214) 555-0199',
      city: city || 'Dallas, TX',
      createdAt: new Date().toISOString(),
      notificationPreferences: {
        emailAlerts: true,
        smsAlerts: false,
        priceDropAlerts: true
      }
    };
    setCustomerSession(customer);
    onUserChange(customer);
    setSuccessMsg('Account registered successfully!');
    setErrorMsg('');
  };

  const handleLogout = () => {
    setCustomerSession(null);
    onUserChange(null);
    setSuccessMsg('Signed out.');
  };

  const inquiries = getInquiries();
  const userInquiries = currentUser 
    ? inquiries.filter(i => i.customerEmail.toLowerCase() === currentUser.email.toLowerCase())
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-display text-slate-900">
                {currentUser ? `Welcome, ${currentUser.name}` : 'Autoplex Customer Account'}
              </h3>
              <span className="text-[11px] text-slate-500">
                {currentUser ? currentUser.email : 'Sign in to access your inquiries & saved vehicles'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback messages */}
        {errorMsg && (
          <div className="mx-5 mt-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mx-5 mt-4 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg">
            {successMsg}
          </div>
        )}

        {/* Logged In View */}
        {currentUser ? (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onViewFavorites}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-500 text-left transition-all cursor-pointer"
              >
                <Heart className="w-5 h-5 text-rose-500 mb-2" />
                <span className="text-xs font-bold text-slate-900 block">Saved Vehicles</span>
                <span className="text-[11px] text-slate-500">View shortlisted cars</span>
              </button>

              <button
                onClick={onBrowse}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-500 text-left transition-all cursor-pointer"
              >
                <User className="w-5 h-5 text-blue-600 mb-2" />
                <span className="text-xs font-bold text-slate-900 block">Browse 5,000+ Cars</span>
                <span className="text-[11px] text-slate-500">Cars under $8,000</span>
              </button>
            </div>

            {/* Profile Info */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-900 block text-xs">Customer Profile</span>
              <div className="flex justify-between text-slate-600">
                <span>Phone:</span>
                <span className="font-medium text-slate-900">{currentUser.phone}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>City:</span>
                <span className="font-medium text-slate-900">{currentUser.city}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Member Since:</span>
                <span className="font-medium text-slate-900">{new Date(currentUser.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Inquiries submitted by user */}
            <div>
              <span className="font-bold text-slate-900 block text-xs mb-2">
                Your Submitted Inquiries ({userInquiries.length})
              </span>
              {userInquiries.length === 0 ? (
                <div className="text-xs text-slate-500 p-3 bg-slate-50 rounded-lg text-center">
                  You have not submitted any vehicle purchase inquiries yet.
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {userInquiries.map((inq) => (
                    <div key={inq.id} className="p-2.5 rounded-lg border border-slate-200 bg-white text-xs flex justify-between items-center">
                      <div>
                        <span className="font-mono font-bold text-blue-600">{inq.referenceNumber}</span>
                        <span className="text-slate-500 block text-[11px]">{inq.items.length} vehicle(s) · ${inq.totalValue.toLocaleString()}</span>
                      </div>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                        {inq.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Logout button */}
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
              <button
                onClick={handleLogout}
                className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1.5 cursor-pointer font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* Login / Register Form */
          <div className="p-6">
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg mb-5">
              <button
                onClick={() => setTab('login')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  tab === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setTab('register')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  tab === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>

            {tab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Quick sign-in enabled</span>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('customer@autoplex.com');
                      setPassword('password123');
                    }}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    Use Demo Credentials
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  Sign In to Account
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-0.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jessica Taylor"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-0.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jessica@example.com"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-0.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(214) 555-0199"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-0.5">
                      City, State
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Dallas, TX"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-0.5">
                    Create Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs cursor-pointer mt-2"
                >
                  Create Free Account
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
