// Route-specific map data for the Live Satellite Corridor Map
// Each route contains scenic POIs (with window side indicator & detailed desc), terrain contours, rivers, bridges, signals, and urban zones

export const ROUTE_MAP_DATA = {
  // ──── NEW DELHI → MUMBAI CENTRAL (Western Railway Corridor) ────
  NDLS_MMCT: {
    scenic: [
      { name: 'Aravalli Mountain Range', emoji: '🏔️', desc: 'Ancient fold mountain ridges framing the horizon near Ajmer & Abu Road', side: 'Right Window', x: 230, y: 110 },
      { name: 'Chambal River Ravines', emoji: '🌊', desc: 'Deep canyon gorges and high railway bridge over Chambal River near Kota', side: 'Direct Crossing', x: 450, y: 310 },
      { name: 'Vasai Creek & Mangroves', emoji: '🌉', desc: 'Scenic tidal estuary bridge crossing into North Mumbai coastline', side: 'Left Window', x: 780, y: 110 }
    ],
    terrain: [
      { d: 'M 0 170 Q 180 90 340 150 T 700 100 T 900 130 L 900 420 L 0 420 Z', fill: '#cbd5e1', opacity: 0.4 },
      { d: 'M 0 250 Q 220 190 440 240 T 800 170 T 900 200 L 900 420 L 0 420 Z', fill: '#94a3b8', opacity: 0.25 }
    ],
    river: { d: 'M 450 0 C 460 110 440 210 460 300 C 470 350 450 390 460 420', name: 'Chambal River', labelX: 470, labelY: 100 },
    bridges: [{ x: 450, y: 190, rot: -10, label: 'CHAMBAL BR.' }],
    signals: [
      { x: 130, y: 200, color: '#059669', pulse: true },
      { x: 390, y: 215, color: '#d97706', pulse: false },
      { x: 660, y: 210, color: '#059669', pulse: false }
    ],
    urbanZones: [
      { cx: 40, cy: 220, r: 42 },
      { cx: 310, cy: 235, r: 34 },
      { cx: 590, cy: 230, r: 38 },
      { cx: 860, cy: 215, r: 46 }
    ]
  },

  // ──── MUMBAI CENTRAL → KSR BENGALURU (Western Ghats Corridor) ────
  MMCT_SBC: {
    scenic: [
      { name: 'Bhor Ghat Pass', emoji: '⛰️', desc: 'Breathtaking Sahyadri mountain viaducts, tunnels & monsoon waterfalls', side: 'Both Windows', x: 240, y: 110 },
      { name: 'Dudhsagar Waterfalls', emoji: '💧', desc: 'Famous four-tiered white water cascading beside the railway tracks', side: 'Left Window', x: 500, y: 310 },
      { name: 'Tungabhadra River Basin', emoji: '🌿', desc: 'Lush green agricultural valley and ancient river crossing near Hosapete', side: 'Right Window', x: 760, y: 110 }
    ],
    terrain: [
      { d: 'M 0 160 Q 200 100 400 140 T 800 120 T 900 140 L 900 420 L 0 420 Z', fill: '#cbd5e1', opacity: 0.4 },
      { d: 'M 0 240 Q 250 180 500 220 T 900 200 L 900 420 L 0 420 Z', fill: '#94a3b8', opacity: 0.25 }
    ],
    river: { d: 'M 640 0 C 650 90 630 190 650 280 C 660 340 640 390 650 420', name: 'Krishna River', labelX: 660, labelY: 90 },
    bridges: [{ x: 640, y: 225, rot: -8, label: 'KRISHNA BR.' }],
    signals: [
      { x: 150, y: 200, color: '#059669', pulse: true },
      { x: 390, y: 215, color: '#059669', pulse: false },
      { x: 720, y: 205, color: '#d97706', pulse: false }
    ],
    urbanZones: [
      { cx: 40, cy: 220, r: 45 },
      { cx: 310, cy: 235, r: 40 },
      { cx: 590, cy: 230, r: 32 },
      { cx: 860, cy: 215, r: 48 }
    ]
  },

  // ──── MUMBAI CENTRAL → PUNE (Bhor Ghat Section) ────
  MMCT_PUNE: {
    scenic: [
      { name: 'Thane Creek Flamingo Sanctuary', emoji: '🦩', desc: 'Sprawling coastal mudflats and flamingo feeding grounds near Vashi', side: 'Right Window', x: 230, y: 110 },
      { name: 'Khandala Valley & Duke Nose', emoji: '⛰️', desc: 'Dramatic vertical cliff face and deep misty valley during mountain climb', side: 'Left Window', x: 520, y: 310 },
      { name: 'Lonavala Hill Plateau', emoji: '🌿', desc: 'Rolling green Western Ghats summit, famous for foggy monsoon views', side: 'Both Windows', x: 760, y: 110 }
    ],
    terrain: [
      { d: 'M 0 170 Q 200 120 400 150 T 800 130 T 900 150 L 900 420 L 0 420 Z', fill: '#cbd5e1', opacity: 0.4 },
      { d: 'M 0 250 Q 250 200 500 230 T 900 210 L 900 420 L 0 420 Z', fill: '#94a3b8', opacity: 0.25 }
    ],
    river: { d: 'M 300 0 C 310 90 290 180 310 260 C 320 320 300 380 310 420', name: 'Ulhas River', labelX: 325, labelY: 80 },
    bridges: [{ x: 300, y: 225, rot: -12, label: 'GHAT BR.' }],
    signals: [
      { x: 130, y: 200, color: '#059669', pulse: true },
      { x: 500, y: 215, color: '#d97706', pulse: false },
      { x: 760, y: 205, color: '#059669', pulse: false }
    ],
    urbanZones: [
      { cx: 40, cy: 220, r: 48 },
      { cx: 310, cy: 235, r: 30 },
      { cx: 450, cy: 190, r: 26 },
      { cx: 860, cy: 215, r: 44 }
    ]
  },

  // ──── NEW DELHI → VARANASI (Gangetic Plains Corridor) ────
  NDLS_BSB: {
    scenic: [
      { name: 'Agra Taj Mahal Silhouette', emoji: '🏛️', desc: 'Iconic white marble monument visible across Yamuna floodplain near Agra', side: 'Right Window', x: 230, y: 110 },
      { name: 'Yamuna River Rail Bridge', emoji: '🌊', desc: 'Long historic iron truss bridge crossing holy Yamuna River', side: 'Direct Crossing', x: 450, y: 310 },
      { name: 'Varanasi Ganga River Ghats', emoji: '🛕', desc: 'Ancient spiritual riverbanks and illuminated evening Aarti ghats', side: 'Left Window', x: 780, y: 110 }
    ],
    terrain: [
      { d: 'M 0 180 Q 200 130 400 160 T 800 140 T 900 160 L 900 420 L 0 420 Z', fill: '#cbd5e1', opacity: 0.35 },
      { d: 'M 0 260 Q 250 210 500 240 T 900 220 L 900 420 L 0 420 Z', fill: '#94a3b8', opacity: 0.2 }
    ],
    river: { d: 'M 370 0 C 380 100 360 200 380 300 C 390 360 370 400 380 420', name: 'Yamuna River', labelX: 395, labelY: 85 },
    bridges: [{ x: 370, y: 215, rot: -10, label: 'YAMUNA BR.' }],
    signals: [
      { x: 240, y: 200, color: '#059669', pulse: true },
      { x: 500, y: 215, color: '#059669', pulse: false },
      { x: 760, y: 205, color: '#d97706', pulse: false }
    ],
    urbanZones: [
      { cx: 40, cy: 220, r: 46 },
      { cx: 310, cy: 235, r: 38 },
      { cx: 590, cy: 230, r: 30 },
      { cx: 860, cy: 215, r: 44 }
    ]
  },

  // ──── AHMEDABAD → MUMBAI CENTRAL (Gujarat Coast Corridor) ────
  ADI_MMCT: {
    scenic: [
      { name: 'Sabarmati Riverfront', emoji: '🌊', desc: 'Modern urban riverfront park and promenades leaving Ahmedabad', side: 'Left Window', x: 210, y: 110 },
      { name: 'Narmada Golden Bridge', emoji: '🌉', desc: 'Grand historical railway bridge across wide Narmada River at Bharuch', side: 'Direct Crossing', x: 470, y: 310 },
      { name: 'Vasai Creek Wetlands', emoji: '🦩', desc: 'Coastal tidal mangroves and fishing boat harbors entering Mumbai', side: 'Right Window', x: 760, y: 110 }
    ],
    terrain: [
      { d: 'M 0 170 Q 200 120 400 150 T 800 130 T 900 150 L 900 420 L 0 420 Z', fill: '#cbd5e1', opacity: 0.35 },
      { d: 'M 0 250 Q 250 200 500 230 T 900 210 L 900 420 L 0 420 Z', fill: '#94a3b8', opacity: 0.2 }
    ],
    river: { d: 'M 490 0 C 500 90 480 180 500 280 C 510 340 490 390 500 420', name: 'Narmada River', labelX: 515, labelY: 80 },
    bridges: [{ x: 490, y: 215, rot: -10, label: 'NARMADA BR.' }],
    signals: [
      { x: 160, y: 200, color: '#059669', pulse: true },
      { x: 420, y: 215, color: '#059669', pulse: false },
      { x: 700, y: 205, color: '#d97706', pulse: false }
    ],
    urbanZones: [
      { cx: 40, cy: 220, r: 44 },
      { cx: 310, cy: 235, r: 36 },
      { cx: 590, cy: 230, r: 30 },
      { cx: 860, cy: 215, r: 48 }
    ]
  },

  // ──── CHENNAI → KSR BENGALURU (South Corridor) ────
  MAS_SBC: {
    scenic: [
      { name: 'Palar River Bed Valley', emoji: '🌊', desc: 'Expansive sandy riverbed and rocky Eastern Ghats foothills', side: 'Right Window', x: 230, y: 110 },
      { name: 'Kolar Gold Fields Plateau', emoji: '⛏️', desc: 'Historic mining ridges and elevated Deccan tableland view', side: 'Left Window', x: 500, y: 310 },
      { name: 'Whitefield Cyber Canopy', emoji: '🏢', desc: 'Modern tech park skyline and suburban green belts approaching Bengaluru', side: 'Left Window', x: 760, y: 110 }
    ],
    terrain: [
      { d: 'M 0 170 Q 200 120 400 150 T 800 130 T 900 150 L 900 420 L 0 420 Z', fill: '#cbd5e1', opacity: 0.35 },
      { d: 'M 0 250 Q 250 200 500 230 T 900 210 L 900 420 L 0 420 Z', fill: '#94a3b8', opacity: 0.2 }
    ],
    river: { d: 'M 280 0 C 290 80 270 170 290 260 C 300 320 280 380 290 420', name: 'Palar River', labelX: 305, labelY: 80 },
    bridges: [{ x: 280, y: 215, rot: -10, label: 'PALAR BR.' }],
    signals: [
      { x: 150, y: 200, color: '#059669', pulse: true },
      { x: 450, y: 215, color: '#d97706', pulse: false },
      { x: 720, y: 205, color: '#059669', pulse: false }
    ],
    urbanZones: [
      { cx: 40, cy: 220, r: 46 },
      { cx: 310, cy: 235, r: 32 },
      { cx: 590, cy: 230, r: 28 },
      { cx: 860, cy: 215, r: 48 }
    ]
  },

  // ──── NEW DELHI → HOWRAH (Eastern Railway Corridor) ────
  NDLS_HWH: {
    scenic: [
      { name: 'Yamuna River Rail Viaduct', emoji: '🌊', desc: 'Massive multi-span iron bridge leaving Delhi towards UP plains', side: 'Direct Crossing', x: 160, y: 110 },
      { name: 'Son River Grand Gorge', emoji: '🏔️', desc: 'One of Asia longest rail bridges across the wide Son River near Dehri', side: 'Direct Crossing', x: 450, y: 310 },
      { name: 'Rajmahal Ancient Hills', emoji: '⛰️', desc: 'Basalt volcanic rock hills framing the Gangetic delta transition', side: 'Left Window', x: 760, y: 110 }
    ],
    terrain: [
      { d: 'M 0 170 Q 200 120 400 150 T 800 130 T 900 150 L 900 420 L 0 420 Z', fill: '#cbd5e1', opacity: 0.35 },
      { d: 'M 0 250 Q 250 200 500 230 T 900 210 L 900 420 L 0 420 Z', fill: '#94a3b8', opacity: 0.2 }
    ],
    river: { d: 'M 420 0 C 430 80 410 170 430 260 C 440 320 420 380 430 420', name: 'Son River', labelX: 445, labelY: 80 },
    bridges: [{ x: 420, y: 215, rot: -10, label: 'SON RIVER BR.' }],
    signals: [
      { x: 130, y: 200, color: '#059669', pulse: true },
      { x: 380, y: 215, color: '#d97706', pulse: false },
      { x: 680, y: 205, color: '#059669', pulse: false }
    ],
    urbanZones: [
      { cx: 40, cy: 220, r: 46 },
      { cx: 310, cy: 235, r: 34 },
      { cx: 590, cy: 230, r: 32 },
      { cx: 860, cy: 215, r: 48 }
    ]
  },

  // ──── FALLBACK (Generic Route) ────
  FALLBACK: {
    scenic: [
      { name: 'Scenic River Viaduct', emoji: '🌊', desc: 'River bridge crossing with panoramic water views', side: 'Direct Crossing', x: 380, y: 110 },
      { name: 'Mountain Ridge Panorama', emoji: '🏔️', desc: 'Picturesque hill vistas along the railway line', side: 'Left Window', x: 620, y: 310 }
    ],
    terrain: [
      { d: 'M 0 170 Q 200 120 400 150 T 800 130 T 900 150 L 900 420 L 0 420 Z', fill: '#cbd5e1', opacity: 0.35 },
      { d: 'M 0 250 Q 250 200 500 230 T 900 210 L 900 420 L 0 420 Z', fill: '#94a3b8', opacity: 0.2 }
    ],
    river: { d: 'M 420 0 C 430 100 410 200 430 300 C 440 350 420 400 430 420', name: 'River Stream', labelX: 445, labelY: 90 },
    bridges: [{ x: 420, y: 215, rot: -10, label: 'RIVER BRIDGE' }],
    signals: [
      { x: 180, y: 200, color: '#059669', pulse: true },
      { x: 450, y: 215, color: '#d97706', pulse: false },
      { x: 700, y: 205, color: '#059669', pulse: false }
    ],
    urbanZones: [
      { cx: 40, cy: 220, r: 40 },
      { cx: 310, cy: 235, r: 34 },
      { cx: 590, cy: 230, r: 34 },
      { cx: 860, cy: 215, r: 44 }
    ]
  }
}
