import React, { useState, useEffect } from 'react';
import { Flight, Hotel } from '../types';
import { Plane, Hotel as HotelIcon, Search, Calendar, Users, ArrowRight, Star, MapPin, Check, Wifi, Coffee, ShieldCheck, Filter } from 'lucide-react';

interface FlightHotelSearchProps {
  currency: string;
  onBookFlight: (flight: Flight) => void;
  onBookHotel: (hotel: Hotel) => void;
}

export const FlightHotelSearch: React.FC<FlightHotelSearchProps> = ({
  currency,
  onBookFlight,
  onBookHotel,
}) => {
  const [activeSearchMode, setActiveSearchMode] = useState<'flights' | 'hotels'>('flights');

  // Flight search states
  const [flightOrigin, setFlightOrigin] = useState('');
  const [flightDestination, setFlightDestination] = useState('');
  const [flightCabin, setFlightCabin] = useState('All');
  const [flightsList, setFlightsList] = useState<Flight[]>([]);
  const [flightsLoading, setFlightsLoading] = useState(false);

  // Hotel search states
  const [hotelCity, setHotelCity] = useState('');
  const [hotelMaxPrice, setHotelMaxPrice] = useState(1000);
  const [hotelsList, setHotelsList] = useState<Hotel[]>([]);
  const [hotelsLoading, setHotelsLoading] = useState(false);

  // Currency Formatter
  const currencySymbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', AED: 'AED ', JPY: '¥' };
  const currencyRates: Record<string, number> = { USD: 1, EUR: 0.92, GBP: 0.78, AED: 3.67, JPY: 155 };

  const formatPrice = (usdAmount: number) => {
    const symbol = currencySymbols[currency] || '$';
    const rate = currencyRates[currency] || 1;
    return `${symbol}${Math.round(usdAmount * rate).toLocaleString()}`;
  };

  // Fetch Flights
  const fetchFlights = async () => {
    setFlightsLoading(true);
    try {
      const params = new URLSearchParams();
      if (flightOrigin) params.append('origin', flightOrigin);
      if (flightDestination) params.append('destination', flightDestination);
      if (flightCabin && flightCabin !== 'All') params.append('cabinClass', flightCabin);

      const res = await fetch(`/api/search-flights?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setFlightsList(data.flights);
      }
    } catch (err) {
      console.error('Error fetching flights:', err);
    } finally {
      setFlightsLoading(false);
    }
  };

  // Fetch Hotels
  const fetchHotels = async () => {
    setHotelsLoading(true);
    try {
      const params = new URLSearchParams();
      if (hotelCity) params.append('city', hotelCity);
      params.append('maxPrice', String(hotelMaxPrice));

      const res = await fetch(`/api/search-hotels?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setHotelsList(data.hotels);
      }
    } catch (err) {
      console.error('Error fetching hotels:', err);
    } finally {
      setHotelsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
    fetchHotels();
  }, []);

  return (
    <section id="flight-hotel-search" className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      {/* Mode Toggle Switch */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className="bg-emerald-50 border border-emerald-200 p-1.5 rounded-2xl flex gap-2">
          <button
            onClick={() => setActiveSearchMode('flights')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all ${
              activeSearchMode === 'flights'
                ? 'bg-[#0D3B2B] text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            <Plane className="w-4 h-4 text-[#E88B23]" />
            Flights & Airlines
          </button>

          <button
            onClick={() => setActiveSearchMode('hotels')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all ${
              activeSearchMode === 'hotels'
                ? 'bg-[#0D3B2B] text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            <HotelIcon className="w-4 h-4 text-[#E88B23]" />
            Luxury Stays & Hotels
          </button>
        </div>
      </div>

      {/* Flight Search Section */}
      {activeSearchMode === 'flights' && (
        <div className="space-y-8">
          {/* Flight Search Form */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 font-serif mb-4 flex items-center gap-2">
              <Plane className="w-5 h-5 text-[#0D3B2B]" /> Global Flight Direct Search
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">From (Origin)</label>
                <input
                  type="text"
                  placeholder="e.g. EBB, NBO, KGL, London"
                  value={flightOrigin}
                  onChange={(e) => setFlightOrigin(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-semibold focus:outline-hidden focus:border-[#0D3B2B]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">To (Destination)</label>
                <input
                  type="text"
                  placeholder="e.g. NBO, JRO, EBB, Dubai"
                  value={flightDestination}
                  onChange={(e) => setFlightDestination(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-semibold focus:outline-hidden focus:border-[#0D3B2B]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Cabin Class</label>
                <select
                  value={flightCabin}
                  onChange={(e) => setFlightCabin(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-semibold focus:outline-hidden focus:border-[#0D3B2B]"
                >
                  <option value="All">All Cabin Classes</option>
                  <option value="Economy">Economy</option>
                  <option value="Premium Economy">Premium Economy</option>
                  <option value="Business Class">Business Class</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={fetchFlights}
                  className="w-full bg-[#0D3B2B] hover:bg-[#08291e] text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
                >
                  <Search className="w-4 h-4 text-[#E88B23]" /> Search Flights
                </button>
              </div>
            </div>
          </div>

          {/* Flights List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-600 px-2">
              <span className="font-bold text-gray-900">Available Flights ({flightsList.length})</span>
              <span>All fares include baggage & seat selection</span>
            </div>

            {flightsList.map((flight) => (
              <div
                key={flight.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs hover:border-[#0D3B2B] transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Airline & Flight Num */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center font-black text-[#0D3B2B] text-sm shrink-0">
                    {flight.airlineCode}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{flight.airline}</h4>
                    <span className="text-xs text-gray-500">{flight.flightNumber} • {flight.aircraft}</span>
                    <div className="inline-block ml-2 bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {flight.cabinClass}
                    </div>
                  </div>
                </div>

                {/* Times & Route */}
                <div className="flex items-center gap-6 text-center">
                  <div>
                    <div className="text-lg font-black text-gray-900">{flight.departureTime}</div>
                    <div className="text-xs font-semibold text-gray-500">{flight.origin} ({flight.originCity})</div>
                  </div>

                  <div className="flex flex-col items-center min-w-[100px]">
                    <span className="text-[10px] text-gray-400 font-bold">{flight.duration}</span>
                    <div className="w-full border-t-2 border-dashed border-emerald-700 my-1 relative">
                      <Plane className="w-3.5 h-3.5 text-[#0D3B2B] absolute -top-2 left-1/2 -translate-x-1/2 bg-white px-0.5" />
                    </div>
                    <span className="text-[10px] text-emerald-800 font-bold">
                      {flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop`}
                    </span>
                  </div>

                  <div>
                    <div className="text-lg font-black text-gray-900">{flight.arrivalTime}</div>
                    <div className="text-xs font-semibold text-gray-500">{flight.destination} ({flight.destinationCity})</div>
                  </div>
                </div>

                {/* Price & Book */}
                <div className="flex items-center md:flex-col justify-between md:items-end border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">One Way / Person</span>
                    <span className="text-2xl font-black text-[#0D3B2B]">{formatPrice(flight.price)}</span>
                  </div>

                  <button
                    onClick={() => onBookFlight(flight)}
                    className="mt-2 bg-[#0D3B2B] hover:bg-[#08291e] text-white px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    Select Flight <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hotel Search Section */}
      {activeSearchMode === 'hotels' && (
        <div className="space-y-8">
          {/* Hotel Filter Bar */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 font-serif mb-4 flex items-center gap-2">
              <HotelIcon className="w-5 h-5 text-[#0D3B2B]" /> Preferred Luxury Hotel Stays
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">East Africa Destination / Lodge</label>
                <input
                  type="text"
                  placeholder="e.g. Bwindi, Serengeti, Masai Mara, Kampala, Zanzibar"
                  value={hotelCity}
                  onChange={(e) => setHotelCity(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-semibold focus:outline-hidden focus:border-[#0D3B2B]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Max Nightly Price ({formatPrice(hotelMaxPrice)})</label>
                <input
                  type="range"
                  min={100}
                  max={1200}
                  step={50}
                  value={hotelMaxPrice}
                  onChange={(e) => setHotelMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#0D3B2B] cursor-pointer"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={fetchHotels}
                  className="w-full bg-[#0D3B2B] hover:bg-[#08291e] text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
                >
                  <Search className="w-4 h-4 text-[#E88B23]" /> Filter Hotels
                </button>
              </div>
            </div>
          </div>

          {/* Hotel Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {hotelsList.map((hotel) => (
              <div
                key={hotel.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-gray-900 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-xs">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{hotel.rating}</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-[#E88B23]" />
                      <span>{hotel.city}, {hotel.country}</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 font-serif">{hotel.name}</h4>
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">{hotel.description}</p>

                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {hotel.amenities.map((amenity, idx) => (
                        <span key={idx} className="bg-emerald-50 text-emerald-900 text-[10px] font-bold px-2.5 py-1 rounded-md">
                          ✓ {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Starting From</span>
                    <span className="text-xl font-black text-[#0D3B2B]">{formatPrice(hotel.pricePerNight)} <span className="text-xs text-gray-500 font-normal">/ night</span></span>
                  </div>

                  <button
                    onClick={() => onBookHotel(hotel)}
                    className="bg-[#0D3B2B] hover:bg-[#08291e] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    Reserve Room
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
