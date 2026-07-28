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
    title: "Uganda Gorilla Habituation & Kibale Primate Trek",
    destination: "Bwindi Impenetrable & Kibale Forest, Uganda",
    region: "Uganda",
    category: "Gorilla & Primate Trekking",
    durationDays: 8,
    pricePerPerson: 3450,
    rating: 4.98,
    reviewsCount: 164,
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Exclusive 4-Hour Gorilla Habituation in Bwindi", "Kibale Chimpanzee Tracking", "Queen Elizabeth Tree-Climbing Lions", "Kazinga Channel Boat Cruise"],
    included: ["Gorilla & Chimp Permits ($1,700 Value)", "Luxury Eco-Lodge Stays", "Private 4x4 Land Cruiser with Driver-Guide", "All Park Fees & Meals"],
    tag: "Bestseller",
    featured: true,
  },
  {
    id: "pkg-2",
    title: "Serengeti Great Migration & Zanzibar Spice Beach",
    destination: "Serengeti NP, Ngorongoro & Zanzibar, Tanzania",
    region: "Tanzania",
    category: "Savanna Game Drives",
    durationDays: 10,
    pricePerPerson: 3850,
    rating: 4.95,
    reviewsCount: 142,
    image: "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Serengeti River Crossing Big 5 Safari", "Ngorongoro Crater Floor Game Drive", "Stone Town Cultural Walking Tour", "Private Beach Resort in Nungwi"],
    included: ["Five-Star Safari Camps & Beach Villas", "Internal Bush Flights", "All Meals & Fine Dining", "Park & Conservation Fees"],
    tag: "East Africa Classic",
    featured: true,
  },
  {
    id: "pkg-3",
    title: "Masai Mara Migration & Diani Beach Escape",
    destination: "Masai Mara & Diani Beach, Kenya",
    region: "Kenya",
    category: "Savanna Game Drives",
    durationDays: 7,
    pricePerPerson: 3200,
    rating: 4.94,
    reviewsCount: 118,
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Hot Air Balloon Ride over Masai Mara", "Big Five Tracking with Masai Guides", "Diani White Sand Coral Reef Snorkeling", "Giraffe Centre & Elephant Orphanage"],
    included: ["Boutique Tented Safari Camps", "Domestic Flights Nairobi-Mara-Diani", "Game Drives in 4x4 Land Cruiser", "All Meals"],
    tag: "Luxury Wildlife",
    featured: true,
  },
  {
    id: "pkg-4",
    title: "Rwanda Volcanoes Gorilla Trekking & Nyungwe Canopy",
    destination: "Volcanoes NP & Nyungwe Forest, Rwanda",
    region: "Rwanda",
    category: "Gorilla & Primate Trekking",
    durationDays: 6,
    pricePerPerson: 4200,
    rating: 4.97,
    reviewsCount: 92,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Mountain Gorilla Trek in Volcanoes NP", "Golden Monkey Tracking", "Nyungwe High-Altitude Canopy Walkway", "Kigali Genocide Memorial Private Tour"],
    included: ["Rwanda Gorilla Trekking Permit ($1,500)", "Five-Star Luxury Lodges", "Private VIP SUV Transfers", "Full Board Dining"],
    tag: "Exclusive VIP",
    featured: false,
  },
  {
    id: "pkg-5",
    title: "Mount Kilimanjaro Summit & Ngorongoro Explorer",
    destination: "Kilimanjaro & Ngorongoro, Tanzania",
    region: "Tanzania",
    category: "Kilimanjaro Expeditions",
    durationDays: 9,
    pricePerPerson: 2950,
    rating: 4.91,
    reviewsCount: 76,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Lemosho Route Summit Attempt (5,895m)", "Professional Mountain Guides & Porters", "Post-Climb Relaxation at Ngorongoro Lodge", "Crater Floor Big Five Safari"],
    included: ["All Mountain Camping & Gear Logistics", "High-Altitude Rescue Insurance", "National Park Fees & Oxygen", "All Meals"],
    tag: "Bucketlist Challenge",
    featured: false,
  },
  {
    id: "pkg-6",
    title: "Murchison Falls, Ziwa Rhinos & Nile Source Adventure",
    destination: "Murchison Falls, Ziwa & Jinja, Uganda",
    region: "Uganda",
    category: "Cultural & Nile Adventures",
    durationDays: 5,
    pricePerPerson: 2350,
    rating: 4.93,
    reviewsCount: 105,
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Ziwa Rhino Sanctuary On-Foot Tracking", "Murchison Falls Top-of-Falls & Nile Boat Cruise", "Chimpanzee Trekking in Budongo", "Grade 5 White Water Rafting in Jinja"],
    included: ["Luxury Riverfront Lodges", "Private Pop-up Safari Vehicle", "Boat Safari & Rafting Equipment", "All Park Permits"],
    tag: "Uganda Highlight",
    featured: false,
  },
];

