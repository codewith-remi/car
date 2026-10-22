import { Vehicle, VehicleFilterParams } from '../types/vehicle';
import { getFullInventory } from '../data/inventoryEngine';

export interface QueryResult {
  vehicles: Vehicle[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function queryVehicles(params: VehicleFilterParams = {}): QueryResult {
  const allVehicles = getFullInventory();
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, Math.min(100, params.pageSize || 16));

  const query = params.query ? params.query.trim().toLowerCase() : '';
  const make = params.make && params.make !== 'All' ? params.make.toLowerCase() : '';
  const model = params.model && params.model !== 'All' ? params.model.toLowerCase() : '';
  const bodyStyle = params.bodyStyle && params.bodyStyle !== 'All' ? params.bodyStyle : '';
  
  // Strict price boundaries: minimum $2,500, maximum $8,000
  const minPrice = typeof params.minPrice === 'number' ? Math.max(2500, params.minPrice) : 2500;
  const maxPrice = typeof params.maxPrice === 'number' ? Math.min(8000, params.maxPrice) : 8000;
  
  const minYear = typeof params.minYear === 'number' ? params.minYear : 0;
  const maxYear = typeof params.maxYear === 'number' ? params.maxYear : 3000;
  const maxMileage = typeof params.maxMileage === 'number' ? params.maxMileage : Infinity;
  const transmission = params.transmission && params.transmission !== 'All' ? params.transmission : '';
  const fuelType = params.fuelType && params.fuelType !== 'All' ? params.fuelType : '';
  const drivetrain = params.drivetrain && params.drivetrain !== 'All' ? params.drivetrain : '';
  const condition = params.condition && params.condition !== 'All' ? params.condition : '';
  const location = params.location && params.location !== 'All' ? params.location.toLowerCase() : '';
  const status = params.status && params.status !== 'All' ? params.status : '';

  let filtered = allVehicles.filter(v => {
    // Only published listings unless explicitly filtered
    if (!v.published) return false;

    // Strict validation: price must be between $2,500 and $8,000
    if (v.price < 2500 || v.price > 8000) return false;

    if (query) {
      const match =
        v.id.toLowerCase().includes(query) ||
        v.vin.toLowerCase().includes(query) ||
        v.make.toLowerCase().includes(query) ||
        v.model.toLowerCase().includes(query) ||
        v.trim.toLowerCase().includes(query) ||
        v.exteriorColor.toLowerCase().includes(query) ||
        v.location.toLowerCase().includes(query) ||
        `${v.year} ${v.make} ${v.model}`.toLowerCase().includes(query);
      if (!match) return false;
    }

    if (make && v.make.toLowerCase() !== make) return false;
    if (model && v.model.toLowerCase() !== model) return false;
    if (bodyStyle && v.bodyStyle !== bodyStyle) return false;
    if (v.price < minPrice || v.price > maxPrice) return false;
    if (v.year < minYear || v.year > maxYear) return false;
    if (v.mileage > maxMileage) return false;
    if (transmission && v.transmission !== transmission) return false;
    if (fuelType && v.fuelType !== fuelType) return false;
    if (drivetrain && v.drivetrain !== drivetrain) return false;
    if (condition && v.condition !== condition) return false;
    if (location && !v.location.toLowerCase().includes(location)) return false;
    if (status && v.status !== status) return false;

    return true;
  });

  // Sorting
  const sortBy = params.sortBy || 'newest';
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'year-desc':
        return b.year - a.year;
      case 'year-asc':
        return a.year - b.year;
      case 'mileage-asc':
        return a.mileage - b.mileage;
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const paginated = filtered.slice(startIndex, startIndex + pageSize);

  return {
    vehicles: paginated,
    total,
    page,
    pageSize,
    totalPages
  };
}

export function getVehicleById(id: string): Vehicle | null {
  const all = getFullInventory();
  return all.find(v => v.id.toLowerCase() === id.toLowerCase()) || null;
}

export function getSimilarVehicles(vehicle: Vehicle, limit = 4): Vehicle[] {
  const all = getFullInventory();
  return all
    .filter(v => v.id !== vehicle.id && v.status === 'Available' && (v.bodyStyle === vehicle.bodyStyle || v.make === vehicle.make))
    .slice(0, limit);
}

export function getFeaturedVehicles(limit = 8): Vehicle[] {
  const all = getFullInventory();
  return all
    .filter(v => v.featured && v.status === 'Available')
    .slice(0, limit);
}

export function getRecentlyAdded(limit = 8): Vehicle[] {
  const all = getFullInventory();
  return all
    .filter(v => v.status === 'Available')
    .slice(0, limit);
}

export function getBudgetVehicles(maxPrice: number, limit = 8): Vehicle[] {
  const all = getFullInventory();
  return all
    .filter(v => v.price <= maxPrice && v.price >= 2500 && v.status === 'Available')
    .slice(0, limit);
}

export function getInventoryStats() {
  const all = getFullInventory();
  const total = all.length;
  let available = 0;
  let reserved = 0;
  let sold = 0;
  let tier2500to3500 = 0;
  let tier3500to5000 = 0;
  let tier5000to6500 = 0;
  let tier6500to8000 = 0;
  let totalPrice = 0;
  let totalMileage = 0;
  const makeCounts: Record<string, number> = {};
  const bodyCounts: Record<string, number> = {};

  all.forEach(v => {
    if (v.status === 'Available') available++;
    else if (v.status === 'Reserved') reserved++;
    else if (v.status === 'Sold') sold++;

    if (v.price >= 2500 && v.price <= 3500) tier2500to3500++;
    else if (v.price > 3500 && v.price <= 5000) tier3500to5000++;
    else if (v.price > 5000 && v.price <= 6500) tier5000to6500++;
    else if (v.price > 6500 && v.price <= 8000) tier6500to8000++;

    totalPrice += v.price;
    totalMileage += v.mileage;

    makeCounts[v.make] = (makeCounts[v.make] || 0) + 1;
    bodyCounts[v.bodyStyle] = (bodyCounts[v.bodyStyle] || 0) + 1;
  });

  return {
    total,
    available,
    reserved,
    sold,
    tier2500to3500,
    tier3500to5000,
    tier5000to6500,
    tier6500to8000,
    avgPrice: Math.round(totalPrice / total),
    avgMileage: Math.round(totalMileage / total),
    makeCounts,
    bodyCounts
  };
}

export function getFilterFacets() {
  const all = getFullInventory();
  const makes = Array.from(new Set(all.map(v => v.make))).sort();
  const bodyStyles = Array.from(new Set(all.map(v => v.bodyStyle))).sort();
  const transmissions = Array.from(new Set(all.map(v => v.transmission))).sort();
  const fuelTypes = Array.from(new Set(all.map(v => v.fuelType))).sort();
  const locations = Array.from(new Set(all.map(v => v.location))).sort();

  return {
    makes,
    bodyStyles,
    transmissions,
    fuelTypes,
    locations
  };
}
