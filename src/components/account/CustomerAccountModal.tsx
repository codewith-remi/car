import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  CheckCircle, 
  Heart, 
  Clock, 
  LogOut, 
  ShieldCheck, 
  KeyRound, 
  ArrowRight,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { CustomerUser } from '../../types/vehicle';
import { getInquiries } from '../../services/storeService';
import { 
  loginUser, 
  registerUser, 
  verifyAccount, 
  resendVerificationCode, 
  requestPasswordReset, 
  resetPassword, 
  logoutUser 
} from '../../services/authService';

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
  const [tab, setTab] = useState<'login' | 'register' | 'verify' | 'forgot'>('login');
  
  // Login & Register Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');

  // Verification Form State
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [activeCodeHint, setActiveCodeHint] = useState<string | null>(null);

  // Password Reset State
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStep, setResetStep] = useState<'request' | 'submit'>('request');

  // Loading & Feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const clearMessages = () => {
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setIsLoading(true);

    const result = loginUser(email, password);
    setIsLoading(false);

    if (result.success && result.user) {
      onUserChange(result.user);
      setSuccessMsg(result.message);
      setTimeout(() => {
        setSuccessMsg('');
      }, 2000);
    } else {
      if (result.requiresVerification) {
        setVerificationEmail(email.trim().toLowerCase());
        if (result.verificationCode) {
          setActiveCodeHint(result.verificationCode);
        }
        setTab('verify');
        setErrorMsg(result.message);
      } else {
        setErrorMsg(result.message);
      }
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify and re-enter.');
      return;
    }

    setIsLoading(true);
    const result = registerUser({
      name,
      email,
      phone,
      city,
      password
    });
    setIsLoading(false);

    if (result.success) {
      setVerificationEmail(result.email || email.trim().toLowerCase());
      if (result.verificationCode) {
        setActiveCodeHint(result.verificationCode);
      }
      setTab('verify');
      setSuccessMsg(result.message);
    } else {
      setErrorMsg(result.message);
    }
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!verificationCode) {
      setErrorMsg('Please enter your 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    const result = verifyAccount(verificationEmail, verificationCode);
    setIsLoading(false);

    if (result.success && result.user) {
      onUserChange(result.user);
      setSuccessMsg(result.message);
      setActiveCodeHint(null);
      setVerificationCode('');
    } else {
      setErrorMsg(result.message);
    }
  };

  const handleResendCode = () => {
    clearMessages();
    if (!verificationEmail) {
      setErrorMsg('Please enter your email to resend code.');
      return;
    }

    const res = resendVerificationCode(verificationEmail);
    if (res.success) {
      if (res.verificationCode) {
        setActiveCodeHint(res.verificationCode);
      }
      setSuccessMsg(res.message);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleRequestReset = (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setIsLoading(true);
    const res = requestPasswordReset(email);
    setIsLoading(false);

    if (res.success) {
      setResetStep('submit');
      if (res.code) {
        setActiveCodeHint(res.code);
      }
      setSuccessMsg(res.message);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setIsLoading(true);
    const res = resetPassword(email, resetCode, newPassword);
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg(res.message);
      setTab('login');
      setResetStep('request');
      setPassword('');
      setResetCode('');
      setActiveCodeHint(null);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleLogout = () => {
    logoutUser();
    onUserChange(null);
    setTab('login');
    setSuccessMsg('You have been signed out.');
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const inquiries = getInquiries();
  const userInquiries = currentUser 
    ? inquiries.filter(i => i.customerEmail.toLowerCase() === currentUser.email.toLowerCase())
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-400/30 text-blue-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-display text-white">
                {currentUser ? currentUser.name : 'Customer Account'}
              </h3>
              <span className="text-[11px] text-slate-300">
                {currentUser ? (
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Customer Account
                  </span>
                ) : (
                  'Verified Access & Inquiry Management'
                )}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Notifications */}
        {errorMsg && (
          <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <div className="flex-1 leading-relaxed">{errorMsg}</div>
          </div>
        )}
        {successMsg && (
          <div className="mx-5 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-start gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            <div className="flex-1 leading-relaxed">{successMsg}</div>
          </div>
        )}

        {/* VIEW 1: SIGNED IN PROFILE */}
        {currentUser ? (
          <div className="p-6 space-y-6">
            
            {/* Account Status Badge */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 text-xs space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-900">Verified Credentials</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Active & Verified
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Account Email:</span>
                <span className="font-medium text-slate-900 font-mono text-[11px]">{currentUser.email}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Contact Phone:</span>
                <span className="font-medium text-slate-900">{currentUser.phone}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Fulfillment City:</span>
                <span className="font-medium text-slate-900">{currentUser.city}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Member Since:</span>
                <span className="font-medium text-slate-900">{new Date(currentUser.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onViewFavorites}
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-500 hover:shadow-xs transition-all text-left cursor-pointer"
              >
                <Heart className="w-4 h-4 text-rose-500 mb-1" />
                <span className="text-xs font-bold text-slate-900 block">Saved Vehicles</span>
                <span className="text-[10px] text-slate-500">Shortlisted cars</span>
              </button>

              <button
                onClick={onBrowse}
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-500 hover:shadow-xs transition-all text-left cursor-pointer"
              >
                <User className="w-4 h-4 text-blue-600 mb-1" />
                <span className="text-xs font-bold text-slate-900 block">Browse 5,000+ Cars</span>
                <span className="text-[10px] text-slate-500">$2,500 – $8,000</span>
              </button>
            </div>

            {/* Submitted Inquiries by User */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 text-xs">
                  Your Purchase Inquiries ({userInquiries.length})
                </span>
                <span className="text-[10px] text-slate-400">Routed to codewithremi40@gmail.com</span>
              </div>

              {userInquiries.length === 0 ? (
                <div className="text-xs text-slate-500 p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center">
                  You haven't submitted any vehicle inquiries yet.
                </div>
              ) : (
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {userInquiries.map((inq) => (
                    <div key={inq.id} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs flex justify-between items-center">
                      <div>
                        <span className="font-mono font-bold text-blue-600">{inq.referenceNumber}</span>
                        <span className="text-slate-500 block text-[11px] truncate max-w-44">
                          {inq.items[0]?.vehicleTitle || 'Vehicle'} · ${inq.totalValue.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {inq.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sign Out Action */}
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
              <button
                onClick={handleLogout}
                className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1.5 cursor-pointer font-semibold"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* AUTHENTICATION TABS & SCREENS */
          <div className="p-6">
            
            {/* Top Switcher (Login vs Register) */}
            {(tab === 'login' || tab === 'register') && (
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl mb-5">
                <button
                  type="button"
                  onClick={() => {
                    clearMessages();
                    setTab('login');
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    tab === 'login' 
                      ? 'bg-white text-slate-950 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    clearMessages();
                    setTab('register');
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    tab === 'register' 
                      ? 'bg-white text-slate-950 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Register Account
                </button>
              </div>
            )}

            {/* TAB 1: LOGIN */}
            {tab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. name@example.com"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        clearMessages();
                        setTab('forgot');
                      }}
                      className="text-[11px] text-blue-600 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {isLoading ? 'Verifying Credentials...' : 'Sign In with Verified Account'}
                </button>

                <div className="pt-3 border-t border-slate-100 text-center">
                  <span className="text-xs text-slate-500">
                    Don't have an account yet?{' '}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      clearMessages();
                      setTab('register');
                    }}
                    className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                  >
                    Register here first
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: REGISTER */}
            {tab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-0.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Henderson"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
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
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-0.5">
                      Phone (for SMS) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 012-3456"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
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
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-0.5">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-0.5">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-xs cursor-pointer mt-2"
                >
                  {isLoading ? 'Creating Account...' : 'Register & Receive Verification Code'}
                </button>

                <p className="text-[11px] text-slate-500 text-center pt-1">
                  Only verified accounts with valid credentials can log in to Autoplex.
                </p>
              </form>
            )}

            {/* TAB 3: VERIFICATION CODE ENTRY */}
            {tab === 'verify' && (
              <form onSubmit={handleVerifySubmit} className="space-y-4">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2 border border-blue-200">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 font-display">
                    Verify Your Account
                  </h4>
                  <p className="text-xs text-slate-600">
                    Enter the 6-digit verification code dispatched for <strong className="text-slate-900 font-mono">{verificationEmail}</strong>
                  </p>
                </div>

                {/* Active Code Notice for instant testing */}
                {activeCodeHint && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center">
                    <span className="text-[11px] text-blue-700 block font-medium">Verification Code Dispatched:</span>
                    <span className="text-lg font-mono font-extrabold text-blue-900 tracking-widest">{activeCodeHint}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 text-center">
                    6-Digit Verification Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full text-center text-lg font-mono font-bold tracking-widest py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isLoading ? 'Verifying...' : 'Verify & Activate Account'}</span>
                </button>

                <div className="flex justify-between items-center text-xs pt-2">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-blue-600 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Resend Code</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      clearMessages();
                      setTab('login');
                    }}
                    className="text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}

            {/* TAB 4: FORGOT PASSWORD */}
            {tab === 'forgot' && (
              <div>
                {resetStep === 'request' ? (
                  <form onSubmit={handleRequestReset} className="space-y-4">
                    <div className="text-center space-y-1">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center mx-auto mb-2">
                        <KeyRound className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 font-display">
                        Reset Your Password
                      </h4>
                      <p className="text-xs text-slate-600">
                        Enter your registered email to receive a password reset code.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Registered Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-xs cursor-pointer"
                    >
                      {isLoading ? 'Sending Code...' : 'Send Reset Code'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        clearMessages();
                        setTab('login');
                      }}
                      className="w-full text-center text-xs text-slate-500 hover:text-slate-800 cursor-pointer pt-1"
                    >
                      Cancel and return to Sign In
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleResetSubmit} className="space-y-4">
                    <div className="text-center space-y-1">
                      <h4 className="text-sm font-bold text-slate-900 font-display">
                        Enter Reset Code & New Password
                      </h4>
                      <p className="text-xs text-slate-600">
                        Code dispatched for <strong className="text-slate-900 font-mono">{email}</strong>
                      </p>
                    </div>

                    {activeCodeHint && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center">
                        <span className="text-[11px] text-blue-700 block font-medium">Reset Code:</span>
                        <span className="text-lg font-mono font-extrabold text-blue-900 tracking-widest">{activeCodeHint}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        6-Digit Reset Code *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="123456"
                        className="w-full text-center text-base font-mono font-bold py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        New Password (min 6 characters) *
                      </label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-xs cursor-pointer"
                    >
                      {isLoading ? 'Resetting Password...' : 'Save New Password & Sign In'}
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
