import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { PackageGrid } from './components/PackageGrid';
import { AiTripPlanner } from './components/AiTripPlanner';
import { FlightHotelSearch } from './components/FlightHotelSearch';
import { CorporateAndVisaHub } from './components/CorporateAndVisaHub';
import { MyBookingsView } from './components/MyBookingsView';
import { BookingModal } from './components/BookingModal';
import { AiConciergeDrawer } from './components/AiConciergeDrawer';
import { Footer } from './components/Footer';
import { NavigationTab, TravelPackage, Flight, Hotel, BookingRecord } from './types';
import { Sparkles, Compass, ShieldCheck, Award, Heart, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [currency, setCurrency] = useState('USD');
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Bookings State
  const [bookings, setBookings] = useState<BookingRecord[]>([
    {
      id: 'demo-1',
      bookingRef: 'AT-882910',
      type: 'package',
      title: 'Serengeti & Zanzibar Eco Luxury Safari',
      destination: 'Tanzania & Zanzibar',
      dates: '2026-10-10 (2 Persons)',
      passengersCount: 2,
      totalPriceUSD: 7700,
      status: 'Confirmed',
      createdAt: '2026-07-27',
      leadPassengerName: 'Aiden Client',
      leadPassengerEmail: 'kaginaaiden@gmail.com',
      addOns: ['VIP Airport Transfer', 'Comprehensive Travel Insurance'],
    },
  ]);

  // Modal & Drawer State
  const [bookingModalItem, setBookingModalItem] = useState<TravelPackage | Flight | Hotel | null>(null);
  const [bookingModalType, setBookingModalType] = useState<'package' | 'flight' | 'hotel' | null>(null);
  const [conciergeOpen, setConciergeOpen] = useState(false);
  const [conciergePrompt, setConciergePrompt] = useState<string | undefined>(undefined);

  // Fetch Packages on Mount
  useEffect(() => {
    fetch('/api/packages')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPackages(data.packages);
        }
      })
      .catch((err) => console.error('Failed to load packages:', err));
  }, []);

  const handleOpenBookingModal = (item: TravelPackage | Flight | Hotel, type: 'package' | 'flight' | 'hotel') => {
    setBookingModalItem(item);
    setBookingModalType(type);
  };

  const handleConfirmBooking = (newBooking: BookingRecord) => {
    setBookings([newBooking, ...bookings]);
  };

  const handleRemoveBooking = (id: string) => {
    setBookings(bookings.filter((b) => b.id !== id));
  };

  const handleOpenConciergeWithPrompt = (prompt: string) => {
    setConciergePrompt(prompt);
    setConciergeOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-[#0D3B2B] selection:text-white">
      {/* Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={bookings.length}
        currency={currency}
        setCurrency={setCurrency}
        onOpenConcierge={() => {
          setConciergePrompt(undefined);
          setConciergeOpen(true);
        }}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div className="space-y-12">
            <HeroBanner
              setActiveTab={setActiveTab}
              onQuickSearch={({ destination, category }) => {
                if (destination) {
                  setSelectedRegion('All');
                }
                if (category) {
                  setSelectedCategory(category);
                }
              }}
            />

            {/* Featured Curated Packages Grid */}
            <PackageGrid
              packages={packages}
              currency={currency}
              onSelectPackage={(pkg) => handleOpenBookingModal(pkg, 'package')}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />

            {/* Why Choose Aiden Section */}
            <section className="bg-white py-16 border-y border-emerald-900/10">
              <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-xs font-bold text-[#0D3B2B] bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                    The Aiden Distinction
                  </span>
                  <h3 className="text-3xl font-extrabold font-serif text-gray-900 mt-3">
                    Why Modern Travelers Trust Aiden Solutions
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
                  <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 space-y-2">
                    <Sparkles className="w-8 h-8 text-[#E88B23]" />
                    <h4 className="text-base font-bold text-gray-900 font-serif">AI-Engineered Routes</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Instant customized day-by-day itineraries tailored to your unique travel style, pace, and dining interests.
                    </p>
                  </div>

                  <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 space-y-2">
                    <ShieldCheck className="w-8 h-8 text-emerald-700" />
                    <h4 className="text-base font-bold text-gray-900 font-serif">24/7 Dedicated Care</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Our global concierge network provides real-time support, airport VIP fast-track, and flexible changes.
                    </p>
                  </div>

                  <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 space-y-2">
                    <Award className="w-8 h-8 text-[#E88B23]" />
                    <h4 className="text-base font-bold text-gray-900 font-serif">IATA Accredited</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Direct access to tier-1 airline inventory, five-star hotel upgrades, and official visa processing portals.
                    </p>
                  </div>

                  <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 space-y-2">
                    <Heart className="w-8 h-8 text-red-600" />
                    <h4 className="text-base font-bold text-gray-900 font-serif">Price Match Guarantee</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Transparent pricing with zero hidden surcharges and transparent booking terms on every reservation.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'planner' && (
          <AiTripPlanner
            onSaveBooking={(booking) => {
              handleConfirmBooking(booking);
              setActiveTab('my-bookings');
            }}
            onOpenConciergeWithPrompt={handleOpenConciergeWithPrompt}
          />
        )}

        {activeTab === 'search' && (
          <FlightHotelSearch
            currency={currency}
            onBookFlight={(flight) => handleOpenBookingModal(flight, 'flight')}
            onBookHotel={(hotel) => handleOpenBookingModal(hotel, 'hotel')}
          />
        )}

        {activeTab === 'packages' && (
          <PackageGrid
            packages={packages}
            currency={currency}
            onSelectPackage={(pkg) => handleOpenBookingModal(pkg, 'package')}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        )}

        {activeTab === 'corporate' && <CorporateAndVisaHub />}

        {activeTab === 'my-bookings' && (
          <MyBookingsView
            bookings={bookings}
            onRemoveBooking={handleRemoveBooking}
            currency={currency}
            onOpenConciergeWithPrompt={handleOpenConciergeWithPrompt}
          />
        )}
      </main>

      {/* Booking Modal */}
      <BookingModal
        item={bookingModalItem}
        itemType={bookingModalType}
        currency={currency}
        onClose={() => {
          setBookingModalItem(null);
          setBookingModalType(null);
        }}
        onConfirmBooking={(b) => {
          handleConfirmBooking(b);
          setActiveTab('my-bookings');
        }}
      />

      {/* 24/7 AI Concierge Drawer */}
      <AiConciergeDrawer
        isOpen={conciergeOpen}
        onClose={() => setConciergeOpen(false)}
        initialPrompt={conciergePrompt}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
