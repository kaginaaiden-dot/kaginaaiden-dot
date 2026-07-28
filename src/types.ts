export interface TravelPackage {
  id: string;
  title: string;
  destination: string;
  region: string;
  category: string;
  durationDays: number;
  pricePerPerson: number;
  rating: number;
  reviewsCount: number;
  image: string;
  highlights: string[];
  included: string[];
  tag: string;
  featured: boolean;
}

export interface Flight {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  price: number;
  cabinClass: string;
  aircraft: string;
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  country: string;
  rating: number;
  stars: number;
  pricePerNight: number;
  image: string;
  amenities: string[];
  description: string;
}

export interface DayItinerary {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  diningRecommendation: string;
  insiderTip: string;
}

export interface AiItinerary {
  tripTitle: string;
  destination: string;
  durationDays: number;
  tagline: string;
  estimatedTotalCostUSD: number;
  costBreakdown: {
    accommodation: number;
    activities: number;
    dining: number;
    transfers: number;
  };
  recommendedBestTime: string;
  visaAndEntryTip: string;
  weatherForecastOverview: string;
  dayByDayItinerary: DayItinerary[];
  packingEssentials: string[];
  aidenExclusivePerks: string[];
}

export interface CarRental {
  id: string;
  name: string;
  type: '4x4 Safari Spec' | 'SUV' | 'Van / Supercustom' | 'Compact 4x4' | 'Coaster Bus';
  driveType: 'Self-Drive' | 'Chauffeur / Driver-Guide' | 'Both Options';
  transmission: 'Automatic' | 'Manual';
  capacity: string;
  pricePerDayUSD: number;
  image: string;
  pickupLocations: string[];
  features: string[];
  popularFor: string;
  campingGearAvailable: boolean;
}

export interface BookingRecord {
  id: string;
  bookingRef: string;
  type: 'package' | 'flight' | 'hotel' | 'custom_ai_trip' | 'car';
  title: string;
  destination: string;
  dates: string;
  passengersCount: number;
  totalPriceUSD: number;
  status: 'Confirmed' | 'Processing' | 'Completed';
  createdAt: string;
  leadPassengerName: string;
  leadPassengerEmail: string;
  addOns?: string[];
  detailsJson?: any;
}

export type NavigationTab = 'home' | 'planner' | 'search' | 'packages' | 'car-rental' | 'corporate' | 'my-bookings';
