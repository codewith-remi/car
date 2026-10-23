import { CustomerUser } from '../types/vehicle';
import { logActivity } from './storeService';

const STORAGE_KEY_USERS = 'autoplex_registered_users';
const STORAGE_KEY_SESSION = 'autoplex_customer_user';

export interface RegisteredUserRecord {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  phone: string;
  city: string;
  isVerified: boolean;
  verifiedAt?: string;
  verificationCode?: string;
  verificationExpires?: number;
  createdAt: string;
  lastLoginAt?: string;
  notificationPreferences: {
    emailAlerts: boolean;
    smsAlerts: boolean;
    priceDropAlerts: boolean;
  };
}

// Simple deterministic hash for browser credential validation
function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `apx_${Math.abs(hash).toString(36)}_${password.length * 31}`;
}

// Initial verified user accounts (including primary email codewithremi40@gmail.com)
const DEFAULT_ACCOUNTS: RegisteredUserRecord[] = [
  {
    id: 'usr-owner-001',
    email: 'codewithremi40@gmail.com',
    passwordHash: hashPassword('Autoplex2026!'),
    name: 'Remi (Verified Owner)',
    phone: '+1 (800) 555-2886',
    city: 'Dallas, TX',
    isVerified: true,
    verifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    notificationPreferences: {
      emailAlerts: true,
      smsAlerts: true,
      priceDropAlerts: true
    }
  }
];

export function getRegisteredUsers(): RegisteredUserRecord[] {
  if (typeof window === 'undefined') return DEFAULT_ACCOUNTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    // Ensure primary owner is always present
    const hasOwner = parsed.some((u: RegisteredUserRecord) => u.email.toLowerCase() === 'codewithremi40@gmail.com');
    if (!hasOwner) {
      parsed.push(DEFAULT_ACCOUNTS[0]);
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return DEFAULT_ACCOUNTS;
  }
}

function saveRegisteredUsers(users: RegisteredUserRecord[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
}

function sanitizeUser(record: RegisteredUserRecord): CustomerUser {
  return {
    id: record.id,
    email: record.email,
    name: record.name,
    phone: record.phone,
    city: record.city,
    isVerified: record.isVerified,
    verifiedAt: record.verifiedAt,
    createdAt: record.createdAt,
    notificationPreferences: record.notificationPreferences
  };
}

// Register a new user account with mandatory verification code
export function registerUser(params: {
  email: string;
  password: string;
  name: string;
  phone: string;
  city: string;
}): { 
  success: boolean; 
  message: string; 
  requiresVerification?: boolean; 
  verificationCode?: string;
  email?: string;
} {
  const emailNorm = params.email.trim().toLowerCase();

  if (!emailNorm || !params.password || !params.name) {
    return { success: false, message: 'All required fields (Name, Email, Password) must be filled.' };
  }

  if (params.password.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters in length.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailNorm)) {
    return { success: false, message: 'Please provide a valid email address.' };
  }

  const users = getRegisteredUsers();
  const existing = users.find(u => u.email.toLowerCase() === emailNorm);
  if (existing) {
    if (existing.isVerified) {
      return { success: false, message: 'An account with this email address already exists. Please sign in.' };
    } else {
      // Re-issue code for unverified existing registration
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      existing.verificationCode = newCode;
      existing.verificationExpires = Date.now() + 15 * 60 * 1000;
      saveRegisteredUsers(users);
      return {
        success: true,
        requiresVerification: true,
        verificationCode: newCode,
        email: emailNorm,
        message: 'Account previously registered but pending verification. We issued a new 6-digit verification code.'
      };
    }
  }

  // Generate 6-digit verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const newUser: RegisteredUserRecord = {
    id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    email: emailNorm,
    passwordHash: hashPassword(params.password),
    name: params.name.trim(),
    phone: params.phone.trim() || '(Unlisted)',
    city: params.city.trim() || 'Dallas, TX',
    isVerified: false,
    verificationCode,
    verificationExpires: Date.now() + 15 * 60 * 1000, // 15 mins expiry
    createdAt: new Date().toISOString(),
    notificationPreferences: {
      emailAlerts: true,
      smsAlerts: true,
      priceDropAlerts: true
    }
  };

  users.push(newUser);
  saveRegisteredUsers(users);

  logActivity(newUser.name, 'New User Registered', `Registered account for ${newUser.email} (Verification Code Generated)`, 'security');

  return {
    success: true,
    requiresVerification: true,
    verificationCode,
    email: emailNorm,
    message: 'Account created! Please enter the 6-digit verification code to verify your credentials.'
  };
}

// Verify user account with the 6-digit code
export function verifyAccount(email: string, code: string): {
  success: boolean;
  message: string;
  user?: CustomerUser;
} {
  const emailNorm = email.trim().toLowerCase();
  const users = getRegisteredUsers();
  const user = users.find(u => u.email.toLowerCase() === emailNorm);

  if (!user) {
    return { success: false, message: 'No registered account found with this email. Please register first.' };
  }

  if (user.isVerified) {
    const sanitized = sanitizeUser(user);
    setSession(sanitized);
    return { success: true, message: 'Account is already verified. You are now signed in.', user: sanitized };
  }

  if (!user.verificationCode || user.verificationCode !== code.trim()) {
    return { success: false, message: 'Invalid verification code. Please check the 6-digit code and try again.' };
  }

  if (user.verificationExpires && Date.now() > user.verificationExpires) {
    return { success: false, message: 'Verification code has expired. Please request a new code.' };
  }

  // Successfully verify user
  user.isVerified = true;
  user.verifiedAt = new Date().toISOString();
  delete user.verificationCode;
  delete user.verificationExpires;
  saveRegisteredUsers(users);

  const sanitized = sanitizeUser(user);
  setSession(sanitized);

  logActivity(user.name, 'Account Verified', `Email verification completed for ${user.email}`, 'security');

  return {
    success: true,
    message: 'Account successfully verified! Welcome to Autoplex Auto Group.',
    user: sanitized
  };
}

