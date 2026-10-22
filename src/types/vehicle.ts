export type BodyStyle = 
  | 'Sedan'
  | 'SUV'
  | 'Hatchback'
  | 'Pickup Truck'
  | 'Coupe'
  | 'Wagon'
  | 'Van'
  | 'Luxury';

export type TransmissionType = 'Automatic' | 'Manual' | 'CVT';
export type FuelType = 'Gasoline' | 'Hybrid' | 'Flex Fuel' | 'Diesel';
export type DrivetrainType = 'FWD' | 'AWD' | 'RWD' | '4WD';
export type VehicleCondition = 'Good' | 'Very Good' | 'Excellent';
export type VehicleStatus = 'Available' | 'Reserved' | 'Sold';

export interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  trim: string;
  year: number;
  price: number; // Strictly < 8000
  mileage: number;
  bodyStyle: BodyStyle;
  transmission: TransmissionType;
  fuelType: FuelType;
  drivetrain: DrivetrainType;
  engine: string;
  doors: number;
  seats: number;
  exteriorColor: string;
  interiorColor: string;
  condition: VehicleCondition;
  location: string;
  featured: boolean;
  status: VehicleStatus;
  published: boolean;
  description: string;
  features: string[];
  mainImage: string;
  gallery: string[];
  createdAt: string;
  mpgCity: number;
  mpgHwy: number;
  sellerNotes?: string;
}

export interface VehicleFilterParams {
  query?: string;
  make?: string;
  model?: string;
  bodyStyle?: BodyStyle | 'All';
  minPrice?: number;
  maxPrice?: number; // Cap at 8000
  minYear?: number;
  maxYear?: number;
  maxMileage?: number;
  transmission?: TransmissionType | 'All';
  fuelType?: FuelType | 'All';
  drivetrain?: DrivetrainType | 'All';
  condition?: VehicleCondition | 'All';
  location?: string;
  status?: VehicleStatus | 'All';
  sortBy?: 'price-asc' | 'price-desc' | 'year-desc' | 'year-asc' | 'mileage-asc' | 'newest';
  page?: number;
  pageSize?: number;
}

export interface InquiryItem {
  vehicleId: string;
  vehicleTitle: string;
  price: number;
  mainImage: string;
  vin: string;
  location: string;
}

export type InquiryStatus = 
  | 'New'
  | 'Contacted'
  | 'Awaiting Customer'
  | 'Negotiation'
  | 'Reserved'
  | 'Completed'
  | 'Cancelled';

export interface PurchaseInquiry {
  id: string;
  referenceNumber: string;
  createdAt: string;
  updatedAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  preferredContact: 'Email' | 'Phone' | 'SMS' | 'WhatsApp';
  deliveryRequired: boolean;
  deliveryCity?: string;
  deliveryPostalCode?: string;
  deliveryRegion?: string;
  deliveryQuoteEstimate?: number;
  customerMessage: string;
  status: InquiryStatus;
  items: InquiryItem[];
  totalValue: number;
  internalNotes: {
    id: string;
    author: string;
    createdAt: string;
    note: string;
  }[];
  replyHistory: {
    id: string;
    sender: string;
    sentAt: string;
    message: string;
  }[];
}

export interface CustomerUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  city: string;
  createdAt: string;
  notificationPreferences: {
    emailAlerts: boolean;
    smsAlerts: boolean;
    priceDropAlerts: boolean;
  };
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Administrator' | 'Inventory Manager' | 'Sales Agent';
  avatar?: string;
}

export interface SiteSettings {
  announcementText: string;
  announcementEnabled: boolean;
  supportPhone: string;
  supportEmail: string;
  dealershipAddress: string;
  heroHeadline: string;
  heroSubheadline: string;
  aboutText: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  category: 'inventory' | 'inquiry' | 'system' | 'security';
}
