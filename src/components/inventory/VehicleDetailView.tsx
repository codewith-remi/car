import React, { useState } from 'react';
import { 
  Heart, 
  Layers, 
  Share2, 
  MapPin, 
  Gauge, 
  ShieldCheck, 
  Fuel, 
  Settings2, 
  CheckCircle2, 
  Phone, 
  Mail, 
  ArrowLeft, 
  Maximize2, 
  X, 
  AlertCircle,
  Truck,
  FileCheck,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Vehicle } from '../../types/vehicle';
import { getSimilarVehicles } from '../../services/inventoryService';
import { VehicleCard } from '../common/VehicleCard';

interface VehicleDetailViewProps {
  vehicle: Vehicle;
  isFavorite: boolean;
  isInComparison: boolean;
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onBack: () => void;
  onViewDetails: (id: string) => void;
  onStartInquiry: (vehicle: Vehicle) => void;
}

export const VehicleDetailView: React.FC<VehicleDetailViewProps> = ({
  vehicle,
  isFavorite,
  isInComparison,
  onToggleFavorite,
  onToggleCompare,
  onBack,
  onViewDetails,
  onStartInquiry
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'inspection' | 'delivery'>('overview');

  const similarVehicles = getSimilarVehicles(vehicle, 3);

  const images = vehicle.gallery && vehicle.gallery.length > 0 
    ? vehicle.gallery 
    : [vehicle.mainImage];

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Navigation & Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Inventory</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(vehicle.id)}
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                isFavorite
                  ? 'bg-rose-50 border-rose-300 text-rose-600'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-600' : ''}`} />
              <span>{isFavorite ? 'Saved to Favorites' : 'Save Vehicle'}</span>
            </button>

            <button
              onClick={() => onToggleCompare(vehicle.id)}
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                isInComparison
                  ? 'bg-blue-50 border-blue-300 text-blue-600'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isInComparison ? 'In Comparison' : 'Compare'}</span>
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer relative"
              title="Copy link to listing"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Gallery & Specs on Left, Contiguous Purchase Module on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Gallery & Details (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Gallery Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
              {/* Main Image Display */}
              <div className="relative aspect-16/10 bg-slate-900 overflow-hidden group">
                <img
                  src={images[selectedImageIndex] || vehicle.mainImage}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                />

                {/* Status Overlay */}
                {vehicle.status !== 'Available' && (
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center">
                    <span className="text-white font-bold text-base tracking-widest uppercase bg-red-600 px-4 py-2 rounded shadow-lg">
                      {vehicle.status}
                    </span>
                  </div>
                )}

                {/* Fullscreen Button */}
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="absolute bottom-4 right-4 p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg backdrop-blur-xs transition-colors cursor-pointer"
                  title="View full screen gallery"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded">
                  Image {selectedImageIndex + 1} of {images.length}
                </div>
              </div>

              {/* Thumbnails Row */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-3 overflow-x-auto">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      selectedImageIndex === idx ? 'border-blue-600 scale-102 ring-2 ring-blue-100' : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title & Key Spec Highlights */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    {vehicle.bodyStyle} · {vehicle.condition} · ID: {vehicle.id}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-950">
                    {vehicle.year} {vehicle.make} {vehicle.model} <span className="text-slate-600 font-normal">{vehicle.trim}</span>
                  </h1>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-medium">Autoplex Price</span>
                  <span className="text-3xl font-extrabold font-display text-slate-950 tabular-nums">
                    ${vehicle.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-emerald-700 font-medium block">
                    Strict Under-$8,000 Guarantee
                  </span>
                </div>
              </div>

              {/* Core Specs Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-100 text-xs">
                <div>
                  <span className="text-slate-500 block mb-0.5">Mileage</span>
                  <span className="font-bold text-slate-900 text-sm tabular-nums">
                    {vehicle.mileage.toLocaleString()} mi
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Transmission</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {vehicle.transmission}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Drivetrain</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {vehicle.drivetrain}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Fuel Economy</span>
                  <span className="font-bold text-slate-900 text-sm tabular-nums">
                    {vehicle.mpgCity}/{vehicle.mpgHwy} MPG
                  </span>
                </div>
              </div>

              {/* Tabs for Overview, Features, Inspection, Shipping */}
              <div className="pt-6">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      activeTab === 'overview' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Vehicle Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('features')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      activeTab === 'features' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Features & Equipment ({vehicle.features.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('inspection')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      activeTab === 'inspection' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    120-Point Certification
                  </button>
                  <button
                    onClick={() => setActiveTab('delivery')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      activeTab === 'delivery' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Delivery & Freight
                  </button>
                </div>

                {/* Tab 1: Overview */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-2">Detailed Description</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {vehicle.description}
                      </p>
                    </div>

                    {/* Complete Specifications Grid */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-3">Vehicle Specifications</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div>
                          <span className="text-slate-500 block">VIN (Verified)</span>
                          <span className="font-mono font-medium text-slate-900">{vehicle.vin}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Engine</span>
                          <span className="font-medium text-slate-900">{vehicle.engine}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Fuel Type</span>
                          <span className="font-medium text-slate-900">{vehicle.fuelType}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Exterior Color</span>
                          <span className="font-medium text-slate-900">{vehicle.exteriorColor}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Interior Color</span>
                          <span className="font-medium text-slate-900">{vehicle.interiorColor}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Doors / Seating</span>
                          <span className="font-medium text-slate-900">{vehicle.doors} Doors / {vehicle.seats} Seats</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Location Hub</span>
                          <span className="font-medium text-slate-900">{vehicle.location}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Listed Date</span>
                          <span className="font-medium text-slate-900">{new Date(vehicle.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Pricing Compliance</span>
                          <span className="font-medium text-emerald-700">Verified $2,500 – $8,000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Features */}
                {activeTab === 'features' && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-3">Installed Features & Options</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {vehicle.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="text-slate-800 font-medium">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 3: 120-Point Inspection */}
                {activeTab === 'inspection' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-emerald-900">Passed 120-Point Mechanical & Safety Certification</h4>
                        <p className="text-xs text-emerald-800 mt-1">
                          This vehicle underwent comprehensive mechanical verification by our ASE-certified automotive inspection technicians prior to inventory listing.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {[
                        'Engine block compression & fluids tested',
                        'Transmission shift engagement verified',
                        'Braking system pads & rotors > 70% life',
                        'Steering rack, tie rods & suspension firm',
                        'Tire tread depth measured at 6/32" or greater',
                        'Battery charging system & alternator passed',
                        'All exterior lighting & turn indicators operational',
                        'Air conditioning & heating system verified',
                        'Exhaust & catalytic converter emissions sound',
                        'OBD-II diagnostic scan: No active fault codes'
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 4: Delivery */}
                {activeTab === 'delivery' && (
                  <div className="space-y-4 text-xs text-slate-600">
                    <p>
                      This vehicle is physically parked at our <strong className="text-slate-900">{vehicle.location}</strong> logistics facility. We provide two convenient delivery channels:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                        <h4 className="font-bold text-slate-900 mb-1">Direct Lot Pickup</h4>
                        <p>Coordinate an on-site walkthrough and direct drive-away at no additional charge.</p>
                      </div>
                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                        <h4 className="font-bold text-slate-900 mb-1">Nationwide Carrier Transport</h4>
                        <p>Bonded auto-carrier transport directly to your driveway. Request freight quote during checkout inquiry.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Similar Vehicles Carousel / Grid */}
            {similarVehicles.length > 0 && (
              <div className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold font-display text-slate-900">
                    Similar Vehicles Under $8,000
                  </h3>
                  <span className="text-xs text-slate-500">Matching {vehicle.bodyStyle}s</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {similarVehicles.map((sim) => (
                    <VehicleCard
                      key={sim.id}
                      vehicle={sim}
                      isFavorite={false}
                      isInComparison={false}
                      onToggleFavorite={onToggleFavorite}
                      onToggleCompare={onToggleCompare}
                      onViewDetails={onViewDetails}
                      viewMode="grid"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Contiguous Purchase Module (PDP Sticky) (4 cols) */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            
            {/* Action Box */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
              <div className="pb-4 mb-4 border-b border-slate-100">
                <span className="text-xs text-slate-400 block font-medium">Drive-Away Price</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-3xl font-extrabold font-display text-slate-950 tabular-nums">
                    ${vehicle.price.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    $2,500 – $8,000
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Excludes state tax & registration. Zero mandatory dealer doc fees.
                </p>
              </div>

              {/* Status Notice */}
              {vehicle.status !== 'Available' ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2 mb-4">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">This vehicle is {vehicle.status.toLowerCase()}.</span>
                    <p className="text-[11px] mt-0.5">
                      Purchase inquiries are disabled for unavailable units. Explore similar cars below.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => onStartInquiry(vehicle)}
                    className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Submit Purchase Inquiry</span>
                  </button>

                  <a
                    href="tel:+18005552886"
                    className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>Call Dealership Support</span>
                  </a>
                </div>
              )}

              {/* Dealership Info & Guarantees */}
              <div className="mt-6 pt-5 border-t border-slate-100 space-y-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>100% Verified Clean Title & Odometer</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Complete Vehicle History Report Provided</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Door-to-door nationwide delivery available</span>
                </div>
              </div>

              {/* Location Card */}
              <div className="mt-5 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold mb-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Lot Location: {vehicle.location}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Autoplex Auto Group Regional Fulfillment Hub. Open Monday–Saturday 9am–7pm.
                </p>
              </div>
            </div>

            {/* Price Transparency Callout */}
            <div className="p-4 bg-blue-900 text-white rounded-xl shadow-xs text-xs space-y-2">
              <span className="font-bold text-blue-200 block uppercase tracking-wider text-[10px]">
                Autoplex Price Pledge
              </span>
              <p className="text-slate-200 leading-relaxed">
                Every Autoplex vehicle is strictly priced between $2,500 and $8,000 USD. Our automated catalog policy prevents any vehicle outside this boundary from appearing.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-full bg-slate-800/80 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-5xl max-h-[80vh] w-full flex items-center justify-center">
            <img
              src={images[selectedImageIndex]}
              alt="Fullscreen view"
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          <div className="mt-4 flex items-center gap-2 overflow-x-auto p-2">
            {images.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`w-16 h-12 rounded border-2 overflow-hidden cursor-pointer ${
                  selectedImageIndex === idx ? 'border-blue-500' : 'border-transparent opacity-60'
                }`}
              >
                <img src={imgUrl} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky Buy / Inquire Bar */}
      {vehicle.status === 'Available' && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 p-3 shadow-lg flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Price</span>
            <span className="text-lg font-bold text-slate-950 tabular-nums">
              ${vehicle.price.toLocaleString()}
            </span>
          </div>
          <button
            onClick={() => onStartInquiry(vehicle)}
            className="flex-1 py-2.5 px-4 bg-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm text-center"
          >
            Submit Purchase Inquiry
          </button>
        </div>
      )}
    </div>
  );
};
