import { PurchaseInquiry, CustomerUser, SiteSettings, ActivityLog, Vehicle } from '../types/vehicle';

const STORAGE_KEY_FAVORITES = 'autoplex_favorites';
const STORAGE_KEY_COMPARE = 'autoplex_compare_ids';
const STORAGE_KEY_INQUIRIES = 'autoplex_inquiries';
const STORAGE_KEY_CUSTOMER = 'autoplex_customer_user';
const STORAGE_KEY_SETTINGS = 'autoplex_site_settings';
const STORAGE_KEY_LOGS = 'autoplex_activity_logs';
const STORAGE_KEY_CART = 'autoplex_inquiry_cart';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  announcementText: '🔥 Verified Pre-Owned Event: Over 5,000 Vehicles Priced Strictly Between $2,500 and $8,000!',
  announcementEnabled: true,
  supportPhone: '+1 (800) 555-AUTO',
  supportEmail: 'codewithremi40@gmail.com',
  dealershipAddress: '10400 Expressway Blvd, Dallas, TX 75238',
  heroHeadline: 'Your Next Car. Your Best Deal.',
  heroSubheadline: 'Discover thousands of reliable, certified pre-owned vehicles strictly priced between $2,500 and $8,000. Comprehensive mechanical check on every vehicle.',
  aboutText: 'Autoplex Auto Group was founded with a single mission: to make dependable, safe transportation accessible to every driver without the burden of overwhelming auto debt. Every vehicle in our 5,000+ catalog is price-capped strictly between $2,500 and $8,000.'
};

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    user: 'Sarah Jenkins (Super Admin)',
    action: 'Inventory Verification',
    details: 'Verified 120-point mechanical certifications for incoming batch APX-10001 through APX-10050',
    category: 'inventory'
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    user: 'Marcus Vance (Sales Agent)',
    action: 'Inquiry Follow-up',
    details: 'Sent test-drive coordination email to client for 2012 Toyota Camry LE (APX-10001)',
    category: 'inquiry'
  },
  {
    id: 'log-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 340).toISOString(),
    user: 'Elena Rostova (Inventory Mgr)',
    action: 'Price Audit Passed',
    details: 'Catalog audit confirmed: 100% of vehicles conform to strict <$8,000 price ceiling.',
    category: 'system'
  }
];

export const INITIAL_INQUIRIES: PurchaseInquiry[] = [
  {
    id: 'inq-101',
    referenceNumber: 'INQ-2026-8942',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    customerName: 'David Miller',
    customerEmail: 'david.miller@example.com',
    customerPhone: '(214) 555-0182',
    preferredContact: 'Phone',
    deliveryRequired: true,
    deliveryCity: 'Fort Worth',
    deliveryPostalCode: '76102',
    deliveryRegion: 'TX',
    deliveryQuoteEstimate: 145,
    customerMessage: 'Interested in financing or outright cash purchase for the 2012 Camry LE. Can I inspect it on Saturday morning?',
    status: 'Contacted',
    items: [
      {
        vehicleId: 'APX-10001',
        vehicleTitle: '2012 Toyota Camry LE',
        price: 4795,
        mainImage: '/src/assets/images/featured_reliable_sedan_1792687190969.jpg',
        vin: '1HGTO4B89EU10001',
        location: 'Dallas, TX'
      }
    ],
    totalValue: 4795,
    internalNotes: [
      {
        id: 'note-1',
        author: 'Marcus Vance',
        createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        note: 'Customer is pre-approved with his credit union. Awaiting confirmation for Saturday 10:30 AM appointment.'
      }
    ],
    replyHistory: [
      {
        id: 'rep-1',
        sender: 'Marcus Vance (Autoplex)',
        sentAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        message: 'Hello David, thank you for your inquiry! The 2012 Camry is prepped and ready on our Dallas lot. Saturday at 10:30 AM is reserved for your walkthrough.'
      }
    ]
  },
  {
    id: 'inq-102',
    referenceNumber: 'INQ-2026-9104',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    customerName: 'Amanda Brooks',
    customerEmail: 'a.brooks@example.com',
    customerPhone: '(404) 555-8491',
    preferredContact: 'Email',
    deliveryRequired: true,
    deliveryCity: 'Atlanta',
    deliveryPostalCode: '30303',
    deliveryRegion: 'GA',
    deliveryQuoteEstimate: 320,
    customerMessage: 'Does this Honda CR-V have any open recalls or need new tires? Need delivery to Atlanta area.',
    status: 'New',
    items: [
      {
        vehicleId: 'APX-10010',
        vehicleTitle: '2011 Honda CR-V EX',
        price: 5895,
        mainImage: '/src/assets/images/featured_compact_suv_1792687189958.jpg',
        vin: '1HGHO7C91EU10010',
        location: 'Atlanta, GA'
      }
    ],
    totalValue: 5895,
    internalNotes: [],
    replyHistory: []
  }
];

