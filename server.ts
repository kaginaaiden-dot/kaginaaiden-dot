import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Mock Packages Database
const CURATED_PACKAGES = [
  {
    id: "pkg-1",
    title: "Serengeti & Zanzibar Eco Luxury Safari",
    destination: "Tanzania & Zanzibar",
    region: "Africa",
    category: "Wildlife & Beach",
    durationDays: 10,
    pricePerPerson: 3850,
    rating: 4.95,
    reviewsCount: 142,
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Big 5 Game Drives", "Private Hot Air Balloon over Serengeti", "Stone Town Cultural Walking Tour", "Overwater Bungalow in Nungwi"],
    included: ["Luxury Lodge & Beach Resort", "All Meals & Fine Dining", "Private 4x4 Land Cruiser", "Internal Flights", "Park Fees"],
    tag: "Bestseller",
    featured: true,
  },
  {
    id: "pkg-2",
    title: "Kyoto Autumn & Ryokan Onsen Retreat",
    destination: "Kyoto & Hakone, Japan",
    region: "Asia",
    category: "Culture & Relaxation",
    durationDays: 8,
    pricePerPerson: 2980,
    rating: 4.92,
    reviewsCount: 98,
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Private Tea Ceremony in Gion", "Traditional Ryokan Stay with Private Hot Spring", "Fushimi Inari Early Access", "Bullet Train Green Car Pass"],
    included: ["5-Star Hotels & Traditional Ryokan", "Daily Kaiseki Dinners", "JR Rail Pass", "Private English Guide"],
    tag: "Cultural Luxury",
    featured: true,
  },
  {
    id: "pkg-3",
    title: "Amalfi Coast Yacht & Villa Odyssey",
    destination: "Positano & Capri, Italy",
    region: "Europe",
    category: "Luxury Escapes",
    durationDays: 7,
    pricePerPerson: 4200,
    rating: 4.98,
    reviewsCount: 176,
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Private Day Charter to Capri Blue Grotto", "Cliffside Luxury Villa in Ravello", "Michelin-Starred Dining Experience", "Lemon Grove & Wine Tasting Tour"],
    included: ["Boutique Villa Suite", "Private Yacht Day Trip", "Luxury Airport Transfers", "Daily Breakfast & Wine Pairing"],
    tag: "Exclusive",
    featured: true,
  },
  {
    id: "pkg-4",
    title: "Swiss Alps Express & St. Moritz Winter Gold",
    destination: "Zermatt & St. Moritz, Switzerland",
    region: "Europe",
    category: "Mountain & Adventure",
    durationDays: 9,
    pricePerPerson: 3600,
    rating: 4.89,
    reviewsCount: 84,
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Glacier Express Excellence Class Train", "Matterhorn Helicopter Sightseeing", "Alpine Ski Pass & Equipment", "Fondue & Wine Chalet Evenings"],
    included: ["5-Star Alpine Spa Resort", "Swiss First Class Travel Pass", "Helicopter Flight", "Guided Glacier Trek"],
    tag: "Scenic & Ski",
    featured: false,
  },
  {
    id: "pkg-5",
    title: "Bali Tropical Wellness & Overwater Sanctuaries",
    destination: "Ubud & Uluwatu, Indonesia",
    region: "Asia",
    category: "Wellness & Beach",
    durationDays: 9,
    pricePerPerson: 2150,
    rating: 4.91,
    reviewsCount: 210,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Jungle Infinity Pool Villa in Ubud", "Daily Holistic Yoga & Sound Healing", "Uluwatu Sunset Cliffside Dining", "Snorkeling with Manta Rays in Nusa Penida"],
    included: ["5-Star Luxury Eco-Resort", "Daily Spa Treatments", "Private Chauffeur", "All Breakfasts & Healthy Juice Bar"],
    tag: "Wellness Special",
    featured: false,
  },
  {
    id: "pkg-6",
    title: "Dubai Futuristic Glamour & Desert Dunes Safari",
    destination: "Dubai & Abu Dhabi, UAE",
    region: "Middle East",
    category: "City & Luxury",
    durationDays: 6,
    pricePerPerson: 2750,
    rating: 4.88,
    reviewsCount: 115,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Burj Khalifa VIP Sky Level Access", "Private Desert Oasis Dinner & Falconry", "Supercar City Tour", "Louvre Abu Dhabi Guided Visit"],
    included: ["5-Star Beachfront Resort", "VIP Fast Track Airport", "Luxury SUV Transfers", "Yacht Sunset Cruise"],
    tag: "Popular",
    featured: false,
  },
];

