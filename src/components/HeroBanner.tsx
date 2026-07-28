import React, { useState } from 'react';
import { Sparkles, MapPin, Calendar, Users, Search, ArrowRight, Plane, Hotel, Compass, Award, ShieldCheck, HeartHandshake } from 'lucide-react';
import { NavigationTab } from '../types';

interface HeroBannerProps {
  setActiveTab: (tab: NavigationTab) => void;
  onQuickSearch: (query: { destination: string; category: string }) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ setActiveTab, onQuickSearch }) => {
  const [searchTab, setSearchTab] = useState<'packages' | 'flights' | 'hotels' | 'ai'>('packages');
  const [destination, setDestination] = useState('');
  const [category, setCategory] = useState('All');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTab === 'ai') {
      setActiveTab('planner');
    } else if (searchTab === 'flights' || searchTab === 'hotels') {
      setActiveTab('search');
    } else {
      onQuickSearch({ destination, category });
      setActiveTab('packages');
    }
  };

  return (
    <div id="hero-banner" className="relative bg-[#07241A] text-white overflow-hidden">
      {/* Background Hero Image with Emerald Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80"
          alt="Aiden Travel Solutions Luxury Destination"
          className="w-full h-full object-cover object-center opacity-30 scale-105 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07241A] via-[#07241A]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07241A]/90 via-[#07241A]/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-12 pb-20">
        {/* Top Tagline */}
        <div className="inline-flex items-center gap-2 bg-[#E88B23]/20 border border-[#E88B23]/40 px-3.5 py-1.5 rounded-full text-amber-300 text-xs font-semibold mb-6 backdrop-blur-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#E88B23]" />
          <span>Bespoke Journeys Crafted by Aiden Travel Experts</span>
        </div>

        {/* Main Headline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7 space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight font-serif">
              Discover The Pearl & Heart of <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-amber-200 to-[#E88B23]">East Africa</span>
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base max-w-xl leading-relaxed">
              Your premier East Africa travel specialist based in Uganda. From gorilla habituation in Bwindi to Serengeti migration safaris, 4x4 Land Cruiser rentals, and East Africa Tourist Visa services.
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-wrap gap-6 items-center lg:justify-end text-xs text-emerald-200 border-t lg:border-t-0 lg:border-l border-emerald-800/60 pt-4 lg:pt-0 lg:pl-6">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#E88B23]" />
              <div>
                <div className="font-bold text-white text-sm">100% East Africa</div>
                <div className="text-[11px] text-emerald-300/80">Regional Specialists</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="font-bold text-white text-sm">UG / KE / TZ / RW</div>
                <div className="text-[11px] text-emerald-300/80">Cross-Border Permits</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-amber-300" />
              <div>
                <div className="font-bold text-white text-sm">24/7 Hotline</div>
                <div className="text-[11px] text-emerald-300/80">Kampala & Entebbe</div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Search Card Module */}
        <div className="mt-10 bg-white rounded-2xl p-4 sm:p-6 text-gray-900 shadow-2xl border border-emerald-100 max-w-5xl">
          {/* Search Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-4 mb-4">
            <button
              onClick={() => setSearchTab('packages')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                searchTab === 'packages'
                  ? 'bg-[#0D3B2B] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Compass className="w-4 h-4" />
              Curated Packages
            </button>

            <button
              onClick={() => setSearchTab('flights')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                searchTab === 'flights'
                  ? 'bg-[#0D3B2B] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Plane className="w-4 h-4" />
              Search Flights
            </button>

            <button
              onClick={() => setSearchTab('hotels')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                searchTab === 'hotels'
                  ? 'bg-[#0D3B2B] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Hotel className="w-4 h-4" />
              Search Hotels
            </button>

            <button
              onClick={() => setSearchTab('ai')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                searchTab === 'ai'
                  ? 'bg-gradient-to-r from-[#0D3B2B] to-[#E88B23] text-white shadow-xs'
                  : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              AI Custom Designer
            </button>
          </div>

          {/* Search Input Bar Form */}
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            {/* Destination Input */}
            <div className="lg:col-span-5 bg-gray-50 p-3 rounded-xl border border-gray-200 hover:border-emerald-500 transition-colors">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#0D3B2B]" /> East Africa Destination
              </label>
              <input
                type="text"
                placeholder="e.g. Bwindi, Serengeti, Masai Mara, Zanzibar..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-gray-900 focus:outline-hidden placeholder-gray-400"
              />
            </div>

            {/* Travel Category */}
            <div className="lg:col-span-4 bg-gray-50 p-3 rounded-xl border border-gray-200 hover:border-emerald-500 transition-colors">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Compass className="w-3 h-3 text-[#E88B23]" /> Safari Style
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-gray-900 focus:outline-hidden cursor-pointer"
              >
                <option value="All">All Categories & Styles</option>
                <option value="Gorilla">Gorilla & Primate Trekking</option>
                <option value="Savanna">Savanna Game Drives (Big 5)</option>
                <option value="Kilimanjaro">Mount Kilimanjaro Climbs</option>
                <option value="Beach">Zanzibar & Coast Escapes</option>
                <option value="Cultural">Cultural & Nile River</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="lg:col-span-3">
              <button
                type="submit"
                className="w-full bg-[#0D3B2B] hover:bg-[#09291d] text-white p-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.01]"
              >
                <Search className="w-4 h-4 text-[#E88B23]" />
                {searchTab === 'ai' ? 'Launch AI Designer' : 'Search Solutions'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Filter Badges */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
            <span className="font-semibold text-gray-700">East Africa Trending:</span>
            {['Bwindi Gorillas', 'Serengeti Migration', 'Masai Mara Safari', 'Kilimanjaro Climb', 'Zanzibar Beach'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setDestination(tag.split(' ')[0]);
                  onQuickSearch({ destination: tag.split(' ')[0], category: 'All' });
                  setActiveTab('packages');
                }}
                className="bg-emerald-50 text-emerald-900 hover:bg-emerald-100 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
