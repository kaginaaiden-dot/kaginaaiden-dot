import React, { useState } from 'react';
import { AiItinerary, BookingRecord } from '../types';
import { Sparkles, Calendar, DollarSign, MapPin, Users, Utensils, Compass, SunMedium, FileText, CheckCircle2, BookmarkPlus, ArrowRight, Loader2, Info, Gift, Luggage } from 'lucide-react';

interface AiTripPlannerProps {
  onSaveBooking: (booking: BookingRecord) => void;
  onOpenConciergeWithPrompt: (prompt: string) => void;
}

export const AiTripPlanner: React.FC<AiTripPlannerProps> = ({
  onSaveBooking,
  onOpenConciergeWithPrompt,
}) => {
  const [destination, setDestination] = useState('Kyoto, Japan');
  const [durationDays, setDurationDays] = useState(7);
  const [budgetLevel, setBudgetLevel] = useState('Luxury');
  const [travelStyle, setTravelStyle] = useState('Culture & Gastronomy');
  const [guests, setGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('Interested in traditional tea ceremony and private ryokan onsen.');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<AiItinerary | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleGenerateItinerary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;

    setLoading(true);
    setError(null);
    setItinerary(null);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/plan-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          durationDays,
          budgetLevel,
          travelStyle,
          guests,
          interests: [travelStyle, 'Local Gastronomy', 'Must-see Highlights'],
          specialRequests,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate itinerary');
      }

      setItinerary(data.itinerary);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error creating custom AI itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToBookings = () => {
    if (!itinerary) return;

    const newBooking: BookingRecord = {
      id: `ai-trip-${Date.now()}`,
      bookingRef: `AT-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'custom_ai_trip',
      title: itinerary.tripTitle,
      destination: itinerary.destination,
      dates: `${itinerary.durationDays} Days (Flexible Dates)`,
      passengersCount: guests,
      totalPriceUSD: itinerary.estimatedTotalCostUSD,
      status: 'Confirmed',
      createdAt: new Date().toLocaleDateString(),
      leadPassengerName: 'Valued Client',
      leadPassengerEmail: 'client@aidentravel.com',
      detailsJson: itinerary,
    };

    onSaveBooking(newBooking);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <section id="ai-trip-planner" className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0D3B2B] via-[#092B1F] to-[#124D38] rounded-3xl p-6 sm:p-10 text-white mb-10 shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#E88B23]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#E88B23] text-white text-xs font-bold px-3 py-1 rounded-full mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            AI Precision Itinerary Engine
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-serif tracking-tight leading-tight">
            Design Your Custom Itinerary in Seconds
          </h2>
          <p className="text-emerald-100/90 text-sm sm:text-base mt-2">
            Powered by Gemini 3.6 Flash. Input your desired destination and style, and our AI travel architect will build a day-by-day luxury route with local dining, hidden gems, and costs.
          </p>
        </div>
      </div>

      {/* Grid: Left Form, Right Generated View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-24">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-3">
            <Compass className="w-5 h-5 text-[#0D3B2B]" />
            Trip Preferences
          </h3>

          <form onSubmit={handleGenerateItinerary} className="space-y-4 text-xs">
            {/* Destination */}
            <div>
              <label className="font-bold text-gray-700 block mb-1">Destination City or Country</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Kyoto, Iceland, Serengeti, Paris"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl font-semibold text-gray-900 focus:outline-hidden focus:border-[#0D3B2B]"
                />
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="font-bold text-gray-700 block mb-1">Duration ({durationDays} Days)</label>
              <input
                type="range"
                min={3}
                max={14}
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full accent-[#0D3B2B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-semibold">
                <span>3 Days</span>
                <span>7 Days</span>
                <span>10 Days</span>
                <span>14 Days</span>
              </div>
            </div>

            {/* Budget Level */}
            <div>
              <label className="font-bold text-gray-700 block mb-1">Budget Comfort Level</label>
              <select
                value={budgetLevel}
                onChange={(e) => setBudgetLevel(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-semibold text-gray-900 focus:outline-hidden focus:border-[#0D3B2B]"
              >
                <option value="Ultra Luxury (5-Star & Private Charters)">Ultra Luxury (5-Star & Private Charters)</option>
                <option value="Luxury (Boutique & Premium)">Luxury (Boutique & Premium)</option>
                <option value="Balanced Comfort (4-Star Stays)">Balanced Comfort (4-Star Stays)</option>
                <option value="Explorer Smart Budget">Explorer Smart Budget</option>
              </select>
            </div>

            {/* Travel Style */}
            <div>
              <label className="font-bold text-gray-700 block mb-1">Primary Travel Style</label>
              <select
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-semibold text-gray-900 focus:outline-hidden focus:border-[#0D3B2B]"
              >
                <option value="Culture & Gastronomy">Culture & Gastronomy</option>
                <option value="Wildlife Safari & Nature">Wildlife Safari & Nature</option>
                <option value="Romantic & Honeymoon">Romantic & Honeymoon</option>
                <option value="Family Friendly Adventure">Family Friendly Adventure</option>
                <option value="Wellness & Spa Sanctuary">Wellness & Spa Sanctuary</option>
                <option value="Alpine Ski & Hiking">Alpine Ski & Hiking</option>
              </select>
            </div>

            {/* Guests */}
            <div>
              <label className="font-bold text-gray-700 block mb-1">Number of Travelers ({guests})</label>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full p-2 bg-gray-50 border border-gray-300 rounded-xl font-semibold text-gray-900 text-center"
                />
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="font-bold text-gray-700 block mb-1">Special Preferences / Requests</label>
              <textarea
                rows={3}
                placeholder="e.g. Include private tea ceremony, gluten free dining, hot air balloon..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-medium text-gray-900 focus:outline-hidden focus:border-[#0D3B2B]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0D3B2B] hover:bg-[#08291e] text-white p-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#E88B23]" />
                  Designing Itinerary with Gemini...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#E88B23]" />
                  Generate Bespoke Itinerary
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl text-xs font-medium mb-6">
              {error}
            </div>
          )}

          {!itinerary && !loading && (
            <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center text-gray-500">
              <Sparkles className="w-12 h-12 text-[#E88B23] mx-auto mb-3 opacity-80" />
              <h3 className="text-xl font-bold text-gray-900 font-serif">Your Custom Travel Route Awaits</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto mt-2">
                Select your preferred destination and style on the left to generate an AI-tailored day-by-day luxury travel plan.
              </p>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-gray-600 shadow-xs">
              <Loader2 className="w-12 h-12 text-[#0D3B2B] animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 font-serif">Crafting Your Dream Journey...</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto mt-2">
                Searching optimal routes, selecting Michelin-worthy dining recommendations, and calculating budget breakdowns for {destination}.
              </p>
            </div>
          )}

          {itinerary && !loading && (
            <div className="space-y-6">
              {/* Itinerary Header Card */}
              <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-6">
                  <div>
                    <span className="text-xs font-bold text-[#E88B23] uppercase tracking-widest block mb-1">
                      {itinerary.durationDays} Days • {itinerary.destination}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-gray-900 font-serif">
                      {itinerary.tripTitle}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm mt-1 italic">
                      "{itinerary.tagline}"
                    </p>
                  </div>

                  <div className="text-right bg-emerald-50 border border-emerald-100 p-3 rounded-2xl">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">Estimated Total Cost</span>
                    <span className="text-2xl font-black text-[#0D3B2B]">
                      ${itinerary.estimatedTotalCostUSD.toLocaleString()} USD
                    </span>
                    <span className="text-[10px] text-gray-500 block">for {guests} travelers</span>
                  </div>
                </div>

                {/* Quick Info Chips */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 text-xs">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="font-bold text-gray-900 flex items-center gap-1.5 mb-1">
                      <SunMedium className="w-3.5 h-3.5 text-[#E88B23]" /> Best Season
                    </span>
                    <p className="text-gray-600 text-[11px]">{itinerary.recommendedBestTime}</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="font-bold text-gray-900 flex items-center gap-1.5 mb-1">
                      <Info className="w-3.5 h-3.5 text-blue-600" /> Visa Brief
                    </span>
                    <p className="text-gray-600 text-[11px]">{itinerary.visaAndEntryTip}</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="font-bold text-gray-900 flex items-center gap-1.5 mb-1">
                      <Gift className="w-3.5 h-3.5 text-emerald-600" /> Aiden Perks
                    </span>
                    <p className="text-gray-600 text-[11px] line-clamp-2">
                      {itinerary.aidenExclusivePerks.join(', ')}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveToBookings}
                      className="bg-[#0D3B2B] hover:bg-[#08291e] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
                    >
                      <BookmarkPlus className="w-4 h-4 text-[#E88B23]" />
                      Save Itinerary & Book
                    </button>

                    <button
                      onClick={() => onOpenConciergeWithPrompt(`Can you help me customize Day 2 of my ${itinerary.tripTitle} trip?`)}
                      className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-[#E88B23]" />
                      Ask AI Concierge
                    </button>
                  </div>

                  {savedSuccess && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1 animate-fade-in">
                      <CheckCircle2 className="w-4 h-4" /> Saved to My Bookings!
                    </span>
                  )}
                </div>
              </div>

              {/* Day-by-Day Timeline */}
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-gray-900 font-serif flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#0D3B2B]" /> Day-by-Day Schedule
                </h4>

                {itinerary.dayByDayItinerary.map((day) => (
                  <div
                    key={day.day}
                    className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs hover:border-[#0D3B2B] transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-8 h-8 rounded-full bg-[#0D3B2B] text-white font-black text-xs flex items-center justify-center shrink-0">
                        {day.day}
                      </span>
                      <h5 className="text-base font-bold text-gray-900">
                        Day {day.day}: {day.title}
                      </h5>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mt-3 bg-gray-50 p-4 rounded-xl">
                      <div>
                        <span className="font-bold text-[#0D3B2B] uppercase tracking-wider text-[10px] block mb-1">
                          🌅 Morning
                        </span>
                        <p className="text-gray-700 leading-relaxed">{day.morning}</p>
                      </div>

                      <div>
                        <span className="font-bold text-[#E88B23] uppercase tracking-wider text-[10px] block mb-1">
                          ☀️ Afternoon
                        </span>
                        <p className="text-gray-700 leading-relaxed">{day.afternoon}</p>
                      </div>

                      <div>
                        <span className="font-bold text-indigo-900 uppercase tracking-wider text-[10px] block mb-1">
                          🌙 Evening & Night
                        </span>
                        <p className="text-gray-700 leading-relaxed">{day.evening}</p>
                      </div>
                    </div>

                    {/* Dining & Insider Tip */}
                    <div className="mt-3 flex flex-wrap gap-4 text-xs pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 text-gray-800 font-medium">
                        <Utensils className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Dining: <strong className="text-gray-900">{day.diningRecommendation}</strong></span>
                      </div>

                      <div className="flex items-center gap-1.5 text-emerald-900 font-medium bg-emerald-50 px-2.5 py-1 rounded-md">
                        <Sparkles className="w-3.5 h-3.5 text-[#E88B23] shrink-0" />
                        <span>Insider Tip: {day.insiderTip}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Packing Essentials */}
              {itinerary.packingEssentials && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Luggage className="w-4 h-4 text-[#0D3B2B]" /> Recommended Packing List
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {itinerary.packingEssentials.map((item, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded-lg">
                        • {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
