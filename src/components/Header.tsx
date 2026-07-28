import React from 'react';
import { Logo } from './Logo';
import { NavigationTab } from '../types';
import { Sparkles, Phone, Compass, Plane, Hotel, Globe, Briefcase, BookmarkCheck, ChevronDown, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  savedCount: number;
  currency: string;
  setCurrency: (c: string) => void;
  onOpenConcierge: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  currency,
  setCurrency,
  onOpenConcierge,
}) => {
  return (
    <header id="main-header" className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-emerald-900/10 shadow-xs">
      {/* Top Banner Utility Bar */}
      <div className="bg-[#0D3B2B] text-emerald-100 text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-emerald-200">
              <Phone className="w-3.5 h-3.5 text-[#E88B23]" />
              24/7 VIP Concierge: <a href="tel:18005552433" className="hover:underline text-white font-bold">+1 (800) 555-AIDEN</a>
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-emerald-300/80">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              IATA Accredited Agency #962810
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {/* Currency Selector */}
            <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
              <Globe className="w-3.5 h-3.5 text-emerald-300" />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent border-none text-emerald-100 font-medium focus:ring-0 text-xs cursor-pointer"
              >
                <option value="USD" className="text-gray-900">USD ($)</option>
                <option value="EUR" className="text-gray-900">EUR (€)</option>
                <option value="GBP" className="text-gray-900">GBP (£)</option>
                <option value="AED" className="text-gray-900">AED (د.إ)</option>
                <option value="JPY" className="text-gray-900">JPY (¥)</option>
              </select>
            </div>

            <button
              onClick={onOpenConcierge}
              className="flex items-center gap-1.5 bg-[#E88B23] hover:bg-[#d47b19] text-white px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all shadow-xs"
            >
              <Sparkles className="w-3 h-3 text-amber-100" />
              Ask AI Concierge
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button onClick={() => setActiveTab('home')} className="text-left focus:outline-hidden">
          <Logo size="md" />
        </button>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-emerald-50/60 p-1.5 rounded-full border border-emerald-100">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'home'
                ? 'bg-[#0D3B2B] text-white shadow-sm'
                : 'text-emerald-900 hover:bg-emerald-100/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            Explore
          </button>

          <button
            onClick={() => setActiveTab('planner')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'planner'
                ? 'bg-[#0D3B2B] text-white shadow-sm'
                : 'text-emerald-900 hover:bg-emerald-100/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#E88B23]" />
            AI Itinerary
            <span className="bg-[#E88B23] text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">PRO</span>
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'search'
                ? 'bg-[#0D3B2B] text-white shadow-sm'
                : 'text-emerald-900 hover:bg-emerald-100/60'
            }`}
          >
            <Plane className="w-4 h-4" />
            Flights & Hotels
          </button>

          <button
            onClick={() => setActiveTab('packages')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'packages'
                ? 'bg-[#0D3B2B] text-white shadow-sm'
                : 'text-emerald-900 hover:bg-emerald-100/60'
            }`}
          >
            Curated Packages
          </button>

          <button
            onClick={() => setActiveTab('corporate')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'corporate'
                ? 'bg-[#0D3B2B] text-white shadow-sm'
                : 'text-emerald-900 hover:bg-emerald-100/60'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Corporate & Visas
          </button>

          <button
            onClick={() => setActiveTab('my-bookings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'my-bookings'
                ? 'bg-[#0D3B2B] text-white shadow-sm'
                : 'text-emerald-900 hover:bg-emerald-100/60'
            }`}
          >
            <BookmarkCheck className="w-4 h-4 text-emerald-600" />
            My Bookings
            {savedCount > 0 && (
              <span className="bg-[#E88B23] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {savedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('planner')}
            className="hidden sm:flex items-center gap-2 bg-[#0D3B2B] hover:bg-[#08291e] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-[#E88B23]" />
            Plan My Trip
          </button>

          {/* Mobile Tab Select Dropdown */}
          <div className="lg:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as NavigationTab)}
              className="bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-xs rounded-lg px-3 py-2"
            >
              <option value="home">Explore</option>
              <option value="planner">✨ AI Trip Planner</option>
              <option value="search">Flights & Hotels</option>
              <option value="packages">Curated Packages</option>
              <option value="corporate">Corporate & Visas</option>
              <option value="my-bookings">My Bookings ({savedCount})</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
