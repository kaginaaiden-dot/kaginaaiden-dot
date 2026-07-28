import React, { useState } from 'react';
import { TravelPackage, Flight, Hotel, CarRental, BookingRecord } from '../types';
import { X, Calendar, Users, ShieldCheck, CheckCircle2, Plane, Hotel as HotelIcon, Compass, Sparkles, ArrowRight, Phone, Car } from 'lucide-react';

interface BookingModalProps {
  item: TravelPackage | Flight | Hotel | CarRental | null;
  itemType: 'package' | 'flight' | 'hotel' | 'car' | null;
  currency: string;
  onClose: () => void;
  onConfirmBooking: (booking: BookingRecord) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  item,
  itemType,
  currency,
  onClose,
  onConfirmBooking,
}) => {
  if (!item || !itemType) return null;

  const [step, setStep] = useState<'details' | 'passenger' | 'confirmed'>('details');
  const [leadName, setLeadName] = useState('Aiden Kagina');
  const [leadEmail, setLeadEmail] = useState('kaginaaiden@gmail.com');
  const [leadPhone, setLeadPhone] = useState('0784467000');
  const [passengers, setPassengers] = useState(2);
  const [startDate, setStartDate] = useState('2026-09-15');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(['VIP Airport Transfer']);

  // Currency Formatter
  const currencySymbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', AED: 'AED ', JPY: '¥' };
  const currencyRates: Record<string, number> = { USD: 1, EUR: 0.92, GBP: 0.78, AED: 3.67, JPY: 155 };

  const formatPrice = (usdAmount: number) => {
    const symbol = currencySymbols[currency] || '$';
    const rate = currencyRates[currency] || 1;
    return `${symbol}${Math.round(usdAmount * rate).toLocaleString()}`;
  };

  const getBasePrice = () => {
    if (itemType === 'package') return (item as TravelPackage).pricePerPerson * passengers;
    if (itemType === 'flight') return (item as Flight).price * passengers;
    if (itemType === 'hotel') return (item as Hotel).pricePerNight * 3; // 3 nights default
    if (itemType === 'car') return (item as CarRental).pricePerDayUSD * 7; // 7 days rental default
    return 1000;
  };

  const getAddOnCost = () => {
    let cost = 0;
    if (selectedAddOns.includes('VIP Airport Transfer')) cost += 120;
    if (selectedAddOns.includes('Comprehensive Travel Insurance')) cost += 85 * passengers;
    if (selectedAddOns.includes('Global Roaming eSIM')) cost += 30 * passengers;
    return cost;
  };

  const totalPrice = getBasePrice() + getAddOnCost();

  const handleToggleAddOn = (addOn: string) => {
    if (selectedAddOns.includes(addOn)) {
      setSelectedAddOns(selectedAddOns.filter((a) => a !== addOn));
    } else {
      setSelectedAddOns([...selectedAddOns, addOn]);
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let title = '';
    let dest = '';

    if (itemType === 'package') {
      const p = item as TravelPackage;
      title = p.title;
      dest = p.destination;
    } else if (itemType === 'flight') {
      const f = item as Flight;
      title = `${f.airline} (${f.flightNumber}) - ${f.origin} to ${f.destination}`;
      dest = f.destinationCity;
    } else if (itemType === 'hotel') {
      const h = item as Hotel;
      title = h.name;
      dest = `${h.city}, ${h.country}`;
    } else if (itemType === 'car') {
      const c = item as CarRental;
      title = `4x4 Hire: ${c.name} (${c.driveType})`;
      dest = 'Uganda & East Africa';
    }

    const newBooking: BookingRecord = {
      id: `bk-${Date.now()}`,
      bookingRef: `AT-${Math.floor(100000 + Math.random() * 900000)}`,
      type: itemType,
      title,
      destination: dest,
      dates: `${startDate} (${passengers} Persons)`,
      passengersCount: passengers,
      totalPriceUSD: totalPrice,
      status: 'Confirmed',
      createdAt: new Date().toLocaleDateString(),
      leadPassengerName: leadName || 'Valued Guest',
      leadPassengerEmail: leadEmail || 'guest@aidentravel.com',
      addOns: selectedAddOns,
      detailsJson: item,
    };

    onConfirmBooking(newBooking);
    setStep('confirmed');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'details' && (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div>
              <span className="text-xs font-bold text-[#E88B23] uppercase tracking-wider block mb-1">
                Aiden Booking Solution • {itemType.toUpperCase()}
              </span>
              <h3 className="text-2xl font-black text-gray-900 font-serif">
                {itemType === 'package' && (item as TravelPackage).title}
                {itemType === 'flight' && `${(item as Flight).airline} ${(item as Flight).flightNumber}`}
                {itemType === 'hotel' && (item as Hotel).name}
                {itemType === 'car' && (item as CarRental).name}
              </h3>
            </div>

            {/* Content summary */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs space-y-2">
              {itemType === 'package' && (
                <div>
                  <p className="text-gray-700 font-medium">{(item as TravelPackage).highlights.join(' • ')}</p>
                  <p className="text-emerald-800 font-bold mt-1">Included: {(item as TravelPackage).included.join(', ')}</p>
                </div>
              )}
              {itemType === 'flight' && (
                <div className="flex justify-between font-bold text-gray-900">
                  <span>{(item as Flight).origin} ({ (item as Flight).originCity }) ➔ {(item as Flight).destination} ({ (item as Flight).destinationCity })</span>
                  <span>{(item as Flight).cabinClass}</span>
                </div>
              )}
              {itemType === 'hotel' && (
                <div>
                  <p className="text-gray-700">{(item as Hotel).description}</p>
                  <p className="text-emerald-800 font-bold mt-1">Amenities: {(item as Hotel).amenities.join(', ')}</p>
                </div>
              )}
              {itemType === 'car' && (
                <div>
                  <p className="text-gray-800 font-bold">Category: {(item as CarRental).type} ({(item as CarRental).driveType})</p>
                  <p className="text-gray-600 mt-0.5">Popular For: {(item as CarRental).popularFor}</p>
                  <p className="text-emerald-800 font-bold mt-1">Features: {(item as CarRental).features.join(', ')}</p>
                </div>
              )}
            </div>

            {/* Travel Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Departure Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Travelers ({passengers})</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold"
                />
              </div>
            </div>

            {/* Add-ons */}
            <div>
              <label className="text-xs font-bold text-gray-900 block mb-2">Enhance Your Experience (Optional Add-ons):</label>
              <div className="space-y-2 text-xs">
                {[
                  { name: 'VIP Airport Transfer', desc: 'Luxury Chauffeur Service', price: '$120' },
                  { name: 'Comprehensive Travel Insurance', desc: 'Medical & Trip Delay Protection', price: '$85 / person' },
                  { name: 'Global Roaming eSIM', desc: 'Unlimited high speed data', price: '$30 / person' },
                ].map((addon) => (
                  <label
                    key={addon.name}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-emerald-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedAddOns.includes(addon.name)}
                        onChange={() => handleToggleAddOn(addon.name)}
                        className="accent-[#0D3B2B] w-4 h-4"
                      />
                      <div>
                        <div className="font-bold text-gray-900">{addon.name}</div>
                        <div className="text-[10px] text-gray-500">{addon.desc}</div>
                      </div>
                    </div>
                    <span className="font-bold text-[#0D3B2B]">{addon.price}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Footer */}
            <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Total Price</span>
                <span className="text-2xl font-black text-[#0D3B2B]">{formatPrice(totalPrice)}</span>
              </div>

              <button
                onClick={() => setStep('passenger')}
                className="bg-[#0D3B2B] hover:bg-[#08291e] text-white px-6 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md"
              >
                Proceed to Passenger Info <ArrowRight className="w-4 h-4 text-[#E88B23]" />
              </button>
            </div>
          </div>
        )}

        {step === 'passenger' && (
          <form onSubmit={handleFinalSubmit} className="p-6 sm:p-8 space-y-4">
            <div>
              <span className="text-xs font-bold text-[#E88B23] uppercase tracking-wider block">Step 2 of 2</span>
              <h3 className="text-2xl font-black text-gray-900 font-serif">Lead Passenger Information</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Full Legal Name (as on Passport)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eleanor Vance"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Email Address (E-Ticket Recipient)</label>
                <input
                  type="email"
                  required
                  placeholder="kaginaaiden@gmail.com"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Phone Number (MTN / Airtel Flight Alerts)</label>
                <input
                  type="tel"
                  required
                  placeholder="0784467000 (MTN) or 0752023628 (Airtel)"
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-medium"
                />
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl text-emerald-900 text-xs flex items-center gap-2 border border-emerald-100">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Free 24-hour cancellation guarantee on all Aiden Travel Solutions bookings.</span>
            </div>

            <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="text-xs font-bold text-gray-500 hover:underline"
              >
                Back to Details
              </button>

              <button
                type="submit"
                className="bg-[#0D3B2B] hover:bg-[#08291e] text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
              >
                Confirm Booking ({formatPrice(totalPrice)})
              </button>
            </div>
          </form>
        )}

        {step === 'confirmed' && (
          <div className="p-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
            <h3 className="text-2xl font-black text-gray-900 font-serif">Booking Confirmed!</h3>
            <p className="text-xs text-gray-600 max-w-md mx-auto">
              Your travel reservation has been saved to your <strong className="text-gray-900">My Bookings</strong> tab. An official e-ticket confirmation email has been dispatched.
            </p>

            <button
              onClick={onClose}
              className="mt-4 bg-[#0D3B2B] text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-[#08291e] transition-colors"
            >
              Done & View Bookings
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