// Flights Mock Database
const MOCK_FLIGHTS = [
  {
    id: "fl-101",
    airline: "Aiden Global Air",
    airlineCode: "AG",
    flightNumber: "AG 402",
    origin: "JFK",
    originCity: "New York",
    destination: "LHR",
    destinationCity: "London",
    departureTime: "18:45",
    arrivalTime: "06:50 (+1)",
    duration: "7h 05m",
    stops: 0,
    price: 680,
    cabinClass: "Economy",
    aircraft: "Boeing 787-9 Dreamliner",
  },
  {
    id: "fl-102",
    airline: "Emirates",
    airlineCode: "EK",
    flightNumber: "EK 202",
    origin: "JFK",
    originCity: "New York",
    destination: "DXB",
    destinationCity: "Dubai",
    departureTime: "23:00",
    arrivalTime: "19:30 (+1)",
    duration: "12h 30m",
    stops: 0,
    price: 1120,
    cabinClass: "Economy",
    aircraft: "Airbus A380-800",
  },
  {
    id: "fl-103",
    airline: "Singapore Airlines",
    airlineCode: "SQ",
    flightNumber: "SQ 025",
    origin: "LAX",
    originCity: "Los Angeles",
    destination: "SIN",
    destinationCity: "Singapore",
    departureTime: "22:15",
    arrivalTime: "06:30 (+2)",
    duration: "17h 15m",
    stops: 0,
    price: 1450,
    cabinClass: "Premium Economy",
    aircraft: "Airbus A350-900ULR",
  },
  {
    id: "fl-104",
    airline: "Qatar Airways",
    airlineCode: "QR",
    flightNumber: "QR 738",
    origin: "SFO",
    originCity: "San Francisco",
    destination: "NBO",
    destinationCity: "Nairobi",
    departureTime: "16:10",
    arrivalTime: "03:45 (+2)",
    duration: "21h 35m",
    stops: 1,
    price: 1290,
    cabinClass: "Economy",
    aircraft: "Boeing 777-300ER",
  },
  {
    id: "fl-105",
    airline: "Aiden Global Air",
    airlineCode: "AG",
    flightNumber: "AG 881",
    origin: "LHR",
    originCity: "London",
    destination: "HND",
    destinationCity: "Tokyo",
    departureTime: "09:30",
    arrivalTime: "07:15 (+1)",
    duration: "13h 45m",
    stops: 0,
    price: 2100,
    cabinClass: "Business Class",
    aircraft: "Airbus A350-1000",
  },
];

// Hotels Mock Database
const MOCK_HOTELS = [
  {
    id: "ht-1",
    name: "The Grand Peacock Palace & Spa",
    city: "Kyoto",
    country: "Japan",
    rating: 4.9,
    stars: 5,
    pricePerNight: 420,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    amenities: ["Private Onsen", "Michelin Dining", "Free High-Speed WiFi", "Infinity Pool", "Concierge Service"],
    description: "Nestled against the Arashiyama bamboo forest, offering traditional Zen gardens and bespoke Japanese hospitality.",
  },
  {
    id: "ht-2",
    name: "Positano Cliffside Sanctuary Resort",
    city: "Positano",
    country: "Italy",
    rating: 4.96,
    stars: 5,
    pricePerNight: 650,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
    amenities: ["Panoramic Ocean Terrace", "Private Beach Access", "Heated Pool", "Sommelier Cellar"],
    description: "Perched dramatically above the Tyrrhenian Sea with unobstructed views of Positano's iconic pastel hillside.",
  },
  {
    id: "ht-3",
    name: "Four Seasons Serengeti Lodge",
    city: "Serengeti",
    country: "Tanzania",
    rating: 4.92,
    stars: 5,
    pricePerNight: 890,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    amenities: ["Waterhole View Pool", "Guided Bush Safaris", "Luxury Canvas Suites", "Spa Sanctuary"],
    description: "Watch elephants gather at the watering hole right from your private terrace elevated above the Serengeti plains.",
  },
  {
    id: "ht-4",
    name: "Aiden Signature Tower Suites",
    city: "Dubai",
    country: "UAE",
    rating: 4.88,
    stars: 5,
    pricePerNight: 380,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    amenities: ["Rooftop Sky Bar", "Private Helicopter Pad", "Spa & Wellness", "Beach Club Access"],
    description: "Ultra-luxurious suites in the heart of Downtown Dubai with direct views of the dancing fountains and Burj Khalifa.",
  },
];

// API Endpoints

// 1. Curated Packages API
app.get("/api/packages", (req, res) => {
  const { region, category, search } = req.query;
  let filtered = [...CURATED_PACKAGES];

  if (region && region !== "All") {
    filtered = filtered.filter((p) => p.region.toLowerCase() === String(region).toLowerCase());
  }
  if (category && category !== "All") {
    filtered = filtered.filter((p) => p.category.toLowerCase().includes(String(category).toLowerCase()));
  }
  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.destination.toLowerCase().includes(q) ||
        p.highlights.some((h) => h.toLowerCase().includes(q))
    );
  }

  res.json({ success: true, packages: filtered });
});

