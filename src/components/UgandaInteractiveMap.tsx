import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Car, ShieldCheck, Info, CheckCircle2, Fuel, ArrowRight, Zap, RefreshCw } from 'lucide-react';

interface LocationHub {
  id: string;
  name: string;
  code: string;
  type: 'airport' | 'city' | 'safari';
  x: number; // percentage coordinate for SVG map
  y: number; // percentage coordinate for SVG map
  description: string;
  availableFleetCount: number;
  perks: string[];
  popularFor: string;
}

interface SafariRoute {
  id: string;
  name: string;
  distanceKm: number;
  durationDays: string;
  roadCondition: string;
  recommendedVehicles: string[];
  stops: { name: string; x: number; y: number; detail: string }[];
  highlights: string[];
  svgPath: string; // SVG path string connecting nodes
  color: string;
}

const PICKUP_HUBS: LocationHub[] = [
  {
    id: 'ebb',
    name: 'Entebbe International Airport',
    code: 'EBB',
    type: 'airport',
    x: 52,
    y: 72,
    description: 'Primary international gateway. Free 24/7 meet & greet at arrivals, vehicle handover right at terminal exit.',
    availableFleetCount: 18,
    perks: ['Free Airport Pick-up & Drop-off', 'Instant Flight Tracking', '24/7 Terminal Delivery'],
    popularFor: 'Immediate arrival handovers for all international safari guests'
  },
  {
    id: 'kmp',
    name: 'Kampala Central City Hub',
    code: 'KLA',
    type: 'city',
    x: 54,
    y: 67,
    description: 'Capital city headquarters. Doorstep delivery to any hotel in Nakasero, Kololo, Bugolobi, or Munyonyo.',
    availableFleetCount: 22,
    perks: ['Hotel Doorstep Handover', 'Free GPS Unit', 'City Driving Orientation'],
    popularFor: 'Business travel, Alphard transfers & starting point for Northern/Eastern safaris'
  },
  {
    id: 'jnj',
    name: 'Jinja Source of the Nile Hub',
    code: 'JNJ',
    type: 'city',
    x: 68,
    y: 65,
    description: 'Eastern region hub on the shores of Lake Victoria and Source of the Nile River.',
    availableFleetCount: 8,
    perks: ['Nile Lodge Delivery', 'Rafting Gear Storage', 'Cross-Border Busia Permit Setup'],
    popularFor: 'White-water rafting, quad biking, Sipi Falls & Elgon climbing'
  },
  {
    id: 'mbr',
    name: 'Mbarara Highway Transit Hub',
    code: 'MBR',
    type: 'city',
    x: 35,
    y: 78,
    description: 'South-Western commercial capital. Strategic stopover on the Mbarara-Kabale highway.',
    availableFleetCount: 10,
    perks: ['Mid-trip Vehicle Swap Support', '24/7 Emergency Mechanic Unit', 'Fresh Supplies Point'],
    popularFor: 'Gateway to Lake Mburo, Queen Elizabeth & Bwindi'
  },
  {
    id: 'bwd',
    name: 'Bwindi / Kabale Safari Base',
    code: 'BWD',
    type: 'safari',
    x: 22,
    y: 88,
    description: 'Gorilla trekking base. Located near Buhoma, Ruhija, Rushaga, and Nkuringo sectors.',
    availableFleetCount: 12,
    perks: ['Gorilla Permit Assistance', 'Offroad 4x4 Recovery Unit', 'Lodge Return Handover'],
    popularFor: 'Gorilla habituation safaris & Lake Bunyonyi relaxation'
  },
  {
    id: 'glu',
    name: 'Gulu Northern Hub',
    code: 'GLU',
    type: 'city',
    x: 48,
    y: 30,
    description: 'Northern hub serving Kidepo Valley National Park and Murchison Falls North.',
    availableFleetCount: 6,
    perks: ['Kidepo Range Fuel Prep', 'Long Distance Sub-tank Inspection', 'Local Karamojong Guide Pairing'],
    popularFor: 'Kidepo extreme wilderness expeditions & South Sudan / Karamoja transit'
  }
];

