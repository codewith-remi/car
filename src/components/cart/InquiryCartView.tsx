import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Send,
  FileCheck
} from 'lucide-react';
import { Vehicle, PurchaseInquiry, CustomerUser } from '../../types/vehicle';
import { submitInquiry, clearInquiryCart, generateInquiryMailtoLink, generateInquirySmsLink } from '../../services/storeService';

interface InquiryCartViewProps {
  cartVehicles: Vehicle[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onBack: () => void;
  onBrowse: () => void;
  onViewDetails: (id: string) => void;
  customerUser: CustomerUser | null;
  onInquirySubmitted: (inquiry: PurchaseInquiry) => void;
}

export const InquiryCartView: React.FC<InquiryCartViewProps> = ({
  cartVehicles,
  onRemoveItem,
  onClearCart,
  onBack,
  onBrowse,
  onViewDetails,
  customerUser,
  onInquirySubmitted
}) => {
  // Form states
  const [customerName, setCustomerName] = useState(customerUser?.name || '');
  const [customerEmail, setCustomerEmail] = useState(customerUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState(customerUser?.phone || '');
  const [preferredContact, setPreferredContact] = useState<'Email' | 'Phone' | 'SMS' | 'WhatsApp'>('Email');
  const [customerMessage, setCustomerMessage] = useState('');
  
  // Delivery preference
  const [deliveryRequired, setDeliveryRequired] = useState(false);
  const [deliveryCity, setDeliveryCity] = useState(customerUser?.city || '');
  const [deliveryRegion, setDeliveryRegion] = useState('TX');
  const [deliveryPostalCode, setDeliveryPostalCode] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<PurchaseInquiry | null>(null);

  // Available vehicles in cart
  const availableItems = cartVehicles.filter(v => v.status === 'Available');
  const unavailableItems = cartVehicles.filter(v => v.status !== 'Available');
  const totalValue = availableItems.reduce((acc, curr) => acc + curr.price, 0);

  // Estimated freight calculation if delivery requested
  const estimatedFreight = deliveryRequired ? (availableItems.length * 320) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (availableItems.length === 0) return;

    setIsSubmitting(true);

    const inquiryData = {
      customerName,
      customerEmail,
      customerPhone,
      preferredContact,
      deliveryRequired,
      deliveryCity: deliveryRequired ? deliveryCity : undefined,
      deliveryRegion: deliveryRequired ? deliveryRegion : undefined,
      deliveryPostalCode: deliveryRequired ? deliveryPostalCode : undefined,
      deliveryQuoteEstimate: deliveryRequired ? estimatedFreight : 0,
      customerMessage,
      status: 'New' as const,
      totalValue,
      items: availableItems.map(v => ({
        vehicleId: v.id,
        vehicleTitle: `${v.year} ${v.make} ${v.model} ${v.trim}`,
        price: v.price,
        mainImage: v.mainImage,
        vin: v.vin,
        location: v.location
      }))
    };

    setTimeout(() => {
      const created = submitInquiry(inquiryData);
      clearInquiryCart();
      setIsSubmitting(false);
      setSubmittedInquiry(created);
      onInquirySubmitted(created);
    }, 600);
  };

  // Confirmation View
  if (submittedInquiry) {
    return (
      <div className="bg-slate-50 min-h-screen py-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-10 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
              Inquiry Dispatched to Dealership
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-950 mt-3">
              Inquiry Sent to codewithremi40@gmail.com
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
              Your inquiry has been logged and routed to <strong className="text-slate-900 font-mono">codewithremi40@gmail.com</strong>. The dealer can reply directly to your email (<strong className="text-slate-900">{submittedInquiry.customerEmail}</strong>) or phone.
            </p>

            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 inline-block text-left w-full max-w-md">
              <div className="flex justify-between text-xs py-1">
                <span className="text-slate-500">Inquiry Reference:</span>
                <span className="font-mono font-bold text-blue-600">{submittedInquiry.referenceNumber}</span>
              </div>
              <div className="flex justify-between text-xs py-1">
                <span className="text-slate-500">Destination Email:</span>
                <span className="font-mono font-semibold text-slate-900">codewithremi40@gmail.com</span>
              </div>
              <div className="flex justify-between text-xs py-1">
                <span className="text-slate-500">Reply-To Address:</span>
                <span className="font-semibold text-slate-800">{submittedInquiry.customerEmail}</span>
              </div>
              <div className="flex justify-between text-xs py-1">
                <span className="text-slate-500">Customer Phone:</span>
                <span className="font-semibold text-slate-800">{submittedInquiry.customerPhone}</span>
              </div>
              <div className="flex justify-between text-xs py-1">
                <span className="text-slate-500">Vehicles Inquired:</span>
                <span className="font-semibold text-slate-800">{submittedInquiry.items.length} vehicle(s)</span>
              </div>
              <div className="flex justify-between text-xs py-1">
                <span className="text-slate-500">Total Listed Value:</span>
                <span className="font-bold text-slate-900 tabular-nums">${submittedInquiry.totalValue.toLocaleString()}</span>
              </div>
              {submittedInquiry.deliveryRequired && (
                <div className="flex justify-between text-xs py-1 border-t border-slate-200 mt-1 pt-1">
                  <span className="text-slate-500">Estimated Freight:</span>
                  <span className="text-slate-800 font-semibold tabular-nums">~${submittedInquiry.deliveryQuoteEstimate}</span>
                </div>
              )}
            </div>

            {/* Direct Mail & SMS Actions */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={generateInquiryMailtoLink(submittedInquiry)}
                className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>Open in Mail App / Send to codewithremi40@gmail.com</span>
              </a>

              <a
                href={generateInquirySmsLink(submittedInquiry.customerPhone, `Autoplex Inquiry ${submittedInquiry.referenceNumber}: Interested in ${submittedInquiry.items[0]?.vehicleTitle || 'Vehicle'}. Sent to codewithremi40@gmail.com.`)}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Send SMS to Phone</span>
              </a>
            </div>

            <div className="mt-6 text-xs text-slate-600 text-left bg-blue-50 border border-blue-200 p-4 rounded-xl space-y-2">
              <div className="flex items-start gap-2">
                <FileCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Fast 2-Way Communication:</strong>
                  <p className="mt-0.5">
                    Your inquiry has been packaged with complete vehicle specifications and vehicle ID. When the owner at <strong className="text-slate-900">codewithremi40@gmail.com</strong> opens the inquiry, they can directly click "Reply" to message you back at <strong className="text-slate-900">{submittedInquiry.customerEmail}</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onBrowse}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Browse More Inventory
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty Cart State
  if (cartVehicles.length === 0) {
    return (
      <div className="bg-slate-50 min-h-screen py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-100">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-display text-slate-900">
            Your Inquiry Cart is Empty
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-sm mx-auto">
            Browse our catalog of over 5,000 certified pre-owned vehicles strictly priced below $8,000 and select vehicles to inquire about.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={onBrowse}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Browse 5,000+ Cars
            </button>
            <button
              onClick={onBack}
              className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-slate-200 gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-2xl font-bold font-display text-slate-950">
                Purchase Inquiry Cart
              </h1>
              <p className="text-xs text-slate-500">
                Review selected vehicles, specify delivery options, and submit your official inquiry.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBrowse}
              className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg cursor-pointer"
            >
              Add Another Vehicle
            </button>
            <button
              onClick={onClearCart}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 hover:text-red-600 rounded-lg cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Cart</span>
            </button>
          </div>
        </div>

        {/* Warning if any vehicle is unavailable */}
        {unavailableItems.length > 0 && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Note:</strong> Some vehicles in your cart are marked as Sold or Reserved ({unavailableItems.map(v => v.id).join(', ')}). Inquiries can only be submitted for Available units.
            </div>
          </div>
        )}

        {/* Two-Column Grid: Review items on Left (7 cols), Contact & Checkout Form on Right (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Selected Vehicles Review */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-base font-bold font-display text-slate-900">
              Selected Vehicles ({availableItems.length})
            </h2>

            {cartVehicles.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center gap-4 shadow-2xs"
              >
                <div 
                  onClick={() => onViewDetails(v.id)}
                  className="w-full sm:w-36 h-24 rounded-lg overflow-hidden bg-slate-100 cursor-pointer shrink-0"
                >
                  <img
                    src={v.mainImage}
                    alt={`${v.year} ${v.make} ${v.model}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 w-full sm:w-auto">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] text-slate-500 block uppercase font-medium">
                        {v.bodyStyle} · ID: {v.id}
                      </span>
                      <h3 
                        onClick={() => onViewDetails(v.id)}
                        className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer font-display"
                      >
                        {v.year} {v.make} {v.model} {v.trim}
                      </h3>
                      <div className="text-xs text-slate-600 mt-1 flex items-center gap-2">
                        <span>{v.mileage.toLocaleString()} mi</span>
                        <span>·</span>
                        <span>{v.transmission}</span>
                        <span>·</span>
                        <span>{v.location}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-extrabold text-slate-950 font-display tabular-nums block">
                        ${v.price.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-medium">
                        &lt; $8k Guarantee
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-mono text-[11px]">VIN: {v.vin}</span>
                    <button
                      onClick={() => onRemoveItem(v.id)}
                      className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Legal / Policy Disclaimer Box */}
            <div className="p-4 bg-slate-100/80 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span>Important Purchase Inquiry Terms:</span>
              </div>
              <p>
                Submitting a purchase inquiry initiates vehicle reservation inquiry with Autoplex Auto Group. It does not automatically execute a financial transaction, charge your bank card, or guarantee final vehicle allocation. All sales are finalized upon physical inspection review, bill of sale signature, and payment receipt.
              </p>
            </div>
          </div>

          {/* Right: Customer Contact & Checkout Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div>
              <h2 className="text-base font-bold font-display text-slate-900">
                Contact & Delivery Information
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Provide your details to receive vehicle availability confirmation and scheduling.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Robert Henderson"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="robert@example.com"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Contact Method
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Email', 'Phone', 'SMS', 'WhatsApp'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPreferredContact(method)}
                      className={`py-1.5 text-xs rounded-lg border font-medium cursor-pointer transition-colors ${
                        preferredContact === method
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery Toggle & Destination Info */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={deliveryRequired}
                    onChange={(e) => setDeliveryRequired(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-blue-600" />
                    Request Door-to-Door Vehicle Freight Delivery
                  </span>
                </label>

                {deliveryRequired && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                          Destination City
                        </label>
                        <input
                          type="text"
                          value={deliveryCity}
                          onChange={(e) => setDeliveryCity(e.target.value)}
                          placeholder="e.g. Fort Worth"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          maxLength={5}
                          value={deliveryPostalCode}
                          onChange={(e) => setDeliveryPostalCode(e.target.value)}
                          placeholder="e.g. 76102"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md text-slate-900"
                        />
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-500 flex justify-between pt-1">
                      <span>Freight Estimate:</span>
                      <span className="font-semibold text-slate-800 tabular-nums">~${estimatedFreight.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Customer Message / Questions */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Questions or Notes for Dealership
                </label>
                <textarea
                  rows={3}
                  value={customerMessage}
                  onChange={(e) => setCustomerMessage(e.target.value)}
                  placeholder="Ask about financing, appointment times, trade-in value, or delivery schedule..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900"
                />
              </div>

              {/* Price Summary */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Vehicles Total ({availableItems.length} items):</span>
                  <span className="font-bold text-slate-900 tabular-nums">${totalValue.toLocaleString()}</span>
                </div>
                {deliveryRequired && (
                  <div className="flex justify-between text-slate-600">
                    <span>Estimated Freight:</span>
                    <span className="font-medium text-slate-900 tabular-nums">${estimatedFreight.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-slate-950 pt-2 border-t border-slate-200">
                  <span>Total Inquiry Value:</span>
                  <span className="text-base text-blue-600 font-display tabular-nums">
                    ${(totalValue + estimatedFreight).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || availableItems.length === 0}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting Official Inquiry...' : 'Submit Official Purchase Inquiry'}</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
