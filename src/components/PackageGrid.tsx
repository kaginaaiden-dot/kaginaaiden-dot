import React, { useState } from 'react';
import { TravelPackage } from '../types';
import { Star, Clock, MapPin, CheckCircle2, ArrowRight, ShieldCheck, Filter, Search } from 'lucide-react';

interface PackageGridProps {
  packages: TravelPackage[];
  currency: string;
  onSelectPackage: (pkg: TravelPackage) => void;
  selectedRegion: string;
  setSelectedRegion: (r: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
}

export const PackageGrid: React.FC<PackageGridProps> = ({
  packages,
  currency,
  onSelectPackage,
  selectedRegion,
  setSelectedRegion,
  selectedCategory,
  setSelectedCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const regions = ['All', 'Uganda', 'Kenya', 'Tanzania', 'Rwanda', 'Burundi', 'South Sudan'];
  const categories = ['All', 'Gorilla & Primate Trekking', 'Savanna Game Drives', 'Kilimanjaro Expeditions', 'Zanzibar & Coast Escapes', 'Cultural & Nile Adventures'];

  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    AED: 'AED ',
    JPY: '¥',
  };

  const currencyRates: Record<string, number> = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.78,
    AED: 3.67,
    JPY: 155,
  };

  const formatPrice = (usdAmount: number) => {
    const symbol = currencySymbols[currency] || '$';
    const rate = currencyRates[currency] || 1;
    const converted = Math.round(usdAmount * rate);
    return `${symbol}${converted.toLocaleString()}`;
  };

  const filteredPackages = packages.filter((pkg) => {
    const matchesRegion = selectedRegion === 'All' || pkg.region.toLowerCase() === selectedRegion.toLowerCase();
    const matchesCategory = selectedCategory === 'All' || pkg.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      !searchQuery ||
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesCategory && matchesSearch;
  });

  return (
    <section id="curated-packages" className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-gray-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#0D3B2B] bg-emerald-100/80 px-3 py-1 rounded-full mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E88B23]" />
            Aiden Handcrafted Collection
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-serif">
            Curated East Africa Expeditions
          </h2>
          <p className="text-gray-600 text-sm mt-1 max-w-xl">
            Bespoke gorilla trekking, Serengeti migration safaris, Kilimanjaro climbs, and Zanzibar beach escapes managed by local East Africa travel experts.
          </p>
        </div>

        {/* Search inside packages */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search packages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-hidden focus:border-[#0D3B2B]"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="space-y-4 mb-8">
        {/* Region Filter */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Region:
          </span>
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedRegion === region
                  ? 'bg-[#0D3B2B] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] mr-2">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#E88B23] text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Package Cards Grid */}
      {filteredPackages.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-sm font-medium">No packages match your selected filter criteria.</p>
          <button
            onClick={() => {
              setSelectedRegion('All');
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-3 text-xs font-bold text-[#0D3B2B] hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image & Badge */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Tag Badge */}
                  <span className="absolute top-3 left-3 bg-[#0D3B2B] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
                    {pkg.tag}
                  </span>

                  {/* Rating */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-gray-900 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-xs">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{pkg.rating}</span>
                    <span className="text-gray-400 text-[10px]">({pkg.reviewsCount})</span>
                  </div>

                  {/* Destination & Duration overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="flex items-center gap-1 font-medium bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      <MapPin className="w-3.5 h-3.5 text-[#E88B23]" />
                      {pkg.destination}
                    </span>
                    <span className="flex items-center gap-1 font-medium bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      <Clock className="w-3.5 h-3.5 text-amber-300" />
                      {pkg.durationDays} Days
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#0D3B2B] transition-colors line-clamp-2">
                    {pkg.title}
                  </h3>

                  {/* Highlights list */}
                  <ul className="mt-3 space-y-1.5 text-xs text-gray-600">
                    {pkg.highlights.slice(0, 3).map((hl, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer Price & Button */}
              <div className="px-5 pb-5 pt-3 border-t border-gray-100 flex items-center justify-between gap-3 bg-gray-50/50">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-semibold block">Price Per Person</span>
                  <div className="text-xl font-black text-[#0D3B2B]">
                    {formatPrice(pkg.pricePerPerson)}
                  </div>
                </div>

                <button
                  onClick={() => onSelectPackage(pkg)}
                  className="bg-[#0D3B2B] hover:bg-[#08291e] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs hover:shadow-md"
                >
                  View Details
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
