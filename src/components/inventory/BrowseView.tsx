import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Grid, 
  List, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Filter,
  Check
} from 'lucide-react';
import { Vehicle, VehicleFilterParams, BodyStyle, TransmissionType, FuelType, DrivetrainType, VehicleCondition } from '../../types/vehicle';
import { queryVehicles, getFilterFacets } from '../../services/inventoryService';
import { VehicleCard } from '../common/VehicleCard';

interface BrowseViewProps {
  initialParams?: VehicleFilterParams;
  favorites: string[];
  comparisonIds: string[];
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onViewDetails: (id: string) => void;
  onQuickInquire?: (vehicle: Vehicle) => void;
}

export const BrowseView: React.FC<BrowseViewProps> = ({
  initialParams,
  favorites,
  comparisonIds,
  onToggleFavorite,
  onToggleCompare,
  onViewDetails,
  onQuickInquire
}) => {
  // Filter States
  const [query, setQuery] = useState(initialParams?.query || '');
  const [make, setMake] = useState<string>(initialParams?.make || 'All');
  const [bodyStyle, setBodyStyle] = useState<string>(initialParams?.bodyStyle || 'All');
  const [minPrice, setMinPrice] = useState<number>(initialParams?.minPrice || 0);
  const [maxPrice, setMaxPrice] = useState<number>(initialParams?.maxPrice || 8000);
  const [minYear, setMinYear] = useState<number>(initialParams?.minYear || 2004);
  const [maxYear, setMaxYear] = useState<number>(initialParams?.maxYear || 2018);
  const [maxMileage, setMaxMileage] = useState<number>(initialParams?.maxMileage || 200000);
  const [transmission, setTransmission] = useState<string>(initialParams?.transmission || 'All');
  const [fuelType, setFuelType] = useState<string>(initialParams?.fuelType || 'All');
  const [drivetrain, setDrivetrain] = useState<string>(initialParams?.drivetrain || 'All');
  const [condition, setCondition] = useState<string>(initialParams?.condition || 'All');
  const [location, setLocation] = useState<string>(initialParams?.location || 'All');
  
  // UI States
  const [sortBy, setSortBy] = useState<VehicleFilterParams['sortBy']>('newest');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(24);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Facet options
  const facets = useMemo(() => getFilterFacets(), []);

  // Sync when initialParams changes
  useEffect(() => {
    if (initialParams) {
      if (initialParams.make) setMake(initialParams.make);
      if (initialParams.bodyStyle) setBodyStyle(initialParams.bodyStyle);
      if (typeof initialParams.maxPrice === 'number') setMaxPrice(initialParams.maxPrice);
      if (typeof initialParams.minPrice === 'number') setMinPrice(initialParams.minPrice);
      if (initialParams.query) setQuery(initialParams.query);
      setPage(1);
    }
  }, [initialParams]);

  // Execute query
  const queryResult = useMemo(() => {
    return queryVehicles({
      query,
      make: make === 'All' ? undefined : make,
      bodyStyle: bodyStyle === 'All' ? undefined : (bodyStyle as BodyStyle),
      minPrice,
      maxPrice: Math.min(8000, maxPrice),
      minYear,
      maxYear,
      maxMileage: maxMileage === 200000 ? undefined : maxMileage,
      transmission: transmission === 'All' ? undefined : (transmission as TransmissionType),
      fuelType: fuelType === 'All' ? undefined : (fuelType as FuelType),
      drivetrain: drivetrain === 'All' ? undefined : (drivetrain as DrivetrainType),
      condition: condition === 'All' ? undefined : (condition as VehicleCondition),
      location: location === 'All' ? undefined : location,
      sortBy,
      page,
      pageSize
    });
  }, [
    query,
    make,
    bodyStyle,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    maxMileage,
    transmission,
    fuelType,
    drivetrain,
    condition,
    location,
    sortBy,
    page,
    pageSize
  ]);

  const handleResetFilters = () => {
    setQuery('');
    setMake('All');
    setBodyStyle('All');
    setMinPrice(0);
    setMaxPrice(8000);
    setMinYear(2004);
    setMaxYear(2018);
    setMaxMileage(200000);
    setTransmission('All');
    setFuelType('All');
    setDrivetrain('All');
    setCondition('All');
    setLocation('All');
    setPage(1);
  };

  // Determine active filter chips
  const activeChips: { label: string; clear: () => void }[] = [];
  if (query) activeChips.push({ label: `"${query}"`, clear: () => setQuery('') });
  if (make !== 'All') activeChips.push({ label: `Make: ${make}`, clear: () => setMake('All') });
  if (bodyStyle !== 'All') activeChips.push({ label: `Style: ${bodyStyle}`, clear: () => setBodyStyle('All') });
  if (maxPrice < 8000) activeChips.push({ label: `Max $${maxPrice.toLocaleString()}`, clear: () => setMaxPrice(8000) });
  if (minPrice > 0) activeChips.push({ label: `Min $${minPrice.toLocaleString()}`, clear: () => setMinPrice(0) });
  if (minYear > 2004) activeChips.push({ label: `Year ≥ ${minYear}`, clear: () => setMinYear(2004) });
  if (maxMileage < 200000) activeChips.push({ label: `Mileage ≤ ${maxMileage.toLocaleString()} mi`, clear: () => setMaxMileage(200000) });
  if (transmission !== 'All') activeChips.push({ label: `Trans: ${transmission}`, clear: () => setTransmission('All') });
  if (fuelType !== 'All') activeChips.push({ label: `Fuel: ${fuelType}`, clear: () => setFuelType('All') });
  if (condition !== 'All') activeChips.push({ label: `Cond: ${condition}`, clear: () => setCondition('All') });

  // Quick budget button click helper
  const setQuickBudget = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
    setPage(1);
  };

  const renderSidebar = () => (
    <div className="space-y-6">
      {/* Search Input */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
          Search Catalog
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="e.g. Camry, APX-10023, AWD..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Quick Budget Shortcuts */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
          Budget Range
        </label>
        <div className="grid grid-cols-2 gap-1.5 mb-3">
          <button
            type="button"
            onClick={() => setQuickBudget(0, 2000)}
            className={`px-2 py-1.5 text-xs rounded border text-left cursor-pointer transition-colors ${
              minPrice === 0 && maxPrice === 2000 ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Under $2,000
          </button>
          <button
            type="button"
            onClick={() => setQuickBudget(2000, 3000)}
            className={`px-2 py-1.5 text-xs rounded border text-left cursor-pointer transition-colors ${
              minPrice === 2000 && maxPrice === 3000 ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            $2,000 – $3,000
          </button>
          <button
            type="button"
            onClick={() => setQuickBudget(3000, 5000)}
            className={`px-2 py-1.5 text-xs rounded border text-left cursor-pointer transition-colors ${
              minPrice === 3000 && maxPrice === 5000 ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            $3,000 – $5,000
          </button>
          <button
            type="button"
            onClick={() => setQuickBudget(5000, 7999)}
            className={`px-2 py-1.5 text-xs rounded border text-left cursor-pointer transition-colors ${
              minPrice === 5000 && maxPrice === 7999 ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            $5,000 – $7,999
          </button>
        </div>

        {/* Max Price Range Slider */}
        <div className="pt-1">
          <div className="flex justify-between text-xs text-slate-600 mb-1">
            <span>Price Cap</span>
            <span className="font-bold text-slate-900 tabular-nums">${maxPrice.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="1500"
            max="8000"
            step="100"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(Number(e.target.value));
              setPage(1);
            }}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
            <span>$1.5k</span>
            <span className="font-semibold text-slate-700">$8,000 Limit</span>
          </div>
        </div>
      </div>

      {/* Make */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
          Make
        </label>
        <select
          value={make}
          onChange={(e) => {
            setMake(e.target.value);
            setPage(1);
          }}
          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
        >
          <option value="All">All Makes ({facets.makes.length})</option>
          {facets.makes.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Body Style */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
          Body Style
        </label>
        <select
          value={bodyStyle}
          onChange={(e) => {
            setBodyStyle(e.target.value);
            setPage(1);
          }}
          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
        >
          <option value="All">All Styles</option>
          {facets.bodyStyles.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      {/* Minimum Year */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
          Minimum Model Year
        </label>
        <select
          value={minYear}
          onChange={(e) => {
            setMinYear(Number(e.target.value));
            setPage(1);
          }}
          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
        >
          <option value={2004}>Any Year (2004+)</option>
          <option value={2008}>2008 or newer</option>
          <option value={2010}>2010 or newer</option>
          <option value={2012}>2012 or newer</option>
          <option value={2014}>2014 or newer</option>
        </select>
      </div>

      {/* Maximum Mileage */}
      <div>
        <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
          <span>Max Mileage</span>
          <span className="font-bold text-slate-900 tabular-nums">
            {maxMileage >= 200000 ? 'Any' : `${maxMileage.toLocaleString()} mi`}
          </span>
        </div>
        <input
          type="range"
          min="50000"
          max="200000"
          step="10000"
          value={maxMileage}
          onChange={(e) => {
            setMaxMileage(Number(e.target.value));
            setPage(1);
          }}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      {/* Transmission & Drivetrain */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1 uppercase tracking-wider">
            Transmission
          </label>
          <select
            value={transmission}
            onChange={(e) => {
              setTransmission(e.target.value);
              setPage(1);
            }}
            className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="All">All</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
            <option value="CVT">CVT</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1 uppercase tracking-wider">
            Drivetrain
          </label>
          <select
            value={drivetrain}
            onChange={(e) => {
              setDrivetrain(e.target.value);
              setPage(1);
            }}
            className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="All">All</option>
            <option value="FWD">FWD</option>
            <option value="AWD">AWD</option>
            <option value="RWD">RWD</option>
            <option value="4WD">4WD</option>
          </select>
        </div>
      </div>

      {/* Fuel Type & Condition */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1 uppercase tracking-wider">
            Fuel Type
          </label>
          <select
            value={fuelType}
            onChange={(e) => {
              setFuelType(e.target.value);
              setPage(1);
            }}
            className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="All">All</option>
            <option value="Gasoline">Gasoline</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Flex Fuel">Flex Fuel</option>
            <option value="Diesel">Diesel</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1 uppercase tracking-wider">
            Condition
          </label>
          <select
            value={condition}
            onChange={(e) => {
              setCondition(e.target.value);
              setPage(1);
            }}
            className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="All">All</option>
            <option value="Good">Good</option>
            <option value="Very Good">Very Good</option>
            <option value="Excellent">Excellent</option>
          </select>
        </div>
      </div>

      {/* Reset Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleResetFilters}
          className="w-full py-2 px-3 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="text-xs text-slate-500 mb-1">
              <span>Home</span>
              <span className="mx-1.5">/</span>
              <span className="text-slate-800 font-medium">Inventory Catalog</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-950 tracking-tight">
              Browse Pre-Owned Cars Under $8,000
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Showing <span className="font-semibold text-slate-900 tabular-nums">{queryResult.total.toLocaleString()}</span> matching vehicles in current inventory.
            </p>
          </div>

          {/* Controls: Sort and View mode */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Filters ({activeChips.length})</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs text-slate-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as any);
                  setPage(1);
                }}
                className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="year-desc">Model Year: Newest First</option>
                <option value="year-asc">Model Year: Oldest First</option>
                <option value="mileage-asc">Lowest Mileage</option>
              </select>
            </div>

            {/* Grid / List switch */}
            <div className="hidden sm:flex items-center bg-slate-200/80 p-0.5 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-slate-500 font-medium">Active Filters:</span>
            {activeChips.map((chip, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-white border border-slate-300 text-slate-700 rounded-md shadow-2xs"
              >
                <span>{chip.label}</span>
                <button
                  onClick={chip.clear}
                  className="hover:text-red-600 cursor-pointer"
                  aria-label="Remove filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            <button
              onClick={handleResetFilters}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium ml-1 cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Main Layout: Sidebar Left, Vehicle Results Right */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs sticky top-22">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <span className="text-sm font-bold font-display text-slate-900 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-blue-600" />
                  Filter Inventory
                </span>
                <span className="text-xs text-slate-400 tabular-nums">
                  5,000+ total
                </span>
              </div>
              {renderSidebar()}
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3">
            {queryResult.vehicles.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  No vehicles found matching your criteria
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your price ceiling, selecting a different make, or resetting your filters to browse the full catalog.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div>
                {/* Vehicles View */}
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {queryResult.vehicles.map((v) => (
                      <VehicleCard
                        key={v.id}
                        vehicle={v}
                        isFavorite={favorites.includes(v.id)}
                        isInComparison={comparisonIds.includes(v.id)}
                        onToggleFavorite={onToggleFavorite}
                        onToggleCompare={onToggleCompare}
                        onViewDetails={onViewDetails}
                        onQuickInquire={onQuickInquire}
                        viewMode="grid"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {queryResult.vehicles.map((v) => (
                      <VehicleCard
                        key={v.id}
                        vehicle={v}
                        isFavorite={favorites.includes(v.id)}
                        isInComparison={comparisonIds.includes(v.id)}
                        onToggleFavorite={onToggleFavorite}
                        onToggleCompare={onToggleCompare}
                        onViewDetails={onViewDetails}
                        onQuickInquire={onQuickInquire}
                        viewMode="list"
                      />
                    ))}
                  </div>
                )}

                {/* Pagination Controls */}
                <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-500">
                    Showing <span className="font-semibold text-slate-800 tabular-nums">{((page - 1) * pageSize) + 1}</span> to{' '}
                    <span className="font-semibold text-slate-800 tabular-nums">
                      {Math.min(page * pageSize, queryResult.total)}
                    </span> of{' '}
                    <span className="font-semibold text-slate-800 tabular-nums">{queryResult.total.toLocaleString()}</span> vehicles
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Previous</span>
                    </button>

                    <div className="flex items-center gap-1 text-xs font-medium">
                      <span className="px-2.5 py-1 bg-blue-600 text-white rounded-md tabular-nums">
                        {page}
                      </span>
                      <span className="text-slate-400">/</span>
                      <span className="text-slate-600 tabular-nums">
                        {queryResult.totalPages}
                      </span>
                    </div>

                    <button
                      onClick={() => setPage(p => Math.min(queryResult.totalPages, p + 1))}
                      disabled={page >= queryResult.totalPages}
                      className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Page Size Selector */}
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
                    <span>Per page:</span>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPage(1);
                      }}
                      className="px-2 py-1 text-xs bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-none"
                    >
                      <option value={12}>12</option>
                      <option value={24}>24</option>
                      <option value={48}>48</option>
                    </select>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Filter Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full p-6 overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
              <span className="text-base font-bold font-display text-slate-900">
                Filter Inventory
              </span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {renderSidebar()}

            <div className="mt-6 pt-4 border-t border-slate-200">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 bg-blue-600 text-white font-semibold text-xs rounded-lg"
              >
                Apply Filters ({queryResult.total.toLocaleString()} Results)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