// Flights Mock Database
const MOCK_FLIGHTS = [
  {
    id: "fl-101",
    airline: "Uganda Airlines",
    airlineCode: "UR",
    flightNumber: "UR 202",
    origin: "EBB",
    originCity: "Entebbe / Kampala",
    destination: "NBO",
    destinationCity: "Nairobi",
    departureTime: "06:00",
    arrivalTime: "07:15",
    duration: "1h 15m",
    stops: 0,
    price: 240,
    cabinClass: "Economy",
    aircraft: "CRJ-900 Bombardier",
  },
  {
    id: "fl-102",
    airline: "Kenya Airways",
    airlineCode: "KQ",
    flightNumber: "KQ 412",
    origin: "NBO",
    originCity: "Nairobi",
    destination: "JRO",
    destinationCity: "Kilimanjaro / Arusha",
    departureTime: "10:30",
    arrivalTime: "11:25",
    duration: "0h 55m",
    stops: 0,
    price: 195,
    cabinClass: "Economy",
    aircraft: "Embraer E190",
  },
  {
    id: "fl-103",
    airline: "RwandAir",
    airlineCode: "WB",
    flightNumber: "WB 430",
    origin: "KGL",
    originCity: "Kigali",
    destination: "EBB",
    destinationCity: "Entebbe / Kampala",
    departureTime: "14:15",
    arrivalTime: "15:10",
    duration: "0h 55m",
    stops: 0,
    price: 180,
    cabinClass: "Economy",
    aircraft: "Boeing 737-800",
  },
  {
    id: "fl-104",
    airline: "Qatar Airways",
    airlineCode: "QR",
    flightNumber: "QR 1385",
    origin: "DOH",
    originCity: "Doha",
    destination: "EBB",
    destinationCity: "Entebbe",
    departureTime: "01:50",
    arrivalTime: "07:30",
    duration: "5h 40m",
    stops: 0,
    price: 650,
    cabinClass: "Economy",
    aircraft: "Boeing 787-8 Dreamliner",
  },
  {
    id: "fl-105",
    airline: "Uganda Airlines",
    airlineCode: "UR",
    flightNumber: "UR 401",
    origin: "EBB",
    originCity: "Entebbe",
    destination: "DXB",
    destinationCity: "Dubai",
    departureTime: "22:00",
    arrivalTime: "04:30 (+1)",
    duration: "5h 30m",
    stops: 0,
    price: 520,
    cabinClass: "Business Class",
    aircraft: "Airbus A330-800neo",
  },
];

