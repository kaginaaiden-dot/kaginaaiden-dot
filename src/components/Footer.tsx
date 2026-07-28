import React from 'react';
import { Logo } from './Logo';
import { ShieldCheck, Phone, Mail, MapPin, Globe, Award, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="main-footer" className="bg-[#07241A] text-white pt-16 pb-8 border-t border-emerald-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-emerald-800/60">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="lg" variant="light" />
            <p className="text-emerald-100/80 text-xs leading-relaxed max-w-sm">
              Aiden Travel Solutions is a premier global travel management agency delivering AI-enhanced luxury itineraries, corporate mobility, bespoke safari escapes, and 24/7 VIP concierge services.
            </p>

            <div className="space-y-1.5 text-xs text-emerald-200 pt-2">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E88B23]" /> 24/7 Hotline: +1 (800) 555-AIDEN
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#E88B23]" /> Contact: concierge@aidentravel.com
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> IATA Verified License #962810
              </div>
            </div>
          </div>

          {/* Global Branches */}
          <div>
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-4">Global Hubs</h4>
            <ul className="space-y-2 text-xs text-emerald-100/90">
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-[#E88B23]" /> London: Mayfair Square</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-[#E88B23]" /> New York: 5th Avenue</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-[#E88B23]" /> Dubai: DIFC Gate Precinct</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-[#E88B23]" /> Tokyo: Ginza Tower</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-[#E88B23]" /> Nairobi: Upper Hill Hub</li>
            </ul>
          </div>

          {/* Quick Solutions */}
          <div>
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-4">Travel Solutions</h4>
            <ul className="space-y-2 text-xs text-emerald-100/90">
              <li>• AI Itinerary Architect</li>
              <li>• Serengeti & Zanzibar Safaris</li>
              <li>• Kyoto Ryokan & Tea Journeys</li>
              <li>• Amalfi Yacht Charters</li>
              <li>• Corporate Mobility & Visas</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-4">Aiden Dispatch</h4>
            <p className="text-[11px] text-emerald-200/80 mb-3">
              Receive secret travel deals, seasonal festival calendars, and VIP perks.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder="Enter work email..."
                className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl px-3 py-2 text-xs text-white placeholder-emerald-400/60 focus:outline-hidden focus:border-[#E88B23]"
              />
              <button
                type="submit"
                className="w-full bg-[#E88B23] hover:bg-[#d47b19] text-white py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
              >
                Subscribe <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-emerald-300/70 gap-4">
          <p>© {new Date().getFullYear()} Aiden Travel Solutions Ltd. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            <span className="hover:underline cursor-pointer">Security & Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
