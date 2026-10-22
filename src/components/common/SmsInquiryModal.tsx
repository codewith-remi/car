import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  Phone, 
  Mail, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  Car
} from 'lucide-react';
import { Vehicle, PurchaseInquiry } from '../../types/vehicle';
import { submitInquiry, generateInquiryMailtoLink, generateInquirySmsLink } from '../../services/storeService';

interface SmsInquiryModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (inquiry: PurchaseInquiry) => void;
}

export const SmsInquiryModal: React.FC<SmsInquiryModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [message, setMessage] = useState('Hi, I am interested in this vehicle. Is it still available for inspection or purchase?');
  const [preferredMethod, setPreferredMethod] = useState<'SMS' | 'Email' | 'Phone'>('SMS');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<PurchaseInquiry | null>(null);

  if (!isOpen) return null;

  const quickPresets = [
    'Is this vehicle still available?',
    'Can I schedule a test drive this week?',
    'Please send the vehicle history & inspection report.',
    'What is the estimated delivery timeframe to my area?'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone || !customerEmail || !customerName) return;

    setIsSubmitting(true);

    const vehicleTitle = vehicle 
      ? `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`
      : 'General Vehicle Inquiry';

    const items = vehicle ? [{
      vehicleId: vehicle.id,
      vehicleTitle,
      price: vehicle.price,
      mainImage: vehicle.mainImage,
      vin: vehicle.vin,
      location: vehicle.location
    }] : [];

    setTimeout(() => {
      const inquiry = submitInquiry({
        customerName,
        customerPhone,
        customerEmail,
        preferredContact: preferredMethod,
        customerMessage: message,
        deliveryRequired: false,
        deliveryQuoteEstimate: 0,
        status: 'New',
        totalValue: vehicle ? vehicle.price : 0,
        items
      });

      setIsSubmitting(false);
      setSubmittedInquiry(inquiry);
      if (onSuccess) {
        onSuccess(inquiry);
      }
    }, 450);
  };

  const handleResetAndClose = () => {
    setSubmittedInquiry(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-display">
                Send SMS & Direct Inquiry
              </h3>
              <p className="text-[11px] text-slate-300">
                Routed to <span className="font-mono text-blue-300">codewithremi40@gmail.com</span> for instant reply
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Vehicle Badge (if vehicle provided) */}
        {vehicle && (
          <div className="p-3.5 bg-slate-50 border-b border-slate-200/80 flex items-center gap-3">
            <img
              src={vehicle.mainImage}
              alt={vehicle.model}
              className="w-16 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-slate-900 truncate font-display">
                  {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}
                </h4>
                <span className="text-xs font-extrabold text-blue-600 tabular-nums">
                  ${vehicle.price.toLocaleString()}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                <span>VIN: <span className="font-mono">{vehicle.vin}</span></span>
                <span>·</span>
                <span>{vehicle.location}</span>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6">
          {submittedInquiry ? (
            /* Confirmation View */
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Inquiry Successfully Dispatched
                </span>
                <h4 className="text-lg font-bold text-slate-900 mt-2 font-display">
                  Sent to codewithremi40@gmail.com
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  The dealership received your vehicle inquiry reference <strong className="font-mono text-blue-600">{submittedInquiry.referenceNumber}</strong> and will reply directly to your contact below:
                </p>
              </div>

              {/* Reply-To Route Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Destination:</span>
                  <span className="font-mono font-semibold text-slate-900">codewithremi40@gmail.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Your Reply Phone / SMS:</span>
                  <span className="font-semibold text-slate-900">{submittedInquiry.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Your Reply Email:</span>
                  <span className="font-semibold text-slate-900">{submittedInquiry.customerEmail}</span>
                </div>
              </div>

              {/* Direct Mail & SMS triggers */}
              <div className="pt-2 space-y-2">
                <a
                  href={generateInquiryMailtoLink(submittedInquiry)}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Direct Email to codewithremi40@gmail.com</span>
                </a>

                <a
                  href={generateInquirySmsLink(submittedInquiry.customerPhone, `Autoplex SMS: Inquiry on ${vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Vehicle'} ref ${submittedInquiry.referenceNumber}. Sent to codewithremi40@gmail.com.`)}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Trigger Direct SMS on Your Device</span>
                </a>
              </div>

              <button
                onClick={handleResetAndClose}
                className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Close Window
              </button>
            </div>
          ) : (
            /* Inquiry Form */
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Recipient Notice */}
              <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-blue-900 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Your inquiry will be delivered to <strong className="font-mono text-slate-900">codewithremi40@gmail.com</strong>. The dealer will reply directly to your contact information.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Alex Henderson"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mobile Phone (For SMS Reply) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="(555) 019-2834"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email Address (For Direct Reply) *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Preferred Reply Channel */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  How Should the Dealership Reply to You?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['SMS', 'Email', 'Phone'] as const).map((method) => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setPreferredMethod(method)}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        preferredMethod === method
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {method === 'SMS' && <MessageSquare className="w-3.5 h-3.5" />}
                      {method === 'Email' && <Mail className="w-3.5 h-3.5" />}
                      {method === 'Phone' && <Phone className="w-3.5 h-3.5" />}
                      <span>{method}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Quick Question Templates
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {quickPresets.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setMessage(preset)}
                      className="text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md transition-colors text-left cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message text area */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Your SMS / Message *
                </label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message to the dealer..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider text-xs"
              >
                {isSubmitting ? (
                  <span>Sending to codewithremi40@gmail.com...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send SMS Inquiry to codewithremi40@gmail.com</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-slate-500">
                Direct two-way message link. The recipient can reply to your email or text your phone number immediately.
              </p>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