// Hotels Mock Database
const MOCK_HOTELS = [
  {
    id: "ht-1",
    name: "Sanctuary Gorilla Forest Camp",
    city: "Bwindi Impenetrable NP",
    country: "Uganda",
    rating: 4.96,
    stars: 5,
    pricePerNight: 850,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    amenities: ["In-Forest Luxury Tents", "Private Gorilla Escort", "Spa & Wellness", "Gourmet Dining"],
    description: "Located deep inside Bwindi Impenetrable Forest where wild gorilla families frequently wander directly into the lodge grounds.",
  },
  {
    id: "ht-2",
    name: "Four Seasons Safari Lodge Serengeti",
    city: "Serengeti NP",
    country: "Tanzania",
    rating: 4.92,
    stars: 5,
    pricePerNight: 890,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    amenities: ["Waterhole View Pool", "Guided Bush Safaris", "Luxury Canvas Suites", "Spa Sanctuary"],
    description: "Watch elephants gather at the watering hole right from your private terrace elevated above the Serengeti plains.",
  },
  {
    id: "ht-3",
    name: "Angama Mara Luxury Cliffside Lodge",
    city: "Masai Mara",
    country: "Kenya",
    rating: 4.98,
    stars: 5,
    pricePerNight: 980,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
    amenities: ["300m Cliffside Panorama", "Private Airfield", "Hot Air Balloon Launchpad", "Personal Butler"],
    description: "Perched high on the rim of the Great Rift Valley overlooking the Masai Mara where 'Out of Africa' was filmed.",
  },
  {
    id: "ht-4",
    name: "One&Only Gorilla's Nest",
    city: "Volcanoes National Park",
    country: "Rwanda",
    rating: 4.99,
    stars: 5,
    pricePerNight: 1450,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    amenities: ["Treehouse Luxury Villas", "Eucalyptus Forest Spa", "Gorilla Trek Specialist Hub", "Michelin Dining"],
    description: "Cradled in a fragrant eucalyptus canopy at the foothills of the Virunga Volcanoes.",
  },
  {
    id: "ht-5",
    name: "Kampala Serena Hotel & Botanical Gardens",
    city: "Kampala",
    country: "Uganda",
    rating: 4.88,
    stars: 5,
    pricePerNight: 280,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    amenities: ["7-Acre Tropical Gardens", "Maisha Health Spa", "Fine Dining Restaurants", "Executive Lounge"],
    description: "An oasis of serene luxury and East African hospitality in the heart of Uganda's capital city.",
  },
  {
    id: "ht-6",
    name: "Park Hyatt Zanzibar",
    city: "Stone Town, Zanzibar",
    country: "Tanzania",
    rating: 4.94,
    stars: 5,
    pricePerNight: 460,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
    amenities: ["Oceanfront Infinity Pool", "Heritage UNESCO Architecture", "Anantara Spa", "Sunset Dhow Cruises"],
    description: "Located on the beachfront of historic Stone Town, blending Swahili heritage with unmatched beach luxury.",
  },
];

