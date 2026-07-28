import React, { useState } from 'react';
import { FileCheck, ShieldCheck, Briefcase, Globe, Building2, CheckCircle2, AlertCircle, ArrowRight, Clock, HelpCircle, PhoneCall } from 'lucide-react';

export const CorporateAndVisaHub: React.FC = () => {
  const [passportCountry, setPassportCountry] = useState('US');
  const [destinationCountry, setDestinationCountry] = useState('Uganda');
  const [corporateSubmitted, setCorporateSubmitted] = useState(false);

  // Visa rules database simulation focused on East Africa
  const VISA_RULES: Record<string, Record<string, { type: string; stay: string; fee: string; processing: string; requirements: string[] }>> = {
    US: {
      Uganda: { type: 'eVisa (visas.immigration.go.ug)', stay: '90 Days', fee: '$50 USD', processing: '24-48 Hours Online', requirements: ['Yellow Fever Vaccination Card (Mandatory)', 'Passport valid for 6+ months', 'Passport photo & return ticket'] },
      'East Africa Tourist Visa (EATV)': { type: 'Joint Multi-Country Permit (UG, KE, RW)', stay: '90 Days Multi-Entry', fee: '$100 USD', processing: '2-3 Days Online', requirements: ['Passport valid for 6+ months', 'Yellow Fever Certificate', 'Travel itinerary across UG, KE, RW'] },
      Kenya: { type: 'eTA (etakenya.go.ke)', stay: '90 Days', fee: '$34 USD', processing: '24-72 Hours', requirements: ['Passport valid 6+ months', 'Hotel booking confirmation', 'Return flight ticket'] },
      Tanzania: { type: 'eVisa or Visa on Arrival', stay: '90 Days', fee: '$100 USD (US Citizens)', processing: 'Instant / 3 Days Online', requirements: ['Yellow Fever Certificate if arriving from endemic zone', 'Passport valid 6+ months', 'Return ticket'] },
      Rwanda: { type: 'eVisa or Visa on Arrival', stay: '30 Days', fee: '$50 USD', processing: 'Instant at border or 2 Days Online', requirements: ['Passport valid 6+ months', 'Yellow Fever Certificate'] },
      Burundi: { type: 'Visa on Arrival at Bujumbura Airport', stay: '30 Days', fee: '$90 USD', processing: 'At Bujumbura (BJM) Airport', requirements: ['Yellow Fever Vaccination Card', 'Hotel reservation', 'Passport valid 6+ months'] },
      'South Sudan': { type: 'e-Visa (evisa.gov.ss)', stay: '30 Days', fee: '$100 USD', processing: '3-5 Days Online', requirements: ['Yellow Fever Card', 'Passport valid 6+ months', 'Invitation letter or hotel voucher'] },
    },
    UK: {
      Uganda: { type: 'eVisa', stay: '90 Days', fee: '$50 USD', processing: '24-48 Hours', requirements: ['Yellow Fever Vaccination Card', 'Passport valid 6+ months', 'Return ticket'] },
      'East Africa Tourist Visa (EATV)': { type: 'Joint Permit (UG, KE, RW)', stay: '90 Days', fee: '$100 USD', processing: '2-3 Days', requirements: ['Yellow Fever Certificate', 'Passport valid 6+ months', 'Multi-country itinerary'] },
      Kenya: { type: 'eTA (etakenya.go.ke)', stay: '90 Days', fee: '$34 USD', processing: '24-72 Hours', requirements: ['Passport valid 6+ months', 'Return ticket'] },
      Tanzania: { type: 'eVisa', stay: '90 Days', fee: '$50 USD', processing: '2-3 Business Days', requirements: ['Passport valid 6+ months', 'Proof of accommodation'] },
      Rwanda: { type: 'Visa on Arrival / eVisa', stay: '30 Days', fee: '$50 USD', processing: 'Instant at Kigali Airport', requirements: ['Passport valid 6+ months', 'Yellow Fever Certificate'] },
    },
    EU: {
      Uganda: { type: 'eVisa', stay: '90 Days', fee: '$50 USD', processing: '24-48 Hours', requirements: ['Yellow Fever Vaccination Card', 'Passport valid 6+ months'] },
      'East Africa Tourist Visa (EATV)': { type: 'Joint Permit (UG, KE, RW)', stay: '90 Days', fee: '$100 USD', processing: '2-3 Days', requirements: ['Yellow Fever Certificate', 'Passport valid 6+ months'] },
      Kenya: { type: 'eTA Authorization', stay: '90 Days', fee: '$34 USD', processing: '24-72 Hours', requirements: ['Passport valid 6+ months'] },
      Tanzania: { type: 'eVisa', stay: '90 Days', fee: '$50 USD', processing: '2-3 Days', requirements: ['Passport valid 6+ months'] },
      Rwanda: { type: 'Visa-Free / VOA', stay: '30 Days', fee: '$50 USD', processing: 'At Kigali Airport', requirements: ['Passport valid 6+ months'] },
    },
  };

  const getVisaInfo = () => {
    const rulesForPassport = VISA_RULES[passportCountry] || VISA_RULES['US'];
    return rulesForPassport[destinationCountry] || {
      type: 'eVisa / Embassy Visa Required',
      stay: '30 - 90 Days',
      fee: '$50 - $120 USD',
      processing: '5 - 10 Business Days',
      requirements: ['Passport valid 6+ months', 'Flight itinerary', 'Hotel reservation', 'Bank statement'],
    };
  };

  const currentVisa = getVisaInfo();

  return (
    <section id="corporate-visa-hub" className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      {/* Visa Requirement Checker Module */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D3B2B] bg-emerald-100/80 px-3 py-1 rounded-full mb-2">
              <Globe className="w-3.5 h-3.5 text-[#E88B23]" /> Global Border Intelligence
            </div>
            <h2 className="text-3xl font-bold text-gray-900 font-serif">
              International Visa & Border Requirement Portal
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm mt-1">
              Real-time visa rules, entry permits, and document checklists verified by Aiden immigration advisors.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-900 p-3 rounded-2xl border border-emerald-100">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold">Aiden Fast-Track Service</div>
              <div className="text-[11px] text-gray-600">Our visa concierge handles document submission for you</div>
            </div>
          </div>
        </div>

        {/* Passport & Destination Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mb-8">
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <label className="text-xs font-bold text-gray-700 block mb-1">Your Passport Country</label>
            <select
              value={passportCountry}
              onChange={(e) => setPassportCountry(e.target.value)}
              className="w-full bg-white p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden"
            >
              <option value="US">🇺🇸 United States</option>
              <option value="UK">🇬🇧 United Kingdom</option>
              <option value="EU">🇪🇺 European Union</option>
            </select>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <label className="text-xs font-bold text-gray-700 block mb-1">East Africa Destination</label>
            <select
              value={destinationCountry}
              onChange={(e) => setDestinationCountry(e.target.value)}
              className="w-full bg-white p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden"
            >
              <option value="Uganda">🇺🇬 Uganda (Pearl of Africa)</option>
              <option value="East Africa Tourist Visa (EATV)">🌍 East Africa Joint Visa (UG, KE, RW)</option>
              <option value="Kenya">🇰🇪 Kenya</option>
              <option value="Tanzania">🇹🇿 Tanzania & Zanzibar</option>
              <option value="Rwanda">🇷🇼 Rwanda</option>
              <option value="Burundi">🇧🇮 Burundi</option>
              <option value="South Sudan">🇸🇸 South Sudan</option>
            </select>
          </div>
        </div>

        {/* Visa Result Card */}
        <div className="bg-gradient-to-br from-emerald-50 via-white to-amber-50/50 rounded-2xl border border-emerald-200/80 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-100 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-[#0D3B2B] text-white flex items-center justify-center font-bold text-sm shrink-0">
                <FileCheck className="w-5 h-5 text-[#E88B23]" />
              </span>
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase">Requirement Summary</span>
                <h3 className="text-xl font-extrabold text-gray-900">{currentVisa.type}</h3>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold text-gray-700">
              <span className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-[#E88B23]" /> Processing: {currentVisa.processing}
              </span>
              <span className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-2xs">
                Fee: {currentVisa.fee}
              </span>
            </div>
          </div>

          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Mandatory Document Checklist:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs mb-6">
            {currentVisa.requirements.map((req, i) => (
              <div key={i} className="bg-white p-3 rounded-xl border border-emerald-100/80 flex items-start gap-2 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-gray-800 font-medium">{req}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-emerald-100 text-xs">
            <span className="text-gray-600 font-medium flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-[#E88B23]" />
              Aiden Travel Solutions offers end-to-end visa application assistance.
            </span>
            <a
              href="tel:+256784467000"
              className="bg-[#0D3B2B] hover:bg-[#08291e] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-xs transition-all text-xs"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#E88B23]" /> Call: 0784467000 / 0752023628
            </a>
          </div>
        </div>
      </div>

      {/* Corporate Travel Solutions Management Portal */}
      <div className="bg-[#0D3B2B] text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#E88B23] text-white text-xs font-bold px-3 py-1 rounded-full">
              <Briefcase className="w-3.5 h-3.5" /> Aiden Corporate Solutions
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif leading-tight">
              Enterprise & Business Travel Management
            </h2>
            <p className="text-emerald-100/90 text-sm leading-relaxed">
              Streamline corporate travel policies, executive flight bookings, team offsite logistics, and consolidated billing with a dedicated account manager and 24/7 priority support.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-emerald-100 pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E88B23]" /> Flexible Cancellation Policies
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E88B23]" /> Automated Expense Reports
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E88B23]" /> Corporate Airline & Hotel Discounts
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E88B23]" /> Duty of Care & Traveler Tracking
              </div>
            </div>
          </div>

          {/* Corporate Inquiry Form */}
          <div className="lg:col-span-5 bg-white text-gray-900 p-6 rounded-2xl shadow-xl">
            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2 border-b pb-2">
              <Building2 className="w-4 h-4 text-[#0D3B2B]" /> Open a Corporate Account
            </h3>

            {corporateSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-xl text-xs text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold">Inquiry Received!</h4>
                <p>An Aiden Corporate Account Executive will reach out within 2 business hours.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setCorporateSubmitted(true);
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Acme Global Inc."
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="exec@company.com"
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Estimated Annual Travel Budget</label>
                  <select className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg font-medium">
                    <option>$25,000 - $100,000 / year</option>
                    <option>$100,000 - $500,000 / year</option>
                    <option>$500,000+ / year</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0D3B2B] hover:bg-[#08291e] text-white p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md mt-2"
                >
                  Request Executive Consultation <ArrowRight className="w-3.5 h-3.5 text-[#E88B23]" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
