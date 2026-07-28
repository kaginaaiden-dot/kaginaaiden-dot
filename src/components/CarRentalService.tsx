import React, { useState, useEffect } from 'react';
import { CarRental } from '../types';
import { Car, ShieldCheck, MapPin, Compass, CheckCircle2, Tent, Fuel, Users, Settings2, Calendar, PhoneCall, ArrowRight, Sparkles, Navigation, RefreshCw, Calculator, DollarSign, Coins } from 'lucide-react';
import { UgandaInteractiveMap } from './UgandaInteractiveMap';

interface CarRentalServiceProps {
  currency: string;
  onBookCar: (car: CarRental) => void;
}

interface FuelPrices {
  lastUpdated: string;
  stations: string[];
  currencies: {
    UGX: { symbol: string; rateToUSD: number };
    USD: { symbol: string; rateToUSD: number };
    EUR: { symbol: string; rateToUSD: number };
  };
  petrolPerLitre: { UGX: number; USD: number; EUR: number };
  dieselPerLitre: { UGX: number; USD: number; EUR: number };
  kerosenePerLitre: { UGX: number; USD: number; EUR: number };
}

export const CarRentalService: React.FC<CarRentalServiceProps> = ({ currency, onBookCar }) => {
  const [cars, setCars] = useState<CarRental[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriveType, setSelectedDriveType] = useState('All');
  const [selectedVehicleType, setSelectedVehicleType] = useState('All');
  const [campingGearOnly, setCampingGearOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pickupLocation, setPickupLocation] = useState('Entebbe International Airport (EBB)');

  // Fuel Price Tracker State
  const [fuelPrices, setFuelPrices] = useState<FuelPrices | null>(null);
  const [calcFuelType, setCalcFuelType] = useState<'petrol' | 'diesel'>('diesel');
  const [calcRoute, setCalcRoute] = useState<'bwindi' | 'murchison' | 'kampala' | 'kidepo' | 'full_tank' | 'custom'>('bwindi');
  const [calcCustomDistance, setCalcCustomDistance] = useState(500);
  const [calcConsumption, setCalcConsumption] = useState(9); // km per litre

  // Currency Formatter & Rates
  const currencySymbols: Record<string, string> = { USD: '$', UGX: 'USh ', EUR: '€', GBP: '£', AED: 'AED ', JPY: '¥' };
  const currencyRates: Record<string, number> = { USD: 1, UGX: 3700, EUR: 0.92, GBP: 0.78, AED: 3.67, JPY: 155 };

  const formatPrice = (usdAmount: number, forceCurrency?: string) => {
    const cur = forceCurrency || currency;
    const symbol = currencySymbols[cur] || '$';
    const rate = currencyRates[cur] || 1;
    const converted = Math.round(usdAmount * rate);

    if (cur === 'UGX') {
      return `${symbol}${converted.toLocaleString()}`;
    }
    return `${symbol}${converted.toLocaleString()}`;
  };

  const fetchCarsAndFuel = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedDriveType !== 'All') params.append('driveType', selectedDriveType);
    if (selectedVehicleType !== 'All') params.append('vehicleType', selectedVehicleType);
    if (campingGearOnly) params.append('campingGearOnly', 'true');
    if (searchTerm) params.append('search', searchTerm);

    fetch(`/api/search-cars?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCars(data.cars);
          if (data.fuelPrices) {
            setFuelPrices(data.fuelPrices);
          }
        }
      })
      .catch((err) => console.error('Error fetching car fleet:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCarsAndFuel();
  }, [selectedDriveType, selectedVehicleType, campingGearOnly, searchTerm]);

  // Trip Distance Calculator Logic
  const getRouteKm = () => {
    switch (calcRoute) {
      case 'bwindi': return 480; // Entebbe -> Bwindi Gorilla Park
      case 'murchison': return 305; // Entebbe -> Murchison Falls NP
      case 'kampala': return 45; // Entebbe -> Kampala City
      case 'kidepo': return 570; // Kampala -> Kidepo Valley NP
      case 'full_tank': return 60 * calcConsumption; // Approx range for 60L tank
      case 'custom': return calcCustomDistance;
      default: return 480;
    }
  };

  const totalKm = getRouteKm();
  const requiredLitres = calcRoute === 'full_tank' ? 60 : Math.ceil(totalKm / calcConsumption);

  const getLitrePriceUGX = () => {
    if (calcFuelType === 'petrol') return fuelPrices?.petrolPerLitre.UGX || 5400;
    return fuelPrices?.dieselPerLitre.UGX || 5100;
  };

  const totalFuelCostUGX = requiredLitres * getLitrePriceUGX();
  const totalFuelCostUSD = totalFuelCostUGX / 3700;
  const totalFuelCostEUR = totalFuelCostUSD * 0.92;

  return (
    <section id="uganda-car-rental-service" className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#0D3B2B] via-[#092b1f] to-[#0D3B2B] text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl border border-emerald-800">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-[#E88B23] text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
              <Car className="w-4 h-4" /> Uganda Car Rental & Safari Fleet
            </span>
            <span className="inline-flex items-center gap-1 bg-emerald-900/90 text-emerald-200 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-700">
              <MapPin className="w-3.5 h-3.5 text-[#E88B23]" /> Entebbe & Kampala Hubs
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold font-serif leading-tight">
            Uganda 4x4 Car Rental Services
          </h2>

          <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Rent top-conditioned 4x4 vehicles in Uganda including the iconic <strong className="text-amber-200">Toyota HiAce "Drone" VIP Minibus</strong>, <strong className="text-amber-200">Land Cruiser Prado TX/VX</strong>, <strong className="text-amber-200">Toyota Alphard Luxury MPV</strong>, <strong className="text-amber-200">Toyota Harrier 2006 Model</strong>, and <strong className="text-amber-200">Toyota Corolla Fielder</strong>. Complete with self-drive options, professional driver-guides, rooftop camping gear, and COMESA cross-border permits.
          </p>

          <div className="flex flex-wrap gap-3 text-xs font-semibold text-emerald-200 pt-2">
            <span className="flex items-center gap-1.5 bg-emerald-900/70 px-3 py-1.5 rounded-xl border border-emerald-700/60">
              <CheckCircle2 className="w-4 h-4 text-[#E88B23]" /> Free Entebbe Airport (EBB) Pick-up & Drop-off
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-900/70 px-3 py-1.5 rounded-xl border border-emerald-700/60">
              <CheckCircle2 className="w-4 h-4 text-[#E88B23]" /> Unlimited Mileage Across All National Parks
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-900/70 px-3 py-1.5 rounded-xl border border-emerald-700/60">
              <CheckCircle2 className="w-4 h-4 text-[#E88B23]" /> Multi-Currency Payments (USD, UGX, EUR)
            </span>
          </div>
        </div>
      </div>

      {/* INTERACTIVE MAP OF UGANDA PICKUP LOCATIONS & SAFARI ROUTES */}
      <UgandaInteractiveMap
        onSelectHub={(hubName) => {
          if (hubName.includes('Entebbe')) setPickupLocation('Entebbe International Airport (EBB)');
          else if (hubName.includes('Kampala')) setPickupLocation('Kampala City Hub');
          else if (hubName.includes('Jinja')) setPickupLocation('Jinja');
          else if (hubName.includes('Mbarara')) setPickupLocation('Mbarara');
          else if (hubName.includes('Bwindi')) setPickupLocation('Bwindi / Kabale');
        }}
        onSelectRouteFuel={(routeKey) => {
          setCalcRoute(routeKey as any);
          const fuelSection = document.getElementById('uganda-live-fuel-tracker');
          if (fuelSection) fuelSection.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* LIVE UGANDA FUEL PRICE TRACKER & TRIP COST CALCULATOR */}
      <div id="uganda-live-fuel-tracker" className="bg-gradient-to-br from-amber-500/10 via-emerald-50/60 to-amber-500/10 rounded-3xl border border-amber-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-200/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Fuel className="w-5 h-5 text-[#E88B23]" />
              <h3 className="text-xl font-bold font-serif text-gray-900">Uganda Live Station Fuel Price Tracker</h3>
              <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Live Station Rates
              </span>
            </div>
            <p className="text-xs text-gray-600">
              Benchmark fuel prices across Shell Uganda, TotalEnergies, Stabex, and Rubis stations in Entebbe & Kampala.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-700 animate-spin" />
            <span>Updated: {fuelPrices?.lastUpdated || 'Today (Live)'}</span>
          </div>
        </div>

        {/* Station Price Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Petrol */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-gray-500">
              <span className="font-bold text-gray-800 flex items-center gap-1">
                <Fuel className="w-4 h-4 text-amber-600" /> Petrol (Super Unleaded)
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-bold">Uganda Shell / Total</span>
            </div>
            <div className="text-2xl font-black text-gray-900 font-serif">
              USh {(fuelPrices?.petrolPerLitre.UGX || 5400).toLocaleString()} <span className="text-xs text-gray-500 font-sans font-normal">/ Litre</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-800 pt-1 border-t border-gray-100">
              <span>$ {(fuelPrices?.petrolPerLitre.USD || 1.46).toFixed(2)} USD</span>
              <span>€ {(fuelPrices?.petrolPerLitre.EUR || 1.34).toFixed(2)} EUR</span>
            </div>
          </div>

          {/* Diesel */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-gray-500">
              <span className="font-bold text-gray-800 flex items-center gap-1">
                <Fuel className="w-4 h-4 text-[#0D3B2B]" /> Diesel (Automotive Gas Oil)
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md font-bold">Safaris Preferred</span>
            </div>
            <div className="text-2xl font-black text-gray-900 font-serif">
              USh {(fuelPrices?.dieselPerLitre.UGX || 5100).toLocaleString()} <span className="text-xs text-gray-500 font-sans font-normal">/ Litre</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-800 pt-1 border-t border-gray-100">
              <span>$ {(fuelPrices?.dieselPerLitre.USD || 1.38).toFixed(2)} USD</span>
              <span>€ {(fuelPrices?.dieselPerLitre.EUR || 1.27).toFixed(2)} EUR</span>
            </div>
          </div>

          {/* Kerosene */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-gray-500">
              <span className="font-bold text-gray-800 flex items-center gap-1">
                <Fuel className="w-4 h-4 text-blue-600" /> Kerosene (Camping & Stoves)
              </span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md font-bold">Stabex / Rubis</span>
            </div>
            <div className="text-2xl font-black text-gray-900 font-serif">
              USh {(fuelPrices?.kerosenePerLitre.UGX || 4600).toLocaleString()} <span className="text-xs text-gray-500 font-sans font-normal">/ Litre</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-800 pt-1 border-t border-gray-100">
              <span>$ {(fuelPrices?.kerosenePerLitre.USD || 1.24).toFixed(2)} USD</span>
              <span>€ {(fuelPrices?.kerosenePerLitre.EUR || 1.14).toFixed(2)} EUR</span>
            </div>
          </div>
        </div>

        {/* Interactive Trip Fuel Cost Estimator */}
        <div className="bg-white rounded-2xl border border-amber-200/80 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[#E88B23]" />
            <h4 className="font-bold text-gray-900 text-sm">Interactive Uganda Trip Fuel Estimator</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Fuel Type */}
            <div>
              <label className="font-bold text-gray-700 block mb-1">Fuel Grade</label>
              <select
                value={calcFuelType}
                onChange={(e) => setCalcFuelType(e.target.value as 'petrol' | 'diesel')}
                className="w-full bg-gray-50 p-2.5 border border-gray-300 rounded-xl font-bold text-gray-900"
              >
                <option value="diesel">Diesel (UGX 5,100 / L) - Safari 4x4s</option>
                <option value="petrol">Petrol (UGX 5,400 / L) - Harrier / Fielder / Alphard</option>
              </select>
            </div>

            {/* Safari Route or Tank */}
            <div>
              <label className="font-bold text-gray-700 block mb-1">Safari Route / Distance</label>
              <select
                value={calcRoute}
                onChange={(e) => setCalcRoute(e.target.value as any)}
                className="w-full bg-gray-50 p-2.5 border border-gray-300 rounded-xl font-bold text-gray-900"
              >
                <option value="bwindi">Entebbe ➔ Bwindi Gorilla Park (480 km)</option>
                <option value="murchison">Entebbe ➔ Murchison Falls NP (305 km)</option>
                <option value="kampala">Entebbe ➔ Kampala City Transfer (45 km)</option>
                <option value="kidepo">Kampala ➔ Kidepo Valley NP (570 km)</option>
                <option value="full_tank">Full Tank Refill (60 Litres)</option>
                <option value="custom">Custom Distance (KM)</option>
              </select>
            </div>

            {/* Custom Distance Input if Selected */}
            {calcRoute === 'custom' && (
              <div>
                <label className="font-bold text-gray-700 block mb-1">Distance in KM</label>
                <input
                  type="number"
                  value={calcCustomDistance}
                  onChange={(e) => setCalcCustomDistance(Number(e.target.value))}
                  className="w-full bg-gray-50 p-2 border border-gray-300 rounded-xl font-bold text-gray-900"
                />
              </div>
            )}

            {/* Vehicle Consumption Rate */}
            <div>
              <label className="font-bold text-gray-700 block mb-1">Vehicle Efficiency</label>
              <select
                value={calcConsumption}
                onChange={(e) => setCalcConsumption(Number(e.target.value))}
                className="w-full bg-gray-50 p-2.5 border border-gray-300 rounded-xl font-bold text-gray-900"
              >
                <option value={16}>Corolla Fielder (~ 16 km/L)</option>
                <option value={11}>Harrier 2006 (~ 11 km/L)</option>
                <option value={9}>HiAce 'Drone' / Alphard (~ 9 km/L)</option>
                <option value={8}>Land Cruiser Prado (~ 8 km/L)</option>
                <option value={7}>Safari 70 Series (~ 7 km/L)</option>
              </select>
            </div>

            {/* Estimated Fuel Output */}
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-emerald-900 uppercase">Estimated Fuel Cost:</span>
              <div className="space-y-0.5">
                <div className="text-base font-black text-[#0D3B2B]">
                  USh {totalFuelCostUGX.toLocaleString()}
                </div>
                <div className="text-[11px] font-bold text-emerald-800 flex justify-between">
                  <span>$ {Math.round(totalFuelCostUSD)} USD</span>
                  <span>€ {Math.round(totalFuelCostEUR)} EUR</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Vehicle Search Controls */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 font-serif">Available Uganda Fleet</h3>
            <p className="text-gray-500 text-xs mt-0.5">Choose from Toyota HiAce Drone, Land Cruiser Prado, Alphard, Harrier 2006, Fielder & Safari Spec Vehicles</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500">Pick-up Location:</span>
            <select
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold text-xs p-2.5 rounded-xl focus:outline-hidden"
            >
              <option value="Entebbe International Airport (EBB)">🛫 Entebbe Airport (EBB)</option>
              <option value="Kampala City Hub">🏙️ Kampala City Hub</option>
              <option value="Jinja">🌊 Jinja Source of Nile</option>
              <option value="Mbarara">🐄 Mbarara Town</option>
              <option value="Bwindi / Kabale">🦍 Bwindi National Park</option>
            </select>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Drive Option</label>
            <select
              value={selectedDriveType}
              onChange={(e) => setSelectedDriveType(e.target.value)}
              className="w-full bg-gray-50 p-2.5 border border-gray-300 rounded-xl font-bold text-gray-900"
            >
              <option value="All">All Drive Options</option>
              <option value="Self-Drive">Self-Drive Only</option>
              <option value="Chauffeur / Driver-Guide">Chauffeur / Driver-Guide Included</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Vehicle Category</label>
            <select
              value={selectedVehicleType}
              onChange={(e) => setSelectedVehicleType(e.target.value)}
              className="w-full bg-gray-50 p-2.5 border border-gray-300 rounded-xl font-bold text-gray-900"
            >
              <option value="All">All Vehicle Models</option>
              <option value="Van / Supercustom">Toyota HiAce / Drone / Minibus</option>
              <option value="SUV">Toyota Land Cruiser Prado</option>
              <option value="Executive MPV">Toyota Alphard MPV</option>
              <option value="Compact 4x4">Toyota Harrier / Fielder</option>
              <option value="4x4 Safari Spec">Land Cruiser 70 Series Safari Spec</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Search Fleet</label>
            <input
              type="text"
              placeholder="e.g. HiAce, Prado, Alphard, Harrier, Fielder..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 p-2.5 border border-gray-300 rounded-xl font-medium text-gray-900"
            />
          </div>

          <div className="flex items-end">
            <label className="w-full flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 cursor-pointer font-bold text-emerald-950">
              <span className="flex items-center gap-1.5">
                <Tent className="w-4 h-4 text-[#E88B23]" /> Camping Gear Available
              </span>
              <input
                type="checkbox"
                checked={campingGearOnly}
                onChange={(e) => setCampingGearOnly(e.target.checked)}
                className="accent-[#0D3B2B] w-4 h-4"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Vehicle Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-gray-500 font-medium text-xs">
          Loading Uganda car rental fleet database...
        </div>
      ) : cars.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-gray-500">
          <Car className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="font-bold text-gray-800">No vehicles match your search criteria.</p>
          <p className="text-xs text-gray-500 mt-1">Try clearing your filters or searching for "HiAce", "Prado", or "Harrier".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Vehicle Image */}
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="bg-[#0D3B2B] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                      {car.type}
                    </span>
                    {car.campingGearAvailable && (
                      <span className="bg-[#E88B23] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                        <Tent className="w-3 h-3" /> Camping Kit Ready
                      </span>
                    )}
                  </div>

                  {/* Multi-Currency Rate Badge */}
                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs text-gray-900 p-2 rounded-xl text-xs font-black shadow-md border border-gray-200/80 text-right">
                    <div className="text-emerald-950 font-serif text-sm">
                      {formatPrice(car.pricePerDayUSD)} <span className="text-[10px] font-normal text-gray-500">/ day</span>
                    </div>
                    {/* Show UGX benchmark explicitly */}
                    {currency !== 'UGX' && (
                      <div className="text-[10px] text-gray-500 font-sans">
                        USh {(car.pricePerDayUSD * 3700).toLocaleString()} / day
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 font-serif leading-snug">{car.name}</h3>
                    <p className="text-[11px] font-medium text-emerald-800 mt-1 flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-[#E88B23]" /> Ideal for: {car.popularFor}
                    </p>
                  </div>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-gray-50 p-3 rounded-2xl border border-gray-100 font-medium">
                    <span className="flex items-center gap-1.5 text-gray-700">
                      <Users className="w-3.5 h-3.5 text-[#E88B23]" /> {car.capacity}
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-700">
                      <Settings2 className="w-3.5 h-3.5 text-[#E88B23]" /> {car.transmission}
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-700">
                      <Car className="w-3.5 h-3.5 text-[#E88B23]" /> {car.driveType}
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-700">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Full Insurance
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Key Features & Amenities:</span>
                    <div className="flex flex-wrap gap-1 text-[10px]">
                      {car.features.map((feat, i) => (
                        <span key={i} className="bg-emerald-50 text-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-100 font-medium">
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-6 pt-0 space-y-2">
                <button
                  onClick={() => onBookCar(car)}
                  className="w-full bg-[#0D3B2B] hover:bg-[#08291e] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md group-hover:bg-[#08291e]"
                >
                  Reserve {car.name.split(' ')[1] || 'Vehicle'} <ArrowRight className="w-4 h-4 text-[#E88B23]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Camping & Safari Circuits Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-5 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-lg">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-xs">
              <Tent className="w-4 h-4" /> Self-Drive Camping Upgrade
            </div>
            <h3 className="text-2xl font-bold font-serif">Complete Bush Camping Kit</h3>
            <p className="text-xs text-amber-50 leading-relaxed">
              Rent a rooftop tent mounted on your Land Cruiser Prado or Harrier along with sleeping bags, mattress, gas cooker, folding chairs, solar lamp, and 12V portable fridge for $25 / USh 92,500 / €23 per day.
            </p>
          </div>

          <div className="pt-6 border-t border-amber-400/40 text-xs font-bold space-y-1.5">
            <div className="flex justify-between">
              <span>Dual Rooftop Tent + Mattress</span>
              <span>Included</span>
            </div>
            <div className="flex justify-between">
              <span>12V Portable Electric Cooler Box</span>
              <span>Included</span>
            </div>
            <div className="flex justify-between">
              <span>Kitchen Cooking Utensils & Gas Stove</span>
              <span>Included</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-[#0D3B2B]">
            <Navigation className="w-5 h-5 text-[#E88B23]" />
            <h3 className="text-xl font-bold font-serif text-gray-900">Recommended Uganda Self-Drive Safari Circuits</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="font-bold text-gray-900 text-sm mb-1">1. The Grand Gorilla & Savanna Circuit (10 - 12 Days)</div>
              <p className="text-gray-600">
                Entebbe Airport ➔ Ziwa Rhino Sanctuary ➔ Murchison Falls NP ➔ Kibale Primate Forest ➔ Queen Elizabeth NP ➔ Bwindi Gorilla Trekking ➔ Lake Bunyonyi ➔ Entebbe Airport.
              </p>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="font-bold text-gray-900 text-sm mb-1">2. Gorilla & Bunyonyi Express (5 Days)</div>
              <p className="text-gray-600">
                Kampala / Entebbe ➔ Lake Mburo NP (Zebras) ➔ Bwindi Impenetrable NP (Gorillas) ➔ Lake Bunyonyi Relaxation ➔ Entebbe Airport.
              </p>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="font-bold text-gray-900 text-sm mb-1">3. Kidepo Remote Wilderness Trail (7 Days)</div>
              <p className="text-gray-600">
                Kampala ➔ Gulu ➔ Kidepo Valley National Park ➔ Pian Upe Game Reserve ➔ Sipi Falls (Mount Elgon) ➔ Jinja Nile Source ➔ Entebbe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