// Uganda Car Rental Fleet Database
const UGANDA_CAR_FLEET = [
  {
    id: "car-ug-1",
    name: "Toyota HiAce 'Drone' VIP Safari Minibus 4WD",
    type: "Van / Supercustom",
    driveType: "Chauffeur / Driver-Guide",
    transmission: "Automatic",
    capacity: "8 to 14 Passengers",
    pricePerDayUSD: 90,
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
    pickupLocations: ["Entebbe International Airport (EBB)", "Kampala City Hub", "Jinja"],
    features: ["High-Roof 'Drone' Body Spec", "Optional Pop-up Safari Hatch", "AC & Reclining Velvet Seats", "PA Speaker Microphone System", "Experienced Driver-Guide Included"],
    popularFor: "Group Family Safaris, Ziwa Rhino Trips, Jinja Nile Tours & Airport Transfers",
    campingGearAvailable: false,
  },
  {
    id: "car-ug-2",
    name: "Toyota Land Cruiser Prado TX / VX 4x4",
    type: "SUV",
    driveType: "Self-Drive",
    transmission: "Automatic",
    capacity: "5 Passengers",
    pricePerDayUSD: 80,
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
    pickupLocations: ["Entebbe International Airport (EBB)", "Kampala City Hub", "Jinja", "Mbarara", "Bwindi / Kabale"],
    features: ["Full-Time 4WD with Low Range", "Rooftop Tent Compatible", "Sub-tank for long 800km Range", "Dual Air Conditioning", "USB & Bluetooth Audio"],
    popularFor: "Self-Drive Gorilla Trekking in Bwindi, Queen Elizabeth NP & Lake Bunyonyi",
    campingGearAvailable: true,
  },
  {
    id: "car-ug-3",
    name: "Toyota Alphard Executive Luxury MPV",
    type: "Executive MPV",
    driveType: "Chauffeur / Driver-Guide",
    transmission: "Automatic",
    capacity: "7 Passengers",
    pricePerDayUSD: 75,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    pickupLocations: ["Entebbe International Airport (EBB)", "Kampala City Hub"],
    features: ["Captain Reclining Lounge Chairs", "Dual Power Sliding Doors", "Dual Zone Climate Control", "Rear Entertainment Screen", "Ultra-Smooth Air Suspension"],
    popularFor: "Kampala Executive City Travel, VIP Airport Transfers at Entebbe, Weddings & Business Delegations",
    campingGearAvailable: false,
  },
  {
    id: "car-ug-4",
    name: "Toyota Harrier (2006 Model) 4WD SUV",
    type: "Compact 4x4",
    driveType: "Self-Drive",
    transmission: "Automatic",
    capacity: "5 Passengers",
    pricePerDayUSD: 50,
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
    pickupLocations: ["Entebbe International Airport (EBB)", "Kampala City Hub", "Entebbe Town"],
    features: ["Real-time 4WD Drive System", "Comfortable Leather Interior", "Strong 2.4L Engine", "Ice-Cold Air Conditioning", "Paved & Light Gravel Roads"],
    popularFor: "Budget Self-Drive across Kampala, Jinja Source of the Nile, Fort Portal & Entebbe",
    campingGearAvailable: true,
  },
  {
    id: "car-ug-5",
    name: "Toyota Corolla Fielder Station Wagon",
    type: "Compact 4x4",
    driveType: "Self-Drive",
    transmission: "Automatic",
    capacity: "5 Passengers",
    pricePerDayUSD: 35,
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80",
    pickupLocations: ["Entebbe International Airport (EBB)", "Kampala City Hub"],
    features: ["Ultra Fuel Efficient (15-18 km/L)", "Large Rear Boot Cargo Area", "Smooth Automatic Shift", "AC & Power Windows", "Economical City Runner"],
    popularFor: "Kampala City errands, Entebbe town commutes, Short trips & budget self-drive",
    campingGearAvailable: false,
  },
  {
    id: "car-ug-6",
    name: "Toyota Land Cruiser 70 Series Safari Spec Hardtop",
    type: "4x4 Safari Spec",
    driveType: "Both Options",
    transmission: "Manual",
    capacity: "7 Passengers",
    pricePerDayUSD: 165,
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    pickupLocations: ["Entebbe International Airport (EBB)", "Kampala City Hub", "Bwindi / Kabale"],
    features: ["Pop-up Safari Roof", "3.5L V6 Heavy Duty Diesel Engine", "Dual Fuel Tanks (180L Range)", "In-Car Electric Refrigerator", "High Ground Clearance & Winch"],
    popularFor: "Extreme Wilderness Safaris to Kidepo Valley, Bwindi Gorilla Trekking & Murchison Falls",
    campingGearAvailable: true,
  },
];

// Current Uganda Live Fuel Prices Database (Kampala & Entebbe Stations)
const UGANDA_FUEL_PRICES = {
  lastUpdated: "Today (Live Uganda Station Benchmark)",
  stations: ["Shell Uganda", "TotalEnergies Uganda", "Stabex International", "Rubis Energy"],
  currencies: {
    UGX: { symbol: "UGX", rateToUSD: 3700 },
    USD: { symbol: "$", rateToUSD: 1 },
    EUR: { symbol: "€", rateToUSD: 0.92 },
  },
  petrolPerLitre: {
    UGX: 5400,
    USD: 1.46,
    EUR: 1.34,
  },
  dieselPerLitre: {
    UGX: 5100,
    USD: 1.38,
    EUR: 1.27,
  },
  kerosenePerLitre: {
    UGX: 4600,
    USD: 1.24,
    EUR: 1.14,
  }
};

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