const SAFARI_ROUTES: SafariRoute[] = [
  {
    id: 'gorilla-western',
    name: 'Grand Gorilla & Western Savanna Circuit',
    distanceKm: 1250,
    durationDays: '8 - 12 Days',
    roadCondition: 'Paved Highways + Smooth Murram',
    recommendedVehicles: ['Land Cruiser Prado TX/VX 4x4', 'Land Cruiser 70 Series Safari Spec', 'Toyota Harrier 2006'],
    color: '#0D3B2B',
    svgPath: 'M 52 72 L 54 67 L 35 78 L 22 88 L 18 78 L 28 65 L 54 67',
    highlights: [
      'Bwindi Impenetrable Mountain Gorillas',
      'Tree-climbing Lions in Ishasha (Queen Elizabeth NP)',
      'Chimpanzee Tracking in Kibale Forest',
      'Canoeing on Lake Bunyonyi'
    ],
    stops: [
      { name: 'Entebbe / Kampala Start', x: 52, y: 72, detail: 'Vehicle inspection & briefing' },
      { name: 'Lake Mburo NP', x: 42, y: 75, detail: 'Zebras, Elands & impala game drive' },
      { name: 'Bwindi Gorilla Forest', x: 22, y: 88, detail: 'Gorilla trekking sector (Buhoma/Rushaga)' },
      { name: 'Queen Elizabeth NP', x: 18, y: 78, detail: 'Kazinga Channel boat cruise & savanna' },
      { name: 'Kibale Primate Forest', x: 28, y: 65, detail: 'Chimp tracking & crater lakes' },
      { name: 'Entebbe Return', x: 52, y: 72, detail: 'Free airport drop-off' }
    ]
  },
  {
    id: 'murchison-rhino',
    name: 'Murchison Falls & Ziwa Rhino Expedition',
    distanceKm: 750,
    durationDays: '3 - 5 Days',
    roadCondition: 'Paved Expressways + Park Murram',
    recommendedVehicles: ['Toyota HiAce "Drone" VIP Minibus', 'Land Cruiser Prado TX/VX', 'Toyota Harrier 2006'],
    color: '#E88B23',
    svgPath: 'M 52 72 L 54 67 L 48 52 L 36 42 L 54 67',
    highlights: [
      'Rhino Tracking on Foot at Ziwa Sanctuary',
      'Top of Murchison Falls (Nile Squeeze Gap)',
      'Big Game Savanna Safari (Giraffes, Elephants, Lions)',
      'Nile Delta Boat Safari to Murchison Base'
    ],
    stops: [
      { name: 'Kampala / Entebbe Start', x: 54, y: 67, detail: 'Early morning 6:00 AM departure' },
      { name: 'Ziwa Rhino Sanctuary', x: 48, y: 52, detail: 'Guided foot trek with white rhinos' },
      { name: 'Murchison Falls NP', x: 36, y: 42, detail: 'Game drives & Nile river launch cruise' },
      { name: 'Entebbe Return', x: 52, y: 72, detail: 'Return via Luweero highway' }
    ]
  },
  {
    id: 'nile-sipi',
    name: 'Source of the Nile & Sipi Falls Adventure',
    distanceKm: 580,
    durationDays: '3 - 4 Days',
    roadCondition: 'Paved Highways + Mountain Roads',
    recommendedVehicles: ['Toyota Harrier 2006 4WD', 'Toyota Alphard Executive', 'Toyota Corolla Fielder'],
    color: '#2563EB',
    svgPath: 'M 54 67 L 68 65 L 82 55 L 54 67',
    highlights: [
      'Boat cruise to official Source of the Nile River',
      'White-water rafting Grade 5 rapids in Jinja',
      'Abseiling & coffee tasting at Sipi Falls (Mount Elgon)',
      'Mabira Rainforest ziplining'
    ],
    stops: [
      { name: 'Kampala Hub', x: 54, y: 67, detail: 'Drive through Mabira forest' },
      { name: 'Jinja Nile Source', x: 68, y: 65, detail: 'Boat ride & Jinja city tour' },
      { name: 'Sipi Falls (Kapchorwa)', x: 82, y: 55, detail: '3-stage waterfall hike & Elgon vistas' },
      { name: 'Kampala / Entebbe Return', x: 52, y: 72, detail: 'Smooth paved drive back' }
    ]
  },
  {
    id: 'kidepo-remote',
    name: 'Kidepo Valley Extreme Wilderness Trail',
    distanceKm: 1450,
    durationDays: '6 - 8 Days',
    roadCondition: 'Rugged 4x4 Offroad Murram',
    recommendedVehicles: ['Land Cruiser 70 Series Safari Hardtop', 'Land Cruiser Prado TX/VX 4x4'],
    color: '#D97706',
    svgPath: 'M 54 67 L 48 52 L 48 30 L 62 18 L 68 65 L 54 67',
    highlights: [
      'Vast Narus & Kidepo Valley Savannas',
      'Lions on Kopjes, Cheetahs & Large Ostrich Flocks',
      'Karamojong Cultural Boma Tours',
      'Pian Upe Game Reserve Wilderness'
    ],
    stops: [
      { name: 'Kampala Start', x: 54, y: 67, detail: 'Equipped with dual spare tires & cooler box' },
      { name: 'Ziwa / Karuma Transit', x: 48, y: 52, detail: 'Refuel at Shell Karuma' },
      { name: 'Gulu Town Hub', x: 48, y: 30, detail: 'Overnight rest & final supplies check' },
      { name: 'Kidepo Valley NP', x: 62, y: 18, detail: 'Unspoiled African savanna wilderness' },
      { name: 'Pian Upe & Jinja Return', x: 68, y: 65, detail: 'Return circuit via Eastern route' }
    ]
  }
];

