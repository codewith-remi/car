import { Vehicle, BodyStyle, TransmissionType, FuelType, DrivetrainType, VehicleCondition, VehicleStatus } from '../types/vehicle';

// Real high-fidelity generated images
const HERO_SHOWROOM = '/src/assets/images/hero_car_showroom_1792687189650.jpg';
const COMPACT_SUV = '/src/assets/images/featured_compact_suv_1792687189958.jpg';
const RELIABLE_SEDAN = '/src/assets/images/featured_reliable_sedan_1792687190969.jpg';
const SPORT_HATCHBACK = '/src/assets/images/featured_hatchback_1792687191198.jpg';
const DELIVERY_TRUCK = '/src/assets/images/inspection_delivery_truck_1792687193769.jpg';

// Curated automotive photography catalogue for various body styles
const BODY_STYLE_IMAGES: Record<BodyStyle, string[]> = {
  Sedan: [
    RELIABLE_SEDAN,
    HERO_SHOWROOM,
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80',
  ],
  SUV: [
    COMPACT_SUV,
    DELIVERY_TRUCK,
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',
  ],
  Hatchback: [
    SPORT_HATCHBACK,
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
  ],
  'Pickup Truck': [
    'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80',
    COMPACT_SUV,
  ],
  Coupe: [
    HERO_SHOWROOM,
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
  ],
  Wagon: [
    COMPACT_SUV,
    RELIABLE_SEDAN,
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80',
  ],
  Van: [
    'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=800&q=80',
    COMPACT_SUV,
  ],
  Luxury: [
    HERO_SHOWROOM,
    RELIABLE_SEDAN,
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
  ]
};

interface ModelSpec {
  make: string;
  model: string;
  trims: string[];
  bodyStyle: BodyStyle;
  engines: string[];
  drivetrains: DrivetrainType[];
  transmissions: TransmissionType[];
  fuelTypes: FuelType[];
  doors: number;
  seats: number;
  mpgCity: number;
  mpgHwy: number;
  basePrice: number;
}