// Cart State (Vehicle IDs saved for purchase inquiry)
export function getInquiryCart(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CART);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToInquiryCart(vehicleId: string): void {
  if (typeof window === 'undefined') return;
  const cart = getInquiryCart();
  if (!cart.includes(vehicleId)) {
    cart.push(vehicleId);
    localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
  }
}

export function removeFromInquiryCart(vehicleId: string): void {
  if (typeof window === 'undefined') return;
  let cart = getInquiryCart();
  cart = cart.filter(id => id !== vehicleId);
  localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
}

export function clearInquiryCart(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_CART);
}

// Favorites State
export function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FAVORITES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(vehicleId: string): boolean {
  if (typeof window === 'undefined') return false;
  const favs = getFavorites();
  const exists = favs.includes(vehicleId);
  let updated: string[];
  if (exists) {
    updated = favs.filter(id => id !== vehicleId);
  } else {
    updated = [...favs, vehicleId];
  }
  localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(updated));
  return !exists;
}

// Compare State (Up to 4 vehicles)
export function getComparisonIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMPARE);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToComparison(vehicleId: string): { success: boolean; message: string } {
  if (typeof window === 'undefined') return { success: false, message: 'Unavailable' };
  const list = getComparisonIds();
  if (list.includes(vehicleId)) {
    return { success: false, message: 'Vehicle already in comparison' };
  }
  if (list.length >= 4) {
    return { success: false, message: 'You can compare at most 4 vehicles at a time' };
  }
  list.push(vehicleId);
  localStorage.setItem(STORAGE_KEY_COMPARE, JSON.stringify(list));
  return { success: true, message: 'Added to comparison' };
}

export function removeFromComparison(vehicleId: string): void {
  if (typeof window === 'undefined') return;
  let list = getComparisonIds();
  list = list.filter(id => id !== vehicleId);
  localStorage.setItem(STORAGE_KEY_COMPARE, JSON.stringify(list));
}

export function clearComparison(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_COMPARE);
}

// Inquiries State
export function getInquiries(): PurchaseInquiry[] {
  if (typeof window === 'undefined') return INITIAL_INQUIRIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INQUIRIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(INITIAL_INQUIRIES));
      return INITIAL_INQUIRIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_INQUIRIES;
  }
}