// Resend verification code
export function resendVerificationCode(email: string): {
  success: boolean;
  message: string;
  verificationCode?: string;
} {
  const emailNorm = email.trim().toLowerCase();
  const users = getRegisteredUsers();
  const user = users.find(u => u.email.toLowerCase() === emailNorm);

  if (!user) {
    return { success: false, message: 'No account found with this email.' };
  }

  if (user.isVerified) {
    return { success: false, message: 'This account is already verified. You can sign in directly.' };
  }

  const newCode = Math.floor(100000 + Math.random() * 900000).toString();
  user.verificationCode = newCode;
  user.verificationExpires = Date.now() + 15 * 60 * 1000;
  saveRegisteredUsers(users);

  return {
    success: true,
    message: 'A fresh 6-digit verification code has been dispatched.',
    verificationCode: newCode
  };
}

// Strict Login: checks credentials against registered database & validates verified status
export function loginUser(email: string, password: string): {
  success: boolean;
  message: string;
  requiresVerification?: boolean;
  verificationCode?: string;
  user?: CustomerUser;
} {
  const emailNorm = email.trim().toLowerCase();

  if (!emailNorm || !password) {
    return { success: false, message: 'Please enter both email address and password.' };
  }

  const users = getRegisteredUsers();
  const user = users.find(u => u.email.toLowerCase() === emailNorm);

  // 1. Account not registered
  if (!user) {
    return {
      success: false,
      message: 'No account found with this email. You must register first before signing in.'
    };
  }

  // 2. Check credentials
  const inputHash = hashPassword(password);
  if (user.passwordHash !== inputHash) {
    return {
      success: false,
      message: 'Incorrect password. Please verify your credentials and try again.'
    };
  }

  // 3. Check verification status
  if (!user.isVerified) {
    // Generate or fetch code
    let code = user.verificationCode;
    if (!code || (user.verificationExpires && Date.now() > user.verificationExpires)) {
      code = Math.floor(100000 + Math.random() * 900000).toString();
      user.verificationCode = code;
      user.verificationExpires = Date.now() + 15 * 60 * 1000;
      saveRegisteredUsers(users);
    }
    return {
      success: false,
      requiresVerification: true,
      verificationCode: code,
      message: 'Your account has not been verified yet. Please enter the 6-digit verification code to complete sign-in.'
    };
  }

  // 4. Success - Update last login and session
  user.lastLoginAt = new Date().toISOString();
  saveRegisteredUsers(users);

  const sanitized = sanitizeUser(user);
  setSession(sanitized);

  logActivity(user.name, 'User Signed In', `Successful login for verified user ${user.email}`, 'security');

  return {
    success: true,
    message: `Welcome back, ${user.name}!`,
    user: sanitized
  };
}

// Password Reset Request
export function requestPasswordReset(email: string): {
  success: boolean;
  message: string;
  code?: string;
} {
  const emailNorm = email.trim().toLowerCase();
  const users = getRegisteredUsers();
  const user = users.find(u => u.email.toLowerCase() === emailNorm);

  if (!user) {
    return { success: false, message: 'No registered account found with that email address.' };
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  user.verificationCode = resetCode;
  user.verificationExpires = Date.now() + 15 * 60 * 1000;
  saveRegisteredUsers(users);

  return {
    success: true,
    message: 'A password reset verification code has been generated.',
    code: resetCode
  };
}

// Complete Password Reset
export function resetPassword(email: string, code: string, newPass: string): {
  success: boolean;
  message: string;
} {
  const emailNorm = email.trim().toLowerCase();
  if (newPass.length < 6) {
    return { success: false, message: 'New password must be at least 6 characters.' };
  }

  const users = getRegisteredUsers();
  const user = users.find(u => u.email.toLowerCase() === emailNorm);

  if (!user) {
    return { success: false, message: 'No registered account found with that email.' };
  }

  if (!user.verificationCode || user.verificationCode !== code.trim()) {
    return { success: false, message: 'Invalid or incorrect reset code.' };
  }

  user.passwordHash = hashPassword(newPass);
  user.isVerified = true;
  user.verifiedAt = new Date().toISOString();
  delete user.verificationCode;
  delete user.verificationExpires;
  saveRegisteredUsers(users);

  logActivity(user.name, 'Password Reset', `Password successfully updated for ${user.email}`, 'security');

  return {
    success: true,
    message: 'Your password has been successfully reset! You can now sign in.'
  };
}

// Session persistence
export function getSession(): CustomerUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession(user: CustomerUser | null): void {
  if (typeof window === 'undefined') return;
  if (!user) {
    localStorage.removeItem(STORAGE_KEY_SESSION);
  } else {
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(user));
  }
}

export function logoutUser(): void {
  const current = getSession();
  if (current) {
    logActivity(current.name, 'User Signed Out', `User ${current.email} logged out`, 'security');
  }
  setSession(null);
}
