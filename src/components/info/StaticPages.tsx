import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Truck, 
  HelpCircle, 
  ArrowLeft, 
  FileText, 
  CheckCircle2, 
  Send,
  MessageSquare
} from 'lucide-react';
import { SiteSettings, PurchaseInquiry } from '../../types/vehicle';
import { logActivity, submitInquiry, generateInquiryMailtoLink, generateInquirySmsLink } from '../../services/storeService';

interface StaticPageProps {
  page: 'about' | 'contact' | 'faqs' | 'shipping' | 'privacy' | 'terms';
  settings: SiteSettings;
  onBack: () => void;
  onBrowse: (params?: any) => void;
}

export const StaticPages: React.FC<StaticPageProps> = ({
  page,
  settings,
  onBack,
  onBrowse
}) => {
  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [submittedInquiry, setSubmittedInquiry] = useState<PurchaseInquiry | null>(null);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail) return;

    const inq = submitInquiry({
      customerName: contactName,
      customerEmail: contactEmail,
      customerPhone: contactPhone || '(Not provided)',
      preferredContact: contactPhone ? 'SMS' : 'Email',
      customerMessage: contactMessage,
      deliveryRequired: false,
      deliveryQuoteEstimate: 0,
      status: 'New',
      totalValue: 0,
      items: []
    });

    setSubmittedInquiry(inq);
    logActivity('Guest Contact', 'General Inquiry Sent to codewithremi40@gmail.com', `Inquiry ${inq.referenceNumber} from ${contactName} (${contactEmail})`, 'inquiry');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Previous View</span>
          </button>
        </div>

        {/* ABOUT PAGE */}
        {page === 'about' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-6">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">
              About Autoplex Auto Group
            </span>
            <h1 className="text-3xl font-bold font-display text-slate-950">
              Democratizing Quality Personal Transportation
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              {settings.aboutText}
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              We operate across 15+ logistics regional centers, sourcing high-grade second-hand trade-ins, fleet vehicles, and private consignments that pass our rigorous 120-point mechanical safety and emissions evaluation.
            </p>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-2xl font-extrabold font-display text-blue-600 block tabular-nums">5,000+</span>
                <span className="text-xs text-slate-600 font-medium">Distinct Vehicle Listings</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-2xl font-extrabold font-display text-emerald-600 block tabular-nums">$2.5k – $8k</span>
                <span className="text-xs text-slate-600 font-medium">Guaranteed Price Range</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-2xl font-extrabold font-display text-slate-900 block tabular-nums">120-Pt</span>
                <span className="text-xs text-slate-600 font-medium">Inspection Standard</span>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => onBrowse()}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Browse Our Complete Inventory
              </button>
            </div>
          </div>
        )}

        {/* CONTACT PAGE */}
        {page === 'contact' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-8">
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block mb-1">
                Customer Support
              </span>
              <h1 className="text-3xl font-bold font-display text-slate-950">
                Contact Autoplex Auto Group
              </h1>
              <p className="text-sm text-slate-600 mt-2">
                Have questions about a specific listing, freight estimate, or scheduling an on-site lot inspection? Our vehicle coordinators are here to assist.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              {/* Dealership Details */}
              <div className="space-y-5 text-xs text-slate-700">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Main Facility & Showroom</strong>
                      <span>{settings.dealershipAddress}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Customer Inquiries Phone</strong>
                      <span>{settings.supportPhone}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Inquiries Desk</strong>
                      <span>{settings.supportEmail}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Operating Hours</strong>
                      <span>Monday – Friday: 8:00 AM – 7:00 PM CST</span>
                      <span className="block">Saturday: 9:00 AM – 5:00 PM CST</span>
                      <span className="block text-slate-500">Sunday: Closed (Inquiries queued)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                {submittedInquiry ? (
                  <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h3 className="text-sm font-bold text-emerald-950">Inquiry Routed to Dealership</h3>
                    <p className="text-xs text-emerald-800">
                      Your inquiry has been sent to <strong className="font-mono text-slate-900">codewithremi40@gmail.com</strong>.
                    </p>

                    <div className="p-3 bg-white border border-emerald-200 rounded-lg text-left text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Reference:</span>
                        <span className="font-mono font-bold text-blue-600">{submittedInquiry.referenceNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Destination:</span>
                        <span className="font-mono font-semibold text-slate-900">codewithremi40@gmail.com</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Direct Reply-To:</span>
                        <span className="font-semibold text-slate-900">{submittedInquiry.customerEmail}</span>
                      </div>
                      {submittedInquiry.customerPhone && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">SMS / Phone:</span>
                          <span className="font-semibold text-slate-900">{submittedInquiry.customerPhone}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex flex-col gap-2">
                      <a
                        href={generateInquiryMailtoLink(submittedInquiry)}
                        className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Direct Email to codewithremi40@gmail.com</span>
                      </a>
                      {submittedInquiry.customerPhone && (
                        <a
                          href={generateInquirySmsLink(submittedInquiry.customerPhone, `Autoplex Contact: ${submittedInquiry.customerMessage}`)}
                          className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Send as Direct SMS</span>
                        </a>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setSubmittedInquiry(null)}
                      className="text-xs text-slate-600 hover:text-slate-900 underline pt-2 cursor-pointer"
                    >
                      Send another inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-0.5">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="John Smith"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-0.5">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="john@example.com"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-0.5">Mobile Phone (For SMS Reply)</label>
                        <input
                          type="tel"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="(555) 000-0000"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-0.5">Message / Inquiry Details *</label>
                      <textarea
                        rows={4}
                        required
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Ask about a car, financing, or schedule a lot test drive..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Message to codewithremi40@gmail.com</span>
                    </button>
                    <p className="text-[11px] text-slate-500 text-center">
                      Delivered directly to codewithremi40@gmail.com with 2-way reply to your phone or email.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* FAQS PAGE */}
        {page === 'faqs' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-6">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">
              Frequently Asked Questions
            </span>
            <h1 className="text-3xl font-bold font-display text-slate-950">
              Clear Answers on Pricing, Quality & Delivery
            </h1>

            <div className="space-y-4 pt-4 text-xs">
              {[
                {
                  q: 'Are all vehicles really priced strictly between $2,500 and $8,000 USD?',
                  a: 'Yes, 100%. Our platform and database enforce an unyielding programmatic price boundary: no vehicle is ever listed below $2,500 or above $8,000. We specialize exclusively in certified, high-value second-hand commuter vehicles.'
                },
                {
                  q: 'How large is your inventory?',
                  a: 'We maintain over 5,000 distinct vehicle listings cataloged across our fulfillment hubs. Every vehicle has a unique identifier, verified specifications, and distinct VIN.'
                },
                {
                  q: 'What is included in the 120-point mechanical inspection?',
                  a: 'Our certified mechanics check engine compression, transmission shifting, brake pads/rotors, steering geometry, suspension bushings, OBD-II diagnostic error codes, heating/AC functionality, and tire tread depth.'
                },
                {
                  q: 'Does submitting a purchase inquiry automatically buy the car?',
                  a: 'No. Submitting an inquiry creates an official reservation request for our staff to verify vehicle readiness and contact you. No funds are charged until you inspect the vehicle, sign the purchase agreement, and choose your payment method.'
                },
                {
                  q: 'Can I have my vehicle delivered to my home?',
                  a: 'Yes. We partner with bonded, fully insured DOT automotive carriers. Use our Delivery & Freight tool to estimate transit rates based on destination ZIP code.'
                }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-900">{item.q}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SHIPPING & DELIVERY GUIDE */}
        {page === 'shipping' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-6">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">
              Logistics Policy & Rates
            </span>
            <h1 className="text-3xl font-bold font-display text-slate-950">
              Shipping & Nationwide Transport Information
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Autoplex Auto Group provides nationwide door-to-door delivery across all 48 continental states. We work exclusively with FMCSA licensed, bonded car carriers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-slate-900">Open Multi-Car Carrier</h4>
                <p className="text-slate-600">Standard economical freight method. Cars are secured on commercial hydraulic trailers. Typical cost: $280 – $650 depending on distance.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-slate-900">Enclosed Protective Freight</h4>
                <p className="text-slate-600">Premium sealed trailer transit protecting vehicles from weather and road elements. Recommended for pristine luxury models.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
              <strong>Transparent Delivery Policy:</strong>
              <p>
                Delivery quotes are calculated based on carrier mileage and vehicle curb weight. Delivery dates are subject to carrier dispatch inspection and driver safety regulations.
              </p>
            </div>
          </div>
        )}

        {/* PRIVACY POLICY */}
        {page === 'privacy' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-6 text-xs text-slate-600 leading-relaxed">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">
              Legal Documentation
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-950">
              Autoplex Auto Group Privacy Policy
            </h1>
            <p>Last updated: October 2026</p>
            <p>
              Autoplex Auto Group values your privacy. We collect customer information (such as name, phone number, email address, and delivery location) solely to coordinate vehicle purchase inquiries, condition reports, and logistics freight quotes.
            </p>
            <h3 className="text-sm font-bold text-slate-900 pt-2">Data Protection</h3>
            <p>
              We do not sell, rent, or trade your personal contact details to third-party marketing companies. Communication is restricted to dealership operations, vehicle status alerts, and inquiry follow-ups.
            </p>
          </div>
        )}

        {/* TERMS & CONDITIONS */}
        {page === 'terms' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-6 text-xs text-slate-600 leading-relaxed">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">
              Legal Agreement
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-950">
              Terms & Conditions of Service
            </h1>
            <p>Last updated: October 2026</p>
            <h3 className="text-sm font-bold text-slate-900 pt-2">1. Inventory Pricing Policy</h3>
            <p>
              Every public listing displayed on Autoplex Auto Group is guaranteed to be strictly between $2,500 and $8,000 USD. Prices do not include applicable state sales tax, title transfer fees, or carrier freight unless explicitly bundled.
            </p>
            <h3 className="text-sm font-bold text-slate-900 pt-2">2. Purchase Inquiries</h3>
            <p>
              Submitting a purchase inquiry constitutes a request for vehicle availability and condition review. It does not establish an unconditional contract of sale or transfer ownership title until an official bill of sale is executed and funds are settled.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