interface Props {
  onSelectHub?: (hubName: string) => void;
  onSelectRouteFuel?: (routeKey: string) => void;
}

export const UgandaInteractiveMap: React.FC<Props> = ({ onSelectHub, onSelectRouteFuel }) => {
  const [activeTab, setActiveTab] = useState<'hubs' | 'routes'>('hubs');
  const [selectedHub, setSelectedHub] = useState<LocationHub>(PICKUP_HUBS[0]);
  const [selectedRoute, setSelectedRoute] = useState<SafariRoute>(SAFARI_ROUTES[0]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#E88B23]" />
            <h3 className="text-xl font-bold font-serif text-gray-900">Interactive Uganda Map & Safari Routes</h3>
            <span className="bg-emerald-100 text-emerald-950 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
              Live Map View
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Click on pick-up hubs or tourist routes below to explore delivery locations, road terrain, and vehicle suitability.
          </p>
        </div>

        {/* Mode Toggle Buttons */}
        <div className="flex bg-gray-100 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('hubs')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'hubs'
                ? 'bg-[#0D3B2B] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-[#E88B23]" /> Pick-up Hubs ({PICKUP_HUBS.length})
          </button>

          <button
            onClick={() => setActiveTab('routes')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'routes'
                ? 'bg-[#0D3B2B] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Navigation className="w-3.5 h-3.5 text-[#E88B23]" /> Tourist Safari Routes ({SAFARI_ROUTES.length})
          </button>
        </div>
      </div>

      {/* Main Map Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Interactive Map Container */}
        <div className="lg:col-span-7 bg-gradient-to-br from-emerald-950 via-[#07241a] to-emerald-900 text-white rounded-3xl p-6 relative min-h-[440px] sm:min-h-[500px] flex flex-col justify-between overflow-hidden shadow-inner border border-emerald-800">
          {/* Map Title & Legend Overlay */}
          <div className="relative z-10 flex items-center justify-between text-xs font-semibold text-emerald-200">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>UGANDA MAP CANVI</span>
            </div>

            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E88B23]" /> Hubs
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-blue-400" /> Lakes / Nile
              </span>
            </div>
          </div>

          {/* SVG Map Graphics */}
          <div className="absolute inset-0 w-full h-full p-4 sm:p-8">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              <defs>
                {/* Glow Filter for Active Nodes */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Uganda Border Outline Silhouette */}
              <path
                d="M 30 15 Q 45 10 65 12 Q 85 15 88 35 Q 92 50 82 65 Q 75 75 60 82 Q 40 92 20 88 Q 12 75 18 55 Q 15 35 30 15 Z"
                fill="#0A2D21"
                stroke="#1B4D3E"
                strokeWidth="1"
                strokeDasharray="2,2"
              />

              {/* Lake Victoria (South) */}
              <path
                d="M 45 76 Q 60 74 72 82 Q 78 95 62 98 Q 48 95 45 76 Z"
                fill="#1E3A8A"
                opacity="0.5"
              />

              {/* Lake Kyoga (Central) */}
              <path
                d="M 52 50 Q 64 48 70 52 Q 62 55 52 50 Z"
                fill="#1E3A8A"
                opacity="0.4"
              />

              {/* Lake Albert (West) */}
              <path
                d="M 22 45 Q 28 35 34 42 Q 28 52 22 45 Z"
                fill="#1E3A8A"
                opacity="0.4"
              />

              {/* Source of the Nile River Line */}
              <path
                d="M 68 65 Q 60 55 52 50 Q 45 48 38 42"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="1"
                opacity="0.6"
              />

              {/* SAFARI ROUTE POLYLINES (when in 'routes' mode or highlighted) */}
              {activeTab === 'routes' && (
                <>
                  {/* Background All Routes Dimmed */}
                  {SAFARI_ROUTES.map((route) => (
                    <path
                      key={`bg-${route.id}`}
                      d={route.svgPath}
                      fill="none"
                      stroke={route.id === selectedRoute.id ? route.color : '#154837'}
                      strokeWidth={route.id === selectedRoute.id ? '2.5' : '1'}
                      strokeDasharray={route.id === selectedRoute.id ? 'none' : '2,2'}
                      opacity={route.id === selectedRoute.id ? 1 : 0.4}
                      filter={route.id === selectedRoute.id ? 'url(#glow)' : undefined}
                      className="transition-all duration-300"
                    />
                  ))}

                  {/* Route Stop Sequence Markers */}
                  {selectedRoute.stops.map((stop, idx) => (
                    <g key={`stop-${idx}`} transform={`translate(${stop.x}, ${stop.y})`}>
                      <circle
                        r="3"
                        fill={selectedRoute.color}
                        stroke="#ffffff"
                        strokeWidth="0.8"
                        className="animate-pulse"
                      />
                      <text
                        x="4"
                        y="1.5"
                        fill="#E2E8F0"
                        fontSize="2.8"
                        fontWeight="bold"
                        className="pointer-events-none select-none font-sans"
                      >
                        {idx + 1}. {stop.name}
                      </text>
                    </g>
                  ))}
                </>
              )}

              {/* LOCATION HUBS PINS */}
              {PICKUP_HUBS.map((hub) => {
                const isSelected = activeTab === 'hubs' && selectedHub.id === hub.id;
                const isHovered = hoveredNode === hub.id;

                return (
                  <g
                    key={hub.id}
                    transform={`translate(${hub.x}, ${hub.y})`}
                    onClick={() => {
                      setSelectedHub(hub);
                      if (onSelectHub) onSelectHub(hub.name);
                    }}
                    onMouseEnter={() => setHoveredNode(hub.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    className="cursor-pointer group"
                  >
                    {/* Pulsing Outer Ring for Airport / Selected */}
                    {(isSelected || hub.type === 'airport' || isHovered) && (
                      <circle
                        r="5"
                        fill="#E88B23"
                        opacity="0.3"
                        className="animate-ping"
                      />
                    )}

                    {/* Main Node Pin Circle */}
                    <circle
                      r={isSelected ? '3.5' : '2.8'}
                      fill={isSelected ? '#E88B23' : hub.type === 'airport' ? '#F59E0B' : '#10B981'}
                      stroke="#FFFFFF"
                      strokeWidth="0.8"
                      className="transition-all duration-200 group-hover:scale-125"
                    />

                    {/* Node Text Label */}
                    <text
                      x="4"
                      y="1"
                      fill={isSelected ? '#FDE047' : '#FFFFFF'}
                      fontSize="2.8"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      className="pointer-events-none select-none font-sans drop-shadow-xs"
                    >
                      {hub.code}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Interactive Map Footer Quick Switch Bar */}
          <div className="relative z-10 bg-emerald-900/80 backdrop-blur-md p-3 rounded-2xl border border-emerald-700/60 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-200">
              <Zap className="w-3.5 h-3.5 text-[#E88B23]" />
              <span className="font-semibold">
                {activeTab === 'hubs'
                  ? `Selected Hub: ${selectedHub.name}`
                  : `Selected Circuit: ${selectedRoute.name}`}
              </span>
            </div>

            <button
              onClick={() => {
                if (activeTab === 'hubs') {
                  const nextIdx = (PICKUP_HUBS.findIndex(h => h.id === selectedHub.id) + 1) % PICKUP_HUBS.length;
                  setSelectedHub(PICKUP_HUBS[nextIdx]);
                } else {
                  const nextIdx = (SAFARI_ROUTES.findIndex(r => r.id === selectedRoute.id) + 1) % SAFARI_ROUTES.length;
                  setSelectedRoute(SAFARI_ROUTES[nextIdx]);
                }
              }}
              className="bg-emerald-800 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-colors"
            >
              Next Pin <ArrowRight className="w-3 h-3 text-[#E88B23]" />
            </button>
          </div>
        </div>

        {/* Dynamic Detail Card Side Panel */}
        <div className="lg:col-span-5 space-y-4">
          {activeTab === 'hubs' ? (
            /* HUB DETAIL CARD */
            <div className="bg-emerald-50/60 rounded-3xl border border-emerald-200 p-6 space-y-4 shadow-xs">
              <div className="flex items-start justify-between gap-2 border-b border-emerald-200 pb-3">
                <div>
                  <span className="bg-[#0D3B2B] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {selectedHub.type.toUpperCase()} DELIVERY HUB
                  </span>
                  <h4 className="text-xl font-bold font-serif text-gray-900 mt-1">{selectedHub.name}</h4>
                  <p className="text-xs text-emerald-900 font-semibold flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#E88B23]" /> Station Code: {selectedHub.code} • {selectedHub.availableFleetCount} Vehicles Available
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-700 leading-relaxed">
                {selectedHub.description}
              </p>

              {/* Perks List */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Hub Station Services:</span>
                <div className="space-y-1 text-xs">
                  {selectedHub.perks.map((perk, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-800 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-emerald-200/80 text-xs space-y-1">
                <span className="font-bold text-[#0D3B2B] block">Popular Use Case:</span>
                <p className="text-gray-600">{selectedHub.popularFor}</p>
              </div>

              {/* Direct Filter Action */}
              <button
                onClick={() => {
                  if (onSelectHub) onSelectHub(selectedHub.name);
                }}
                className="w-full bg-[#0D3B2B] hover:bg-[#08291e] text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                Select {selectedHub.code} as My Pick-up Station <ArrowRight className="w-4 h-4 text-[#E88B23]" />
              </button>
            </div>
          ) : (
            /* ROUTE DETAIL CARD */
            <div className="bg-amber-50/60 rounded-3xl border border-amber-200 p-6 space-y-4 shadow-xs">
              <div className="border-b border-amber-200 pb-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="bg-[#E88B23] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    SAFARI CIRCUIT
                  </span>
                  <span className="text-xs font-bold text-gray-700">
                    {selectedRoute.distanceKm} KM • {selectedRoute.durationDays}
                  </span>
                </div>
                <h4 className="text-xl font-bold font-serif text-gray-900">{selectedRoute.name}</h4>
              </div>

              {/* Road Condition Badge */}
              <div className="bg-white p-3 rounded-2xl border border-amber-200/80 text-xs flex items-center justify-between">
                <span className="text-gray-500 font-bold">Road Surface:</span>
                <span className="font-bold text-[#0D3B2B]">{selectedRoute.roadCondition}</span>
              </div>

              {/* Highlights */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Circuit Highlights:</span>
                <div className="grid grid-cols-1 gap-1 text-xs">
                  {selectedRoute.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-gray-800 font-medium">
                      <span className="text-[#E88B23] font-bold">★</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Fleet */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Recommended 4x4 Fleet:</span>
                <div className="flex flex-wrap gap-1 text-[11px]">
                  {selectedRoute.recommendedVehicles.map((v, i) => (
                    <span key={i} className="bg-white text-emerald-950 font-bold px-2.5 py-1 rounded-lg border border-amber-200">
                      🚘 {v}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sync Fuel Estimator */}
              {onSelectRouteFuel && (
                <button
                  onClick={() => {
                    if (selectedRoute.id === 'gorilla-western') onSelectRouteFuel('bwindi');
                    else if (selectedRoute.id === 'murchison-rhino') onSelectRouteFuel('murchison');
                    else if (selectedRoute.id === 'nile-sipi') onSelectRouteFuel('custom');
                    else if (selectedRoute.id === 'kidepo-remote') onSelectRouteFuel('kidepo');
                  }}
                  className="w-full bg-[#E88B23] hover:bg-amber-600 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  <Fuel className="w-4 h-4" /> Calculate Fuel Cost for this Circuit
                </button>
              )}
            </div>
          )}

          {/* Quick Route Selector List */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              {activeTab === 'hubs' ? 'Select Pick-Up Location:' : 'Select Tourist Circuit:'}
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {activeTab === 'hubs'
                ? PICKUP_HUBS.map((h) => (
                    <button
                      key={h.id}
                      onClick={() => {
                        setSelectedHub(h);
                        if (onSelectHub) onSelectHub(h.name);
                      }}
                      className={`p-2 rounded-xl text-left border font-semibold transition-all ${
                        selectedHub.id === h.id
                          ? 'bg-[#0D3B2B] text-white border-[#0D3B2B]'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-emerald-50'
                      }`}
                    >
                      <div className="truncate text-[11px]">{h.name}</div>
                      <div className="text-[10px] opacity-80">{h.code} • {h.availableFleetCount} cars</div>
                    </button>
                  ))
                : SAFARI_ROUTES.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedRoute(r)}
                      className={`p-2 rounded-xl text-left border font-semibold transition-all ${
                        selectedRoute.id === r.id
                          ? 'bg-[#0D3B2B] text-white border-[#0D3B2B]'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-amber-50'
                      }`}
                    >
                      <div className="truncate text-[11px]">{r.name}</div>
                      <div className="text-[10px] opacity-80">{r.distanceKm} km</div>
                    </button>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