// 3.5. Uganda Car Rental Search API
app.get("/api/search-cars", (req, res) => {
  const { driveType, vehicleType, campingGearOnly, search } = req.query;
  let results = [...UGANDA_CAR_FLEET];

  if (driveType && driveType !== "All") {
    results = results.filter((c) => c.driveType === "Both Options" || c.driveType.toLowerCase().includes(String(driveType).toLowerCase()));
  }

  if (vehicleType && vehicleType !== "All") {
    results = results.filter((c) => c.type.toLowerCase().includes(String(vehicleType).toLowerCase()));
  }

  if (campingGearOnly === "true") {
    results = results.filter((c) => c.campingGearAvailable);
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.popularFor.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, cars: results, fuelPrices: UGANDA_FUEL_PRICES });
});

// 3.6. Uganda Live Fuel Prices API
app.get("/api/uganda-fuel-prices", (req, res) => {
  res.json({ success: true, fuelPrices: UGANDA_FUEL_PRICES });
});

// 4. AI Trip Planner API (Powered by Gemini)
app.post("/api/plan-trip", async (req, res) => {
  try {
    const { destination, durationDays, budgetLevel, travelStyle, guests, interests, specialRequests } = req.body;

    if (!destination) {
      return res.status(400).json({ error: "Destination is required" });
    }

    const prompt = `You are the lead luxury travel designer and East Africa specialist for "Aiden Travel Solutions". 
Create a highly detailed, professional, and bespoke trip plan for a traveler visiting "${destination}" within East Africa (Uganda, Kenya, Tanzania, Rwanda, Burundi, South Sudan).

Details:
- Duration: ${durationDays || 5} Days
- Budget Level: ${budgetLevel || "Luxury"}
- Travel Style: ${travelStyle || "Gorilla Trekking & Wildlife Safari"}
- Guest Count: ${guests || 2} persons
- Primary Interests: ${interests?.join(", ") || "Wildlife game drives, primate tracking, cultural encounters, luxury lodges"}
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
  "recommendedBestTime": "Best season to visit in East Africa",
  "visaAndEntryTip": "Important East African visa requirement (e.g. East Africa Tourist Visa or eVisa details)",
  "weatherForecastOverview": "Expected weather summary",
  "dayByDayItinerary": [
    {
      "day": 1,
      "title": "Day 1 Theme Title",
      "morning": "Morning activity detail",
      "afternoon": "Afternoon activity detail",
      "evening": "Evening dining & night highlight",
      "diningRecommendation": "Specific top lodge / restaurant name in East Africa",
      "insiderTip": "A secret local tip from our East Africa experts"
    }
  ],
  "packingEssentials": ["Item 1", "Item 2", "Item 3", "Item 4"],
  "aidenExclusivePerks": ["Perk 1 (e.g. Complimentary Entebbe/Nairobi VIP Airport Lounge)", "Perk 2 (e.g. Free rooftop tent or room upgrade)"]
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

    const systemInstruction = `You are Aiden, the chief East Africa Travel Specialist & Concierge for "Aiden Travel Solutions" - the premier travel agency based in Uganda covering East Africa (Uganda, Kenya, Tanzania, Rwanda, Burundi, South Sudan).
You provide sophisticated, accurate, helpful, and courteous travel advice on East African destinations, national park permits (gorilla, chimpanzee), East Africa Tourist Visas (EATV), COMESA border crossings, 4x4 self-drive and chauffeur rentals, flight connections, and luxury safari lodges.
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