// 2. Flight Search API
app.get("/api/search-flights", (req, res) => {
  const { origin, destination, cabinClass } = req.query;
  let results = [...MOCK_FLIGHTS];

  if (origin) {
    const origStr = String(origin).toUpperCase();
    results = results.filter((f) => f.origin.includes(origStr) || f.originCity.toUpperCase().includes(origStr));
  }
  if (destination) {
    const destStr = String(destination).toUpperCase();
    results = results.filter((f) => f.destination.includes(destStr) || f.destinationCity.toUpperCase().includes(destStr));
  }
  if (cabinClass && cabinClass !== "All") {
    results = results.filter((f) => f.cabinClass.toLowerCase() === String(cabinClass).toLowerCase());
  }

  res.json({ success: true, flights: results });
});

// 3. Hotel Search API
app.get("/api/search-hotels", (req, res) => {
  const { city, maxPrice } = req.query;
  let results = [...MOCK_HOTELS];

  if (city) {
    const cStr = String(city).toLowerCase();
    results = results.filter((h) => h.city.toLowerCase().includes(cStr) || h.country.toLowerCase().includes(cStr));
  }
  if (maxPrice) {
    const max = Number(maxPrice);
    if (!isNaN(max)) {
      results = results.filter((h) => h.pricePerNight <= max);
    }
  }

  res.json({ success: true, hotels: results });
});

// 4. AI Trip Planner API (Powered by Gemini)
app.post("/api/plan-trip", async (req, res) => {
  try {
    const { destination, durationDays, budgetLevel, travelStyle, guests, interests, specialRequests } = req.body;

    if (!destination) {
      return res.status(400).json({ error: "Destination is required" });
    }

    const prompt = `You are the lead luxury travel designer and concierge for "Aiden Travel Solutions". 
Create a highly detailed, professional, and bespoke trip plan for a traveler visiting "${destination}".

Details:
- Duration: ${durationDays || 5} Days
- Budget Level: ${budgetLevel || "Luxury"}
- Travel Style: ${travelStyle || "Cultural & Relaxed"}
- Guest Count: ${guests || 2} persons
- Primary Interests: ${interests?.join(", ") || "Must-see highlights, local gastronomy, hidden gems"}
- Special Requests: ${specialRequests || "None"}

Respond strictly in valid JSON format with the following structure:
{
  "tripTitle": "Custom Title for the trip",
  "destination": "${destination}",
  "durationDays": ${durationDays || 5},
  "tagline": "Inspiring 1-sentence description",
  "estimatedTotalCostUSD": 3500,
  "costBreakdown": {
    "accommodation": 1800,
    "activities": 900,
    "dining": 500,
    "transfers": 300
  },
  "recommendedBestTime": "Best season to visit",
  "visaAndEntryTip": "Important visa requirement brief",
  "weatherForecastOverview": "Expected weather summary",
  "dayByDayItinerary": [
    {
      "day": 1,
      "title": "Day 1 Theme Title",
      "morning": "Morning activity detail",
      "afternoon": "Afternoon activity detail",
      "evening": "Evening dining & night highlight",
      "diningRecommendation": "Specific top restaurant name",
      "insiderTip": "A secret local tip"
    }
  ],
  "packingEssentials": ["Item 1", "Item 2", "Item 3", "Item 4"],
  "aidenExclusivePerks": ["Perk 1 (e.g. VIP Airport lounge access)", "Perk 2 (e.g. Room upgrade subject to availability)"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const jsonText = response.text || "{}";
    const itineraryData = JSON.parse(jsonText);

    res.json({
      success: true,
      itinerary: itineraryData,
    });
  } catch (error: any) {
    console.error("Error generating trip plan:", error);
    res.status(500).json({
      error: "Failed to generate AI trip plan. Please try again.",
      message: error.message,
    });
  }
});

// 5. AI Travel Concierge Assistant Chat API
app.post("/api/travel-concierge", async (req, res) => {
  try {
    const { question, context } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const systemInstruction = `You are Aiden, the chief AI Travel Assistant for "Aiden Travel Solutions" - a world-class travel agency.
You provide sophisticated, accurate, helpful, and courteous travel advice on destinations, visa guidance, currency tips, airport hacks, flight connections, custom itineraries, and luxury experiences.
Always sound warm, professional, and highly knowledgeable. Keep formatting clean with bullet points where appropriate.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Context: ${JSON.stringify(context || {})}\n\nUser Question: ${question}`,
      config: {
        systemInstruction,
      },
    });

    res.json({
      success: true,
      answer: response.text,
    });
  } catch (error: any) {
    console.error("Error in Travel Concierge:", error);
    res.status(500).json({
      error: "Concierge assistant experienced an issue. Please try again.",
      message: error.message,
    });
  }
});

// Serve frontend in dev / production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Aiden Travel Solutions server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