const VEHICLE_CATALOG_TEMPLATES: ModelSpec[] = [
  // Toyota
  { make: 'Toyota', model: 'Camry', trims: ['LE', 'SE', 'XLE'], bodyStyle: 'Sedan', engines: ['2.4L 4-Cylinder', '2.5L 4-Cylinder', '3.5L V6'], drivetrains: ['FWD'], transmissions: ['Automatic'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 25, mpgHwy: 35, basePrice: 4800 },
  { make: 'Toyota', model: 'Corolla', trims: ['CE', 'LE', 'S'], bodyStyle: 'Sedan', engines: ['1.8L 4-Cylinder'], drivetrains: ['FWD'], transmissions: ['Automatic', 'Manual'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 28, mpgHwy: 37, basePrice: 4200 },
  { make: 'Toyota', model: 'Yaris', trims: ['Base', 'Core', 'S'], bodyStyle: 'Hatchback', engines: ['1.5L 4-Cylinder'], drivetrains: ['FWD'], transmissions: ['Automatic', 'Manual'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 30, mpgHwy: 36, basePrice: 3400 },
  { make: 'Toyota', model: 'Matrix', trims: ['Base', 'XR', 'XRS'], bodyStyle: 'Wagon', engines: ['1.8L 4-Cylinder', '2.4L 4-Cylinder'], drivetrains: ['FWD', 'AWD'], transmissions: ['Automatic'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 26, mpgHwy: 32, basePrice: 3900 },
  { make: 'Toyota', model: 'Prius', trims: ['Two', 'Three', 'Four'], bodyStyle: 'Hatchback', engines: ['1.8L 4-Cylinder Hybrid'], drivetrains: ['FWD'], transmissions: ['CVT'], fuelTypes: ['Hybrid'], doors: 4, seats: 5, mpgCity: 51, mpgHwy: 48, basePrice: 5200 },
  { make: 'Toyota', model: 'RAV4', trims: ['Base', 'Sport', 'Limited'], bodyStyle: 'SUV', engines: ['2.4L 4-Cylinder', '3.5L V6'], drivetrains: ['FWD', 'AWD'], transmissions: ['Automatic'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 22, mpgHwy: 28, basePrice: 5800 },
  { make: 'Toyota', model: 'Tacoma', trims: ['Regular Cab', 'Access Cab'], bodyStyle: 'Pickup Truck', engines: ['2.7L 4-Cylinder'], drivetrains: ['RWD', '4WD'], transmissions: ['Automatic', 'Manual'], fuelTypes: ['Gasoline'], doors: 2, seats: 3, mpgCity: 20, mpgHwy: 25, basePrice: 6800 },

  // Honda
  { make: 'Honda', model: 'Civic', trims: ['DX', 'LX', 'EX', 'Si'], bodyStyle: 'Sedan', engines: ['1.8L 4-Cylinder', '2.0L 4-Cylinder'], drivetrains: ['FWD'], transmissions: ['Automatic', 'Manual'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 29, mpgHwy: 38, basePrice: 4400 },
  { make: 'Honda', model: 'Accord', trims: ['LX', 'EX', 'EX-L'], bodyStyle: 'Sedan', engines: ['2.4L 4-Cylinder', '3.5L V6'], drivetrains: ['FWD'], transmissions: ['Automatic'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 24, mpgHwy: 34, basePrice: 4900 },
  { make: 'Honda', model: 'Fit', trims: ['Base', 'Sport'], bodyStyle: 'Hatchback', engines: ['1.5L 4-Cylinder'], drivetrains: ['FWD'], transmissions: ['Automatic', 'Manual'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 28, mpgHwy: 35, basePrice: 3800 },
  { make: 'Honda', model: 'CR-V', trims: ['LX', 'EX', 'EX-L'], bodyStyle: 'SUV', engines: ['2.4L 4-Cylinder'], drivetrains: ['FWD', 'AWD'], transmissions: ['Automatic'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 23, mpgHwy: 31, basePrice: 5900 },
  { make: 'Honda', model: 'Element', trims: ['LX', 'EX'], bodyStyle: 'SUV', engines: ['2.4L 4-Cylinder'], drivetrains: ['FWD', 'AWD'], transmissions: ['Automatic'], fuelTypes: ['Gasoline'], doors: 4, seats: 4, mpgCity: 20, mpgHwy: 25, basePrice: 4600 },
  { make: 'Honda', model: 'Odyssey', trims: ['LX', 'EX', 'Touring'], bodyStyle: 'Van', engines: ['3.5L V6'], drivetrains: ['FWD'], transmissions: ['Automatic'], fuelTypes: ['Gasoline'], doors: 4, seats: 8, mpgCity: 18, mpgHwy: 27, basePrice: 4100 },

  // Ford
  { make: 'Ford', model: 'Focus', trims: ['S', 'SE', 'Titanium'], bodyStyle: 'Sedan', engines: ['2.0L 4-Cylinder'], drivetrains: ['FWD'], transmissions: ['Automatic', 'Manual'], fuelTypes: ['Gasoline', 'Flex Fuel'], doors: 4, seats: 5, mpgCity: 26, mpgHwy: 36, basePrice: 3200 },
  { make: 'Ford', model: 'Fusion', trims: ['S', 'SE', 'Titanium'], bodyStyle: 'Sedan', engines: ['2.5L 4-Cylinder', '1.5L EcoBoost', '2.0L Hybrid'], drivetrains: ['FWD', 'AWD'], transmissions: ['Automatic'], fuelTypes: ['Gasoline', 'Hybrid'], doors: 4, seats: 5, mpgCity: 24, mpgHwy: 34, basePrice: 4300 },
  { make: 'Ford', model: 'Escape', trims: ['XLS', 'XLT', 'Limited'], bodyStyle: 'SUV', engines: ['2.5L 4-Cylinder', '3.0L V6'], drivetrains: ['FWD', 'AWD'], transmissions: ['Automatic'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 21, mpgHwy: 28, basePrice: 4600 },
  { make: 'Ford', model: 'Ranger', trims: ['XL', 'XLT', 'Sport'], bodyStyle: 'Pickup Truck', engines: ['2.3L 4-Cylinder', '4.0L V6'], drivetrains: ['RWD', '4WD'], transmissions: ['Automatic', 'Manual'], fuelTypes: ['Gasoline'], doors: 2, seats: 3, mpgCity: 19, mpgHwy: 24, basePrice: 5400 },
  { make: 'Ford', model: 'Fiesta', trims: ['S', 'SE', 'Titanium'], bodyStyle: 'Hatchback', engines: ['1.6L 4-Cylinder'], drivetrains: ['FWD'], transmissions: ['Automatic', 'Manual'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 29, mpgHwy: 39, basePrice: 2800 },
  { make: 'Ford', model: 'Edge', trims: ['SE', 'SEL'], bodyStyle: 'SUV', engines: ['3.5L V6'], drivetrains: ['FWD', 'AWD'], transmissions: ['Automatic'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 19, mpgHwy: 26, basePrice: 5100 },

  // Chevrolet
  { make: 'Chevrolet', model: 'Cruze', trims: ['LS', 'LT', 'LTZ'], bodyStyle: 'Sedan', engines: ['1.8L 4-Cylinder', '1.4L Turbo'], drivetrains: ['FWD'], transmissions: ['Automatic', 'Manual'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 26, mpgHwy: 38, basePrice: 3500 },
  { make: 'Chevrolet', model: 'Malibu', trims: ['LS', 'LT', 'LTZ'], bodyStyle: 'Sedan', engines: ['2.4L 4-Cylinder', '2.5L 4-Cylinder'], drivetrains: ['FWD'], transmissions: ['Automatic'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 25, mpgHwy: 36, basePrice: 4100 },
  { make: 'Chevrolet', model: 'Impala', trims: ['LS', 'LT', 'LTZ'], bodyStyle: 'Sedan', engines: ['3.5L V6', '3.6L V6'], drivetrains: ['FWD'], transmissions: ['Automatic'], fuelTypes: ['Gasoline', 'Flex Fuel'], doors: 4, seats: 6, mpgCity: 19, mpgHwy: 29, basePrice: 3700 },
  { make: 'Chevrolet', model: 'Equinox', trims: ['LS', 'LT'], bodyStyle: 'SUV', engines: ['2.4L 4-Cylinder'], drivetrains: ['FWD', 'AWD'], transmissions: ['Automatic'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 22, mpgHwy: 32, basePrice: 4900 },
  { make: 'Chevrolet', model: 'Spark', trims: ['LS', '1LT'], bodyStyle: 'Hatchback', engines: ['1.2L 4-Cylinder'], drivetrains: ['FWD'], transmissions: ['Automatic', 'Manual'], fuelTypes: ['Gasoline'], doors: 4, seats: 4, mpgCity: 31, mpgHwy: 39, basePrice: 2600 },
  { make: 'Chevrolet', model: 'Colorado', trims: ['WT', 'LT'], bodyStyle: 'Pickup Truck', engines: ['2.9L 4-Cylinder', '3.7L 5-Cylinder'], drivetrains: ['RWD', '4WD'], transmissions: ['Automatic'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 18, mpgHwy: 24, basePrice: 6200 },

  // Nissan
  { make: 'Nissan', model: 'Altima', trims: ['2.5', '2.5 S', '2.5 SV', '3.5 SR'], bodyStyle: 'Sedan', engines: ['2.5L 4-Cylinder', '3.5L V6'], drivetrains: ['FWD'], transmissions: ['CVT'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 27, mpgHwy: 38, basePrice: 3800 },
  { make: 'Nissan', model: 'Sentra', trims: ['S', 'SV', 'SR'], bodyStyle: 'Sedan', engines: ['1.8L 4-Cylinder', '2.0L 4-Cylinder'], drivetrains: ['FWD'], transmissions: ['CVT', 'Manual'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 30, mpgHwy: 39, basePrice: 3300 },
  { make: 'Nissan', model: 'Versa', trims: ['1.6 S', '1.6 SV', 'Note'], bodyStyle: 'Hatchback', engines: ['1.6L 4-Cylinder'], drivetrains: ['FWD'], transmissions: ['CVT', 'Manual'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 31, mpgHwy: 40, basePrice: 2400 },
  { make: 'Nissan', model: 'Rogue', trims: ['S', 'SV', 'SL'], bodyStyle: 'SUV', engines: ['2.5L 4-Cylinder'], drivetrains: ['FWD', 'AWD'], transmissions: ['CVT'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 26, mpgHwy: 33, basePrice: 4900 },
  { make: 'Nissan', model: 'Frontier', trims: ['King Cab XE', 'Crew Cab SE'], bodyStyle: 'Pickup Truck', engines: ['2.5L 4-Cylinder', '4.0L V6'], drivetrains: ['RWD', '4WD'], transmissions: ['Automatic'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 17, mpgHwy: 22, basePrice: 6400 },

  // Hyundai
  { make: 'Hyundai', model: 'Elantra', trims: ['GLS', 'Limited', 'SE'], bodyStyle: 'Sedan', engines: ['1.8L 4-Cylinder', '2.0L 4-Cylinder'], drivetrains: ['FWD'], transmissions: ['Automatic', 'Manual'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 28, mpgHwy: 38, basePrice: 3600 },
  { make: 'Hyundai', model: 'Sonata', trims: ['GLS', 'SE', 'Limited'], bodyStyle: 'Sedan', engines: ['2.4L 4-Cylinder', '2.0L Turbo'], drivetrains: ['FWD'], transmissions: ['Automatic'], fuelTypes: ['Gasoline', 'Hybrid'], doors: 4, seats: 5, mpgCity: 24, mpgHwy: 35, basePrice: 4200 },
  { make: 'Hyundai', model: 'Accent', trims: ['GLS', 'GS', 'SE'], bodyStyle: 'Hatchback', engines: ['1.6L 4-Cylinder'], drivetrains: ['FWD'], transmissions: ['Automatic', 'Manual'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 27, mpgHwy: 37, basePrice: 2700 },
  { make: 'Hyundai', model: 'Santa Fe', trims: ['GLS', 'Limited'], bodyStyle: 'SUV', engines: ['2.4L 4-Cylinder', '3.3L V6'], drivetrains: ['FWD', 'AWD'], transmissions: ['Automatic'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 20, mpgHwy: 27, basePrice: 5100 },
  { make: 'Hyundai', model: 'Tucson', trims: ['GL', 'GLS', 'Limited'], bodyStyle: 'SUV', engines: ['2.0L 4-Cylinder', '2.4L 4-Cylinder'], drivetrains: ['FWD', 'AWD'], transmissions: ['Automatic'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 22, mpgHwy: 31, basePrice: 4700 },

  // Kia
  { make: 'Kia', model: 'Soul', trims: ['Base', '+ (Plus)', '! (Exclaim)'], bodyStyle: 'Hatchback', engines: ['1.6L 4-Cylinder', '2.0L 4-Cylinder'], drivetrains: ['FWD'], transmissions: ['Automatic', 'Manual'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 24, mpgHwy: 30, basePrice: 3900 },
  { make: 'Kia', model: 'Forte', trims: ['LX', 'EX', 'SX'], bodyStyle: 'Sedan', engines: ['1.8L 4-Cylinder', '2.0L 4-Cylinder'], drivetrains: ['FWD'], transmissions: ['Automatic'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 26, mpgHwy: 37, basePrice: 3400 },
  { make: 'Kia', model: 'Optima', trims: ['LX', 'EX', 'SX'], bodyStyle: 'Sedan', engines: ['2.4L 4-Cylinder', '2.0L Turbo'], drivetrains: ['FWD'], transmissions: ['Automatic'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 24, mpgHwy: 35, basePrice: 4300 },
  { make: 'Kia', model: 'Sportage', trims: ['LX', 'EX'], bodyStyle: 'SUV', engines: ['2.4L 4-Cylinder'], drivetrains: ['FWD', 'AWD'], transmissions: ['Automatic'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 21, mpgHwy: 28, basePrice: 4900 },
  { make: 'Kia', model: 'Rio', trims: ['LX', 'EX'], bodyStyle: 'Sedan', engines: ['1.6L 4-Cylinder'], drivetrains: ['FWD'], transmissions: ['Automatic', 'Manual'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 28, mpgHwy: 37, basePrice: 2900 },

  // Volkswagen
  { make: 'Volkswagen', model: 'Jetta', trims: ['S', 'SE', 'SEL', 'TDI'], bodyStyle: 'Sedan', engines: ['2.0L 4-Cylinder', '2.5L 5-Cylinder', '2.0L Turbo Diesel'], drivetrains: ['FWD'], transmissions: ['Automatic', 'Manual'], fuelTypes: ['Gasoline', 'Diesel'], doors: 4, seats: 5, mpgCity: 24, mpgHwy: 34, basePrice: 3900 },
  { make: 'Volkswagen', model: 'Golf', trims: ['2.5L', 'TDI', 'GTI'], bodyStyle: 'Hatchback', engines: ['2.5L 5-Cylinder', '2.0L Turbo'], drivetrains: ['FWD'], transmissions: ['Automatic', 'Manual'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 24, mpgHwy: 33, basePrice: 4400 },
  { make: 'Volkswagen', model: 'Passat', trims: ['S', 'SE', 'SEL'], bodyStyle: 'Sedan', engines: ['2.5L 5-Cylinder', '1.8L Turbo'], drivetrains: ['FWD'], transmissions: ['Automatic'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 22, mpgHwy: 32, basePrice: 4700 },

  // Mazda
  { make: 'Mazda', model: 'Mazda3', trims: ['i Sport', 'i Touring', 's Grand Touring'], bodyStyle: 'Sedan', engines: ['2.0L 4-Cylinder', '2.5L 4-Cylinder'], drivetrains: ['FWD'], transmissions: ['Automatic', 'Manual'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 28, mpgHwy: 39, basePrice: 4100 },
  { make: 'Mazda', model: 'Mazda6', trims: ['Sport', 'Touring', 'Grand Touring'], bodyStyle: 'Sedan', engines: ['2.5L 4-Cylinder'], drivetrains: ['FWD'], transmissions: ['Automatic'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 26, mpgHwy: 38, basePrice: 4600 },
  { make: 'Mazda', model: 'CX-7', trims: ['i SV', 'i Sport', 's Touring'], bodyStyle: 'SUV', engines: ['2.5L 4-Cylinder', '2.3L Turbo'], drivetrains: ['FWD', 'AWD'], transmissions: ['Automatic'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 20, mpgHwy: 28, basePrice: 4300 },

  // Subaru
  { make: 'Subaru', model: 'Outback', trims: ['2.5i', '2.5i Premium', '2.5i Limited'], bodyStyle: 'Wagon', engines: ['2.5L Boxer 4-Cylinder'], drivetrains: ['AWD'], transmissions: ['CVT', 'Manual'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 24, mpgHwy: 30, basePrice: 5300 },
  { make: 'Subaru', model: 'Forester', trims: ['2.5X', '2.5X Premium', '2.5XT'], bodyStyle: 'SUV', engines: ['2.5L Boxer 4-Cylinder'], drivetrains: ['AWD'], transmissions: ['Automatic', 'Manual'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 22, mpgHwy: 27, basePrice: 5100 },
  { make: 'Subaru', model: 'Impreza', trims: ['2.0i', '2.0i Premium'], bodyStyle: 'Sedan', engines: ['2.0L Boxer 4-Cylinder'], drivetrains: ['AWD'], transmissions: ['CVT', 'Manual'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 27, mpgHwy: 36, basePrice: 4600 },

  // Buick & Domestic Value
  { make: 'Buick', model: 'LaCrosse', trims: ['CX', 'CXL', 'CXS'], bodyStyle: 'Sedan', engines: ['3.0L V6', '3.6L V6'], drivetrains: ['FWD', 'AWD'], transmissions: ['Automatic'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 18, mpgHwy: 27, basePrice: 4300 },
  { make: 'Buick', model: 'Lucerne', trims: ['CX', 'CXL'], bodyStyle: 'Sedan', engines: ['3.9L V6', '4.6L V8'], drivetrains: ['FWD'], transmissions: ['Automatic'], fuelTypes: ['Gasoline'], doors: 4, seats: 6, mpgCity: 17, mpgHwy: 26, basePrice: 3800 },
  { make: 'Buick', model: 'Regal', trims: ['Base', 'Premium I'], bodyStyle: 'Sedan', engines: ['2.4L 4-Cylinder', '2.0L Turbo'], drivetrains: ['FWD'], transmissions: ['Automatic'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 20, mpgHwy: 31, basePrice: 4900 },

  // Luxury Pre-Owned (<$8,000)
  { make: 'BMW', model: '3 Series (328i)', trims: ['Base', 'Sport'], bodyStyle: 'Sedan', engines: ['3.0L Inline-6'], drivetrains: ['RWD', 'AWD'], transmissions: ['Automatic', 'Manual'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 18, mpgHwy: 28, basePrice: 5700 },
  { make: 'Mercedes-Benz', model: 'C-Class (C300)', trims: ['Sport', 'Luxury'], bodyStyle: 'Sedan', engines: ['3.0L V6'], drivetrains: ['RWD', 'AWD'], transmissions: ['Automatic'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 18, mpgHwy: 26, basePrice: 5900 },
  { make: 'Audi', model: 'A4', trims: ['2.0T Premium', '2.0T Premium Plus'], bodyStyle: 'Sedan', engines: ['2.0L Turbocharged 4-Cylinder'], drivetrains: ['FWD', 'AWD'], transmissions: ['Automatic'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 22, mpgHwy: 30, basePrice: 5600 },
  { make: 'Volvo', model: 'S60', trims: ['2.5T', 'T5'], bodyStyle: 'Sedan', engines: ['2.5L Turbo 5-Cylinder'], drivetrains: ['FWD', 'AWD'], transmissions: ['Automatic'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 20, mpgHwy: 30, basePrice: 4700 },

  // Budget entry (<$3,000)
  { make: 'Dodge', model: 'Grand Caravan', trims: ['SE', 'SXT'], bodyStyle: 'Van', engines: ['3.3L V6', '3.6L Pentastar V6'], drivetrains: ['FWD'], transmissions: ['Automatic'], fuelTypes: ['Gasoline', 'Flex Fuel'], doors: 4, seats: 7, mpgCity: 17, mpgHwy: 25, basePrice: 2800 },
  { make: 'Pontiac', model: 'Vibe', trims: ['Base', 'GT'], bodyStyle: 'Hatchback', engines: ['1.8L 4-Cylinder', '2.4L 4-Cylinder'], drivetrains: ['FWD', 'AWD'], transmissions: ['Automatic', 'Manual'], fuelTypes: ['Gasoline'], doors: 4, seats: 5, mpgCity: 26, mpgHwy: 33, basePrice: 2900 }
];

const EXTERIOR_COLORS = [
  'Midnight Navy Pearl',
  'Alpine White',
  'Magnetic Metallic Gray',
  'Onyx Black',
  'Silver Mist Metallic',
  'Crimson Red Tintcoat',
  'Deep Sea Blue',
  'Graphite Slate',
  'Champagne Gold',
  'Pacific Blue',
  'Canyon Bronze',
  'Desert Sand'
];

const INTERIOR_COLORS = [
  'Ebony Black Cloth',
  'Charcoal Gray Leatherette',
  'Slate Gray Cloth',
  'Cashmere Tan Cloth',
  'Espresso Brown Leather',
  'Stone Gray Cloth',
  'Saddle Brown Leather'
];

const LOCATIONS = [
  'Dallas, TX',
  'Atlanta, GA',
  'Phoenix, AZ',
  'Chicago, IL',
  'Charlotte, NC',
  'Denver, CO',
  'Orlando, FL',
  'Philadelphia, PA',
  'Columbus, OH',
  'Houston, TX',
  'Tampa, FL',
  'Indianapolis, IN',
  'Nashville, TN',
  'San Antonio, TX',
  'Kansas City, MO'
];

const STANDARD_FEATURES = [
  'Air Conditioning',
  'Power Windows & Locks',
  'Remote Keyless Entry',
  'Tire Pressure Monitoring (TPMS)',
  'Anti-Lock Braking System (ABS)',
  'Electronic Stability Control',
  'Multiple Airbags (Front & Curtain)'
];

const PREMIUM_FEATURE_POOL = [
  'Bluetooth Hands-Free Audio',
  'Rearview Backup Camera',
  'Cruise Control with Steering Controls',
  'Power Tilt/Sliding Sunroof',
  'Heated Front Seats',
  'Alloy Wheels',
  'Premium 6-Speaker Audio',
  'Leather-Wrapped Steering Wheel',
  'Dual-Zone Automatic Climate Control',
  'Fog Lamps',
  'Split-Folding 60/40 Rear Seats',
  'All-Weather Floor Mats'
];

// Pseudo-random deterministic generator for consistent 5,000+ vehicle catalog
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const VIN_CHARACTERS = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';

export function generateCatalog(): Vehicle[] {
  const TOTAL_RECORDS = 5020; // Guarantee at least 5,000 records
  const vehicles: Vehicle[] = [];

  const templateCount = VEHICLE_CATALOG_TEMPLATES.length;

  for (let i = 0; i < TOTAL_RECORDS; i++) {
    const seed = i + 1;
    const tIndex = (i % templateCount);
    const template = VEHICLE_CATALOG_TEMPLATES[tIndex];

    const idNumber = 10001 + i;
    const id = `APX-${idNumber}`;

    // Year range from 2004 to 2017
    const yearOffset = Math.floor(pseudoRandom(seed * 7) * 14);
    const year = 2004 + yearOffset;

    // Mileage between 48,000 and 178,000 miles
    const mileageBase = 52000 + (2018 - year) * 6500;
    const mileageJitter = Math.floor(pseudoRandom(seed * 11) * 32000) - 15000;
    const mileage = Math.max(38000, Math.min(185000, mileageBase + mileageJitter));

    // Price must STRICTLY be < $8,000.
    // Base formula depending on template, year, and mileage:
    let calculatedPrice = template.basePrice + (year - 2008) * 260 - Math.floor(mileage / 10000) * 120;
    const priceJitter = Math.floor(pseudoRandom(seed * 13) * 600) - 300;
    calculatedPrice = calculatedPrice + priceJitter;

    // Strict ceiling and floor enforcement: $1,450 to $7,950
    let price = Math.round(Math.max(1450, Math.min(7950, calculatedPrice)) / 50) * 50 - 5;
    if (price >= 8000) {
      price = 7950;
    }
    if (price < 1200) {
      price = 1495;
    }

    // Trim
    const trim = template.trims[Math.floor(pseudoRandom(seed * 17) * template.trims.length)];
    const engine = template.engines[Math.floor(pseudoRandom(seed * 19) * template.engines.length)];
    const drivetrain = template.drivetrains[Math.floor(pseudoRandom(seed * 23) * template.drivetrains.length)];
    const transmission = template.transmissions[Math.floor(pseudoRandom(seed * 29) * template.transmissions.length)];
    const fuelType = template.fuelTypes[Math.floor(pseudoRandom(seed * 31) * template.fuelTypes.length)];

    const exteriorColor = EXTERIOR_COLORS[Math.floor(pseudoRandom(seed * 37) * EXTERIOR_COLORS.length)];
    const interiorColor = INTERIOR_COLORS[Math.floor(pseudoRandom(seed * 41) * INTERIOR_COLORS.length)];
    const location = LOCATIONS[Math.floor(pseudoRandom(seed * 43) * LOCATIONS.length)];

    let condition: VehicleCondition = 'Good';
    const conditionRoll = pseudoRandom(seed * 47);
    if (conditionRoll > 0.65) condition = 'Excellent';
    else if (conditionRoll > 0.3) condition = 'Very Good';

    // Status: 92% Available, 5% Reserved, 3% Sold
    let status: VehicleStatus = 'Available';
    const statusRoll = pseudoRandom(seed * 53);
    if (statusRoll > 0.96) status = 'Sold';
    else if (statusRoll > 0.91) status = 'Reserved';

    // Featured listings (first 24 cars and every 50th)
    const featured = i < 18 || i % 75 === 0;

    // Generate unique VIN (clearly identifiable & valid format)
    let vinCode = '';
    for (let c = 0; c < 8; c++) {
      vinCode += VIN_CHARACTERS[Math.floor(pseudoRandom(seed * (c + 60)) * VIN_CHARACTERS.length)];
    }
    const vin = `1HG${template.make.substring(0, 2).toUpperCase()}${vinCode}${idNumber}`;

    // Features selection
    const selectedFeatures = [...STANDARD_FEATURES];
    const extraFeatureCount = 3 + Math.floor(pseudoRandom(seed * 71) * 6);
    for (let f = 0; f < extraFeatureCount; f++) {
      const feat = PREMIUM_FEATURE_POOL[(f + Math.floor(pseudoRandom(seed * (f + 73)) * PREMIUM_FEATURE_POOL.length)) % PREMIUM_FEATURE_POOL.length];
      if (!selectedFeatures.includes(feat)) {
        selectedFeatures.push(feat);
      }
    }

    // Images
    const styleImages = BODY_STYLE_IMAGES[template.bodyStyle] || BODY_STYLE_IMAGES.Sedan;
    const mainImgIndex = Math.floor(pseudoRandom(seed * 83) * styleImages.length);
    const mainImage = styleImages[mainImgIndex];

    // Multi-angle gallery
    const gallery = [
      mainImage,
      styleImages[(mainImgIndex + 1) % styleImages.length],
      styleImages[(mainImgIndex + 2) % styleImages.length],
      HERO_SHOWROOM
    ];

    const description = `Autoplex Verified ${year} ${template.make} ${template.model} ${trim}. Fully inspected by our certified automotive technicians. Features smooth ${engine} paired with ${transmission} transmission. Finished in stunning ${exteriorColor} over clean ${interiorColor}. Priced strictly within our under-$8,000 guarantee. Clean title with complete vehicle readiness certification.`;

    const createdAt = new Date(Date.now() - (i * 2.5 * 3600000)).toISOString();

    vehicles.push({
      id,
      vin,
      make: template.make,
      model: template.model,
      trim,
      year,
      price,
      mileage,
      bodyStyle: template.bodyStyle,
      transmission,
      fuelType,
      drivetrain,
      engine,
      doors: template.doors,
      seats: template.seats,
      exteriorColor,
      interiorColor,
      condition,
      location,
      featured,
      status,
      published: true,
      description,
      features: selectedFeatures,
      mainImage,
      gallery,
      createdAt,
      mpgCity: template.mpgCity,
      mpgHwy: template.mpgHwy,
      sellerNotes: 'Comprehensive 120-point mechanical check completed. New oil & filter, brake pads at 85% life, clean Carfax verification available.'
    });
  }

  return vehicles;
}

// Global cached catalog
let cachedCatalog: Vehicle[] | null = null;

const STORAGE_KEY_CUSTOM_VEHICLES = 'autoplex_custom_vehicles';
const STORAGE_KEY_MODIFIED_VEHICLES = 'autoplex_modified_vehicles';
const STORAGE_KEY_DELETED_VEHICLE_IDS = 'autoplex_deleted_vehicle_ids';

export function getFullInventory(): Vehicle[] {
  if (!cachedCatalog) {
    cachedCatalog = generateCatalog();
  }

  // Merge localStorage overrides if in browser
  if (typeof window !== 'undefined') {
    try {
      const customRaw = localStorage.getItem(STORAGE_KEY_CUSTOM_VEHICLES);
      const modifiedRaw = localStorage.getItem(STORAGE_KEY_MODIFIED_VEHICLES);
      const deletedRaw = localStorage.getItem(STORAGE_KEY_DELETED_VEHICLE_IDS);

      const customVehicles: Vehicle[] = customRaw ? JSON.parse(customRaw) : [];
      const modifiedVehicles: Record<string, Partial<Vehicle>> = modifiedRaw ? JSON.parse(modifiedRaw) : {};
      const deletedIds: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];

      let merged = [...customVehicles, ...cachedCatalog];

      if (deletedIds.length > 0) {
        const deletedSet = new Set(deletedIds);
        merged = merged.filter(v => !deletedSet.has(v.id));
      }

      if (Object.keys(modifiedVehicles).length > 0) {
        merged = merged.map(v => {
          if (modifiedVehicles[v.id]) {
            return { ...v, ...modifiedVehicles[v.id] };
          }
          return v;
        });
      }

      return merged;
    } catch (e) {
      console.warn('Could not read inventory overrides from localStorage', e);
    }
  }

  return cachedCatalog;
}

export function saveCustomVehicle(vehicle: Vehicle): void {
  if (typeof window === 'undefined') return;
  try {
    const customRaw = localStorage.getItem(STORAGE_KEY_CUSTOM_VEHICLES);
    const customVehicles: Vehicle[] = customRaw ? JSON.parse(customRaw) : [];
    customVehicles.unshift(vehicle);
    localStorage.setItem(STORAGE_KEY_CUSTOM_VEHICLES, JSON.stringify(customVehicles));
  } catch (e) {
    console.error('Failed to save vehicle', e);
  }
}

export function updateVehicle(id: string, updates: Partial<Vehicle>): void {
  if (typeof window === 'undefined') return;
  try {
    const customRaw = localStorage.getItem(STORAGE_KEY_CUSTOM_VEHICLES);
    let customVehicles: Vehicle[] = customRaw ? JSON.parse(customRaw) : [];
    const customIndex = customVehicles.findIndex(v => v.id === id);

    if (customIndex !== -1) {
      customVehicles[customIndex] = { ...customVehicles[customIndex], ...updates };
      localStorage.setItem(STORAGE_KEY_CUSTOM_VEHICLES, JSON.stringify(customVehicles));
    } else {
      const modifiedRaw = localStorage.getItem(STORAGE_KEY_MODIFIED_VEHICLES);
      const modified: Record<string, Partial<Vehicle>> = modifiedRaw ? JSON.parse(modifiedRaw) : {};
      modified[id] = { ...(modified[id] || {}), ...updates };
      localStorage.setItem(STORAGE_KEY_MODIFIED_VEHICLES, JSON.stringify(modified));
    }
  } catch (e) {
    console.error('Failed to update vehicle', e);
  }
}

export function deleteVehicle(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const customRaw = localStorage.getItem(STORAGE_KEY_CUSTOM_VEHICLES);
    let customVehicles: Vehicle[] = customRaw ? JSON.parse(customRaw) : [];
    customVehicles = customVehicles.filter(v => v.id !== id);
    localStorage.setItem(STORAGE_KEY_CUSTOM_VEHICLES, JSON.stringify(customVehicles));

    const deletedRaw = localStorage.getItem(STORAGE_KEY_DELETED_VEHICLE_IDS);
    const deletedIds: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      localStorage.setItem(STORAGE_KEY_DELETED_VEHICLE_IDS, JSON.stringify(deletedIds));
    }
  } catch (e) {
    console.error('Failed to delete vehicle', e);
  }
}