export function generateInquiryMailtoLink(inquiry: PurchaseInquiry): string {
  const recipient = 'codewithremi40@gmail.com';
  const vehicleList = inquiry.items.map(i => `${i.vehicleTitle} ($${i.price.toLocaleString()}, VIN: ${i.vin}, Location: ${i.location})`).join('\n');
  const subject = encodeURIComponent(`Autoplex Inquiry [${inquiry.referenceNumber}] - ${inquiry.items[0]?.vehicleTitle || 'Vehicle'}`);
  const bodyText = `Hello Autoplex Auto Group (codewithremi40@gmail.com),

I would like to submit an inquiry / SMS question regarding this vehicle:

${vehicleList}

--- Customer Contact Details ---
Name: ${inquiry.customerName}
Phone / SMS: ${inquiry.customerPhone}
Email: ${inquiry.customerEmail}
Preferred Contact: ${inquiry.preferredContact}
Delivery: ${inquiry.deliveryRequired ? `Yes (Destination: ${inquiry.deliveryCity || ''} ${inquiry.deliveryPostalCode || ''})` : 'Lot Pickup'}

--- Customer Message ---
${inquiry.customerMessage || 'Please confirm availability and appointment options for this vehicle.'}

Reference Number: ${inquiry.referenceNumber}
(Reply directly to this email to contact the customer)`;

  return `mailto:${recipient}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
}

export function generateInquirySmsLink(phone: string, text: string): string {
  return `sms:${phone}?body=${encodeURIComponent(text)}`;
}

export function submitInquiry(inquiryData: Omit<PurchaseInquiry, 'id' | 'referenceNumber' | 'createdAt' | 'updatedAt' | 'internalNotes' | 'replyHistory'>): PurchaseInquiry {
  const inquiries = getInquiries();
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const ref = `INQ-${new Date().getFullYear()}-${randNum}`;
  const now = new Date().toISOString();

  const newInquiry: PurchaseInquiry = {
    ...inquiryData,
    id: `inq-${Date.now()}`,
    referenceNumber: ref,
    createdAt: now,
    updatedAt: now,
    internalNotes: [],
    replyHistory: []
  };

  inquiries.unshift(newInquiry);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(inquiries));
    logActivity(
      newInquiry.customerName,
      'Inquiry Dispatched to codewithremi40@gmail.com',
      `Delivered inquiry ${ref} to codewithremi40@gmail.com. Reply-To set to ${newInquiry.customerEmail} / Phone ${newInquiry.customerPhone}`,
      'inquiry'
    );
  }

  return newInquiry;
}

export function updateInquiryStatus(id: string, status: PurchaseInquiry['status']): void {
  const inquiries = getInquiries();
  const target = inquiries.find(i => i.id === id);
  if (target) {
    target.status = status;
    target.updatedAt = new Date().toISOString();
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(inquiries));
      logActivity('Admin User', 'Inquiry Status Updated', `Inquiry ${target.referenceNumber} status changed to ${status}`, 'inquiry');
    }
  }
}

export function addInquiryNote(id: string, author: string, note: string): void {
  const inquiries = getInquiries();
  const target = inquiries.find(i => i.id === id);
  if (target) {
    target.internalNotes.push({
      id: `note-${Date.now()}`,
      author,
      createdAt: new Date().toISOString(),
      note
    });
    target.updatedAt = new Date().toISOString();
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(inquiries));
    }
  }
}

export function addInquiryReply(id: string, sender: string, message: string): void {
  const inquiries = getInquiries();
  const target = inquiries.find(i => i.id === id);
  if (target) {
    target.replyHistory.push({
      id: `reply-${Date.now()}`,
      sender,
      sentAt: new Date().toISOString(),
      message
    });
    target.status = 'Awaiting Customer';
    target.updatedAt = new Date().toISOString();
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(inquiries));
      logActivity(sender, 'Customer Reply Sent', `Replied to inquiry ${target.referenceNumber}`, 'inquiry');
    }
  }
}

// Activity Logging
export function getActivityLogs(): ActivityLog[] {
  if (typeof window === 'undefined') return INITIAL_ACTIVITY_LOGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(INITIAL_ACTIVITY_LOGS));
      return INITIAL_ACTIVITY_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ACTIVITY_LOGS;
  }
}

export function logActivity(user: string, action: string, details: string, category: ActivityLog['category']): void {
  if (typeof window === 'undefined') return;
  const logs = getActivityLogs();
  logs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    user,
    action,
    details,
    category
  });
  localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs.slice(0, 100)));
}

// Site Settings
export function getSiteSettings(): SiteSettings {
  if (typeof window === 'undefined') return DEFAULT_SITE_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    return raw ? { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SITE_SETTINGS;
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export function updateSiteSettings(settings: Partial<SiteSettings>): void {
  if (typeof window === 'undefined') return;
  const current = getSiteSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
  logActivity('Admin User', 'Website Content Updated', 'Site banners or dealership info updated', 'system');
}

// Customer Session State
export function getCurrentCustomer(): CustomerUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOMER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCustomerSession(customer: CustomerUser | null): void {
  if (typeof window === 'undefined') return;
  if (!customer) {
    localStorage.removeItem(STORAGE_KEY_CUSTOMER);
  } else {
    localStorage.setItem(STORAGE_KEY_CUSTOMER, JSON.stringify(customer));
  }
}
