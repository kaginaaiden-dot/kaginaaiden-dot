import React, { useState } from 'react';
import { BookingRecord } from '../types';
import { BookmarkCheck, Calendar, Plane, Hotel, CheckCircle2, QrCode, Download, Printer, ShieldCheck, Trash2, ArrowRight, PhoneCall, Sparkles } from 'lucide-react';

interface MyBookingsViewProps {
  bookings: BookingRecord[];
  onRemoveBooking: (id: string) => void;
  currency: string;
  onOpenConciergeWithPrompt: (prompt: string) => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  bookings,
  onRemoveBooking,
  currency,
  onOpenConciergeWithPrompt,
}) => {
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);

  const currencySymbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', AED: 'AED ', JPY: '¥' };
  const currencyRates: Record<string, number> = { USD: 1, EUR: 0.92, GBP: 0.78, AED: 3.67, JPY: 155 };

  const formatPrice = (usdAmount: number) => {
    const symbol = currencySymbols[currency] || '$';
    const rate = currencyRates[currency] || 1;
    return `${symbol}${Math.round(usdAmount * rate).toLocaleString()}`;
  };

  const handlePrintETicket = () => {
    window.print();
  };

  return (
    <section id="my-bookings-view" className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D3B2B] bg-emerald-100/80 px-3 py-1 rounded-full mb-2">
            <BookmarkCheck className="w-3.5 h-3.5 text-[#E88B23]" /> Passenger Itineraries & Receipts
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 font-serif">
            My Travel Bookings
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm mt-1">
            View confirmed trips, active boarding passes, e-tickets, and live flight statuses.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-gray-500 uppercase block">Active Records</span>
          <span className="text-2xl font-black text-[#0D3B2B]">{bookings.length} Bookings</span>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center text-gray-500 max-w-xl mx-auto my-8">
          <BookmarkCheck className="w-12 h-12 text-emerald-600 mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-bold text-gray-900 font-serif">No Active Bookings Saved Yet</h3>
          <p className="text-xs text-gray-500 mt-2">
            Explore curated packages or use our AI Trip Designer to generate and reserve your next dream itinerary.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Booking Cards Column */}
          <div className="lg:col-span-5 space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                onClick={() => setSelectedBooking(booking)}
                className={`cursor-pointer rounded-2xl border p-5 transition-all shadow-2xs ${
                  selectedBooking?.id === booking.id
                    ? 'bg-emerald-50/90 border-[#0D3B2B] ring-2 ring-[#0D3B2B]/20'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Ref: {booking.bookingRef}
                  </span>
                  <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {booking.status}
                  </span>
                </div>

                <h4 className="text-base font-bold text-gray-900 line-clamp-1">{booking.title}</h4>

                <div className="flex items-center gap-4 text-xs text-gray-600 mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#E88B23]" /> {booking.dates}
                  </span>
                  <span className="font-bold text-[#0D3B2B] ml-auto">
                    {formatPrice(booking.totalPriceUSD)}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                  <span>Lead: {booking.leadPassengerName}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveBooking(booking.id);
                      if (selectedBooking?.id === booking.id) setSelectedBooking(null);
                    }}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* E-Ticket / Detailed Receipt Column */}
          <div className="lg:col-span-7">
            {selectedBooking ? (
              <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-md relative print:p-0 print:border-none">
                {/* Print E-Ticket Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-6 mb-6">
                  <div>
                    <span className="text-xs font-bold text-[#0D3B2B] uppercase tracking-wider block">
                      Aiden Official E-Ticket & Voucher
                    </span>
                    <h3 className="text-2xl font-black text-gray-900 font-serif">
                      {selectedBooking.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Destination: {selectedBooking.destination} • Booked on {selectedBooking.createdAt}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 print:hidden">
                    <button
                      onClick={handlePrintETicket}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Printer className="w-4 h-4" /> Print Ticket
                    </button>
                  </div>
                </div>

                {/* Ticket Body */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-4 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-gray-200 pb-4">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase block">Booking Reference</span>
                      <span className="font-mono font-bold text-gray-900 text-sm">{selectedBooking.bookingRef}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase block">Lead Passenger</span>
                      <span className="font-bold text-gray-900">{selectedBooking.leadPassengerName}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase block">Travelers</span>
                      <span className="font-bold text-gray-900">{selectedBooking.passengersCount} Persons</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase block">Total Payment</span>
                      <span className="font-bold text-[#0D3B2B] text-sm">{formatPrice(selectedBooking.totalPriceUSD)}</span>
                    </div>
                  </div>

                  {/* QR Code Simulation */}
                  <div className="flex items-center justify-between gap-4 pt-2">
                    <div className="space-y-1">
                      <span className="font-bold text-gray-900 block flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" /> Confirmed Boarding Voucher
                      </span>
                      <p className="text-gray-500 text-[11px]">
                        Scan this QR code at airport check-in or hotel front desk.
                      </p>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-gray-300 shadow-2xs flex flex-col items-center">
                      <QrCode className="w-16 h-16 text-gray-900" />
                      <span className="text-[9px] font-mono text-gray-500 mt-1">{selectedBooking.bookingRef}</span>
                    </div>
                  </div>
                </div>

                {/* Concierge Help Prompt */}
                <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#E88B23]" />
                    <span className="font-semibold text-amber-950">Need changes, airport transfers, or dietary requests for this booking?</span>
                  </div>

                  <button
                    onClick={() => onOpenConciergeWithPrompt(`I have a question regarding my booking ref ${selectedBooking.bookingRef} to ${selectedBooking.destination}.`)}
                    className="bg-[#0D3B2B] text-white font-bold px-3.5 py-2 rounded-xl text-xs hover:bg-[#08291e] transition-colors"
                  >
                    Contact Concierge
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-3xl border border-gray-200 p-12 text-center text-gray-500">
                <BookmarkCheck className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-xs font-semibold">Select a booking from the left list to view e-ticket details and QR code.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
