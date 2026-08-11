// Comprehensive Dataset of Indian Railway Trains for Station Pairs (Bi-directional & All Categories)
export const MOCK_TRAINS = [
  // ==================== MUMBAI (MMCT/LTT) <-> BENGALURU (SBC) ====================
  {
    id: 'tr_11301',
    number: '11301',
    name: 'Udyan Express',
    type: 'Superfast Express',
    fromCode: 'MMCT',
    fromName: 'Mumbai Central',
    toCode: 'SBC',
    toName: 'KSR Bengaluru',
    deptTime: '08:10 AM',
    arrTime: '06:00 AM (+1 day)',
    duration: '21h 50m',
    speedCategory: 'Cheapest',
    punctualityScore: 88,
    reliabilityRating: 'Moderate Reliability',
    reliabilityColor: 'yellow',
    crowdLevel: 'High',
    price: 1450,
    classes: [
      { code: '1A', name: 'First AC', price: 3450, status: 'AVAILABLE-4', statusType: 'available' },
      { code: '2A', name: 'Second AC', price: 2150, status: 'RAC 6', statusType: 'rac' },
      { code: '3A', name: 'Third AC', price: 1450, status: 'WL 32', statusType: 'wl' },
      { code: 'SL', name: 'Sleeper Class', price: 540, status: 'REGRET', statusType: 'regret' }
    ],
    features: ['Daily Service', 'Scenic Western Ghats Route', 'Pantry Catering'],
    runsOn: ['Daily'],
    historyLogs: [
      { day: 'Mon, 03 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '78 km/h' },
      { day: 'Tue, 04 Aug', status: 'Delayed +14m', delayMinutes: 14, originDept: '+5m', destArr: '+14m', avgSpeed: '75 km/h' },
      { day: 'Wed, 05 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '79 km/h' },
      { day: 'Thu, 06 Aug', status: 'Delayed +22m', delayMinutes: 22, originDept: '+10m', destArr: '+22m', avgSpeed: '72 km/h' },
      { day: 'Fri, 07 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '78 km/h' },
      { day: 'Sat, 01 Aug', status: 'Delayed +8m', delayMinutes: 8, originDept: '+2m', destArr: '+8m', avgSpeed: '77 km/h' },
      { day: 'Sun, 02 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '79 km/h' }
    ]
  },
  {
    id: 'tr_11013',
    number: '11013',
    name: 'LTT Coimbatore Express (via SBC)',
    type: 'Express',
    fromCode: 'MMCT',
    fromName: 'Mumbai Central',
    toCode: 'SBC',
    toName: 'KSR Bengaluru',
    deptTime: '10:35 PM',
    arrTime: '09:50 PM (+1 day)',
    duration: '23h 15m',
    speedCategory: 'Cheapest',
    punctualityScore: 58,
    reliabilityRating: 'High Delay Risk (Unreliable)',
    reliabilityColor: 'red',
    crowdLevel: 'High',
    price: 1380,
    classes: [
      { code: '2A', name: 'Second AC', price: 2050, status: 'AVAILABLE-8', statusType: 'available' },
      { code: '3A', name: 'Third AC', price: 1380, status: 'RAC 14', statusType: 'rac' },
      { code: 'SL', name: 'Sleeper Class', price: 510, status: 'GNWL 48', statusType: 'wl' }
    ],
    features: ['Tri-Weekly Service', 'Frequent Track Clearance Delays', 'Not Recommended for Urgent Travel'],
    runsOn: ['Mon', 'Wed', 'Fri'],
    historyLogs: [
      { day: 'Mon, 03 Aug', status: 'Delayed +78m', delayMinutes: 78, originDept: '+35m', destArr: '+78m', avgSpeed: '58 km/h' },
      { day: 'Tue, 04 Aug', status: 'Delayed +45m', delayMinutes: 45, originDept: '+20m', destArr: '+45m', avgSpeed: '64 km/h' },
      { day: 'Wed, 05 Aug', status: 'Delayed +110m', delayMinutes: 110, originDept: '+50m', destArr: '+110m', avgSpeed: '52 km/h' },
      { day: 'Thu, 06 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '75 km/h' },
      { day: 'Fri, 07 Aug', status: 'Delayed +62m', delayMinutes: 62, originDept: '+25m', destArr: '+62m', avgSpeed: '60 km/h' },
      { day: 'Sat, 01 Aug', status: 'Delayed +95m', delayMinutes: 95, originDept: '+40m', destArr: '+95m', avgSpeed: '55 km/h' },
      { day: 'Sun, 02 Aug', status: 'Delayed +38m', delayMinutes: 38, originDept: '+15m', destArr: '+38m', avgSpeed: '65 km/h' }
    ]
  },

  // ==================== MUMBAI (MMCT) <-> PUNE (PUNE) ====================
  {
    id: 'tr_12123',
    number: '12123',
    name: 'Deccan Queen Superfast',
    type: 'Superfast',
    fromCode: 'MMCT',
    fromName: 'Mumbai Central',
    toCode: 'PUNE',
    toName: 'Pune Jn',
    deptTime: '05:10 PM',
    arrTime: '08:25 PM',
    duration: '3h 15m',
    speedCategory: 'Fastest',
    punctualityScore: 96,
    reliabilityRating: 'High Reliability',
    reliabilityColor: 'green',
    crowdLevel: 'Low',
    price: 450,
    classes: [
      { code: 'EC', name: 'Executive Dining Chair', price: 1050, status: 'AVAILABLE-15', statusType: 'available' },
      { code: 'CC', name: 'AC Chair Car', price: 450, status: 'AVAILABLE-110', statusType: 'available' },
      { code: '2S', name: 'Second Seating', price: 120, status: 'RAC 8', statusType: 'rac' }
    ],
    features: ['Historic Icon', 'Onboard Dining Car', 'High Speed Ghat Run'],
    runsOn: ['Daily'],
    historyLogs: [
      { day: 'Mon, 03 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '92 km/h' },
      { day: 'Tue, 04 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '91 km/h' },
      { day: 'Wed, 05 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '93 km/h' },
      { day: 'Thu, 06 Aug', status: 'Delayed +4m', delayMinutes: 4, originDept: 'On Time', destArr: '+4m', avgSpeed: '90 km/h' },
      { day: 'Fri, 07 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '92 km/h' },
      { day: 'Sat, 01 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '91 km/h' },
      { day: 'Sun, 02 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '92 km/h' }
    ]
  },
  {
    id: 'tr_11009',
    number: '11009',
    name: 'Sinhagad Passenger Special',
    type: 'Passenger',
    fromCode: 'MMCT',
    fromName: 'Mumbai Central',
    toCode: 'PUNE',
    toName: 'Pune Jn',
    deptTime: '02:30 PM',
    arrTime: '06:40 PM',
    duration: '4h 10m',
    speedCategory: 'Cheapest',
    punctualityScore: 52,
    reliabilityRating: 'Unreliable (Heavy Freight Stops)',
    reliabilityColor: 'red',
    crowdLevel: 'High',
    price: 95,
    classes: [
      { code: 'CC', name: 'AC Chair Car', price: 380, status: 'RAC 12', statusType: 'rac' },
      { code: '2S', name: 'Second Seating', price: 95, status: 'REGRET', statusType: 'regret' }
    ],
    features: ['4-Day Special Service', 'Frequent Ghat Section Holds', 'Low Priority Line'],
    runsOn: ['Tue', 'Thu', 'Sat', 'Sun'],
    historyLogs: [
      { day: 'Mon, 03 Aug', status: 'Delayed +54m', delayMinutes: 54, originDept: '+20m', destArr: '+54m', avgSpeed: '48 km/h' },
      { day: 'Tue, 04 Aug', status: 'Delayed +85m', delayMinutes: 85, originDept: '+40m', destArr: '+85m', avgSpeed: '42 km/h' },
      { day: 'Wed, 05 Aug', status: 'Delayed +40m', delayMinutes: 40, originDept: '+15m', destArr: '+40m', avgSpeed: '51 km/h' },
      { day: 'Thu, 06 Aug', status: 'Delayed +92m', delayMinutes: 92, originDept: '+45m', destArr: '+92m', avgSpeed: '40 km/h' },
      { day: 'Fri, 07 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '60 km/h' },
      { day: 'Sat, 01 Aug', status: 'Delayed +68m', delayMinutes: 68, originDept: '+30m', destArr: '+68m', avgSpeed: '45 km/h' },
      { day: 'Sun, 02 Aug', status: 'Delayed +115m', delayMinutes: 115, originDept: '+55m', destArr: '+115m', avgSpeed: '38 km/h' }
    ]
  },

  // ==================== NEW DELHI (NDLS) <-> VARANASI (BSB) ====================
  {
    id: 'tr_22436',
    number: '22436',
    name: 'Vande Bharat Express',
    type: 'Vande Bharat',
    fromCode: 'NDLS',
    fromName: 'New Delhi',
    toCode: 'BSB',
    toName: 'Varanasi Jn',
    deptTime: '06:00 AM',
    arrTime: '02:00 PM',
    duration: '8h 00m',
    speedCategory: 'Fastest',
    punctualityScore: 92,
    reliabilityRating: 'High Reliability',
    reliabilityColor: 'green',
    crowdLevel: 'Moderate',
    price: 1750,
    classes: [
      { code: 'EC', name: 'Executive Chair', price: 3300, status: 'AVAILABLE-14', statusType: 'available' },
      { code: 'CC', name: 'AC Chair Car', price: 1750, status: 'AVAILABLE-42', statusType: 'available' },
    ],
    features: ['Wi-Fi', 'Onboard Catering', 'Automatic Doors', 'GPS Telemetry'],
    runsOn: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
    historyLogs: [
      { day: 'Mon, 03 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '96 km/h' },
      { day: 'Tue, 04 Aug', status: 'Delayed +4m', delayMinutes: 4, originDept: 'On Time', destArr: '+4m', avgSpeed: '95 km/h' },
      { day: 'Wed, 05 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '97 km/h' },
      { day: 'Fri, 07 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '96 km/h' },
      { day: 'Sat, 01 Aug', status: 'Delayed +6m', delayMinutes: 6, originDept: '+2m', destArr: '+6m', avgSpeed: '94 km/h' },
      { day: 'Sun, 02 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '96 km/h' }
    ]
  },
  {
    id: 'tr_14258',
    number: '14258',
    name: 'Kashi Vishwanath Express',
    type: 'Express',
    fromCode: 'NDLS',
    fromName: 'New Delhi',
    toCode: 'BSB',
    toName: 'Varanasi Jn',
    deptTime: '11:35 AM',
    arrTime: '04:45 AM (+1 day)',
    duration: '17h 10m',
    speedCategory: 'Cheapest',
    punctualityScore: 48,
    reliabilityRating: 'High Delay Risk (Avoid for Exams/Flights)',
    reliabilityColor: 'red',
    crowdLevel: 'High',
    price: 430,
    classes: [
      { code: '3A', name: 'Third AC', price: 1150, status: 'RAC 18', statusType: 'rac' },
      { code: 'SL', name: 'Sleeper', price: 430, status: 'WL 65', statusType: 'wl' }
    ],
    features: ['Tri-Weekly Express', 'High Congestion Route', 'Heavy Section Delays'],
    runsOn: ['Mon', 'Wed', 'Fri'],
    historyLogs: [
      { day: 'Mon, 03 Aug', status: 'Delayed +140m', delayMinutes: 140, originDept: '+60m', destArr: '+140m', avgSpeed: '42 km/h' },
      { day: 'Tue, 04 Aug', status: 'Delayed +95m', delayMinutes: 95, originDept: '+40m', destArr: '+95m', avgSpeed: '48 km/h' },
      { day: 'Wed, 05 Aug', status: 'Delayed +120m', delayMinutes: 120, originDept: '+55m', destArr: '+120m', avgSpeed: '45 km/h' },
      { day: 'Thu, 06 Aug', status: 'Delayed +180m', delayMinutes: 180, originDept: '+80m', destArr: '+180m', avgSpeed: '38 km/h' },
      { day: 'Fri, 07 Aug', status: 'Delayed +60m', delayMinutes: 60, originDept: '+25m', destArr: '+60m', avgSpeed: '52 km/h' },
      { day: 'Sat, 01 Aug', status: 'Delayed +110m', delayMinutes: 110, originDept: '+45m', destArr: '+110m', avgSpeed: '46 km/h' },
      { day: 'Sun, 02 Aug', status: 'Delayed +85m', delayMinutes: 85, originDept: '+35m', destArr: '+85m', avgSpeed: '50 km/h' }
    ]
  },

  // ==================== NEW DELHI (NDLS) <-> MUMBAI CENTRAL (MMCT) ====================
  {
    id: 'tr_12952',
    number: '12952',
    name: 'Mumbai Rajdhani Express',
    type: 'Rajdhani',
    fromCode: 'NDLS',
    fromName: 'New Delhi',
    toCode: 'MMCT',
    toName: 'Mumbai Central',
    deptTime: '04:55 PM',
    arrTime: '08:35 AM',
    duration: '15h 40m',
    speedCategory: 'Fastest',
    punctualityScore: 89,
    reliabilityRating: 'Moderate Reliability',
    reliabilityColor: 'yellow',
    crowdLevel: 'High',
    price: 2450,
    classes: [
      { code: '1A', name: 'First AC', price: 4800, status: 'RAC 4', statusType: 'rac' },
      { code: '2A', name: 'Second AC', price: 2950, status: 'AVAILABLE-18', statusType: 'available' },
      { code: '3A', name: 'Third AC', price: 2450, status: 'AVAILABLE-86', statusType: 'available' },
    ],
    features: ['Pantry Included', 'Cleanliness 5★', 'Bedding Included'],
    runsOn: ['Daily'],
    historyLogs: [
      { day: 'Mon, 03 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '89 km/h' },
      { day: 'Tue, 04 Aug', status: 'Delayed +8m', delayMinutes: 8, originDept: '+2m', destArr: '+8m', avgSpeed: '88 km/h' },
      { day: 'Wed, 05 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '90 km/h' },
      { day: 'Thu, 06 Aug', status: 'Delayed +14m', delayMinutes: 14, originDept: '+5m', destArr: '+14m', avgSpeed: '86 km/h' },
      { day: 'Fri, 07 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '89 km/h' },
      { day: 'Sat, 01 Aug', status: 'Delayed +10m', delayMinutes: 10, originDept: '+3m', destArr: '+10m', avgSpeed: '87 km/h' },
      { day: 'Sun, 02 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '90 km/h' }
    ]
  },
  {
    id: 'tr_12954',
    number: '12954',
    name: 'August Kranti Rajdhani Express',
    type: 'Rajdhani',
    fromCode: 'NDLS',
    fromName: 'New Delhi',
    toCode: 'MMCT',
    toName: 'Mumbai Central',
    deptTime: '05:15 PM',
    arrTime: '10:05 AM',
    duration: '16h 50m',
    speedCategory: 'Fastest',
    punctualityScore: 91,
    reliabilityRating: 'High Reliability',
    reliabilityColor: 'green',
    crowdLevel: 'Moderate',
    price: 2380,
    classes: [
      { code: '1A', name: 'First AC', price: 4650, status: 'AVAILABLE-6', statusType: 'available' },
      { code: '2A', name: 'Second AC', price: 2880, status: 'AVAILABLE-24', statusType: 'available' },
      { code: '3A', name: 'Third AC', price: 2380, status: 'AVAILABLE-105', statusType: 'available' },
    ],
    features: ['4-Day Tejas Rake', 'Tejas Smart Rake', 'Pantry Catering', 'CCTV Security'],
    runsOn: ['Mon', 'Tue', 'Thu', 'Sat'],
    historyLogs: [
      { day: 'Mon, 03 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '88 km/h' },
      { day: 'Tue, 04 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '89 km/h' },
      { day: 'Wed, 05 Aug', status: 'Delayed +5m', delayMinutes: 5, originDept: 'On Time', destArr: '+5m', avgSpeed: '87 km/h' },
      { day: 'Thu, 06 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '89 km/h' },
      { day: 'Fri, 07 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '90 km/h' }
    ]
  },
  {
    id: 'tr_12904',
    number: '12904',
    name: 'Golden Temple Mail',
    type: 'Superfast Express',
    fromCode: 'NDLS',
    fromName: 'New Delhi',
    toCode: 'MMCT',
    toName: 'Mumbai Central',
    deptTime: '04:00 AM',
    arrTime: '05:05 AM (+1 day)',
    duration: '25h 05m',
    speedCategory: 'Cheapest',
    punctualityScore: 82,
    reliabilityRating: 'Likely On-Time',
    reliabilityColor: 'green',
    crowdLevel: 'Moderate',
    price: 1540,
    classes: [
      { code: '2A', name: 'Second AC', price: 2210, status: 'AVAILABLE-12', statusType: 'available' },
      { code: '3A', name: 'Third AC', price: 1540, status: 'AVAILABLE-45', statusType: 'available' },
      { code: 'SL', name: 'Sleeper', price: 580, status: 'RAC 11', statusType: 'rac' }
    ],
    features: ['Historic Mail Train', 'LHB Rake', 'Pantry Car'],
    runsOn: ['Daily'],
    historyLogs: [
      { day: 'Mon, 03 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '76 km/h' },
      { day: 'Tue, 04 Aug', status: 'Delayed +12m', delayMinutes: 12, originDept: '+4m', destArr: '+12m', avgSpeed: '74 km/h' },
      { day: 'Wed, 05 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '77 km/h' }
    ]
  },
  {
    id: 'tr_12926',
    number: '12926',
    name: 'Paschim Superfast Express',
    type: 'Superfast Express',
    fromCode: 'NDLS',
    fromName: 'New Delhi',
    toCode: 'MMCT',
    toName: 'Mumbai Central',
    deptTime: '04:35 PM',
    arrTime: '02:45 PM (+1 day)',
    duration: '22h 10m',
    speedCategory: 'Cheapest',
    punctualityScore: 74,
    reliabilityRating: 'Moderate Delay Risk',
    reliabilityColor: 'amber',
    crowdLevel: 'High',
    price: 1480,
    classes: [
      { code: '2A', name: 'Second AC', price: 2150, status: 'RAC 8', statusType: 'rac' },
      { code: '3A', name: 'Third AC', price: 1480, status: 'AVAILABLE-28', statusType: 'available' },
      { code: 'SL', name: 'Sleeper', price: 550, status: 'WL 42', statusType: 'wl' }
    ],
    features: ['4-Day Superfast', 'Long Distance Express', 'High Capacity'],
    runsOn: ['Mon', 'Wed', 'Thu', 'Sat'],
    historyLogs: [
      { day: 'Mon, 03 Aug', status: 'Delayed +28m', delayMinutes: 28, originDept: '+10m', destArr: '+28m', avgSpeed: '68 km/h' },
      { day: 'Tue, 04 Aug', status: 'Delayed +15m', delayMinutes: 15, originDept: '+5m', destArr: '+15m', avgSpeed: '71 km/h' }
    ]
  },
  {
    id: 'tr_19020',
    number: '19020',
    name: 'Dehradun Express (via MMCT)',
    type: 'Express Mail',
    fromCode: 'NDLS',
    fromName: 'New Delhi',
    toCode: 'MMCT',
    toName: 'Mumbai Central',
    deptTime: '10:20 PM',
    arrTime: '04:15 AM (+2 days)',
    duration: '29h 55m',
    speedCategory: 'Cheapest',
    punctualityScore: 46,
    reliabilityRating: 'High Delay Risk (Extremely Slow)',
    reliabilityColor: 'red',
    crowdLevel: 'High',
    price: 610,
    classes: [
      { code: '3A', name: 'Third AC', price: 1650, status: 'GNWL 88', statusType: 'wl' },
      { code: 'SL', name: 'Sleeper', price: 610, status: 'REGRET', statusType: 'regret' }
    ],
    features: ['Tri-Weekly Service', 'Many Intermediate Stops', 'Low Priority Line'],
    runsOn: ['Tue', 'Thu', 'Sat'],
    historyLogs: [
      { day: 'Mon, 03 Aug', status: 'Delayed +160m', delayMinutes: 160, originDept: '+45m', destArr: '+160m', avgSpeed: '42 km/h' },
      { day: 'Tue, 04 Aug', status: 'Delayed +130m', delayMinutes: 130, originDept: '+60m', destArr: '+130m', avgSpeed: '45 km/h' },
      { day: 'Wed, 05 Aug', status: 'Delayed +210m', delayMinutes: 210, originDept: '+90m', destArr: '+210m', avgSpeed: '36 km/h' },
      { day: 'Thu, 06 Aug', status: 'Delayed +85m', delayMinutes: 85, originDept: '+30m', destArr: '+85m', avgSpeed: '49 km/h' },
      { day: 'Fri, 07 Aug', status: 'Delayed +175m', delayMinutes: 175, originDept: '+70m', destArr: '+175m', avgSpeed: '39 km/h' },
      { day: 'Sat, 01 Aug', status: 'Delayed +140m', delayMinutes: 140, originDept: '+50m', destArr: '+140m', avgSpeed: '44 km/h' },
      { day: 'Sun, 02 Aug', status: 'Delayed +190m', delayMinutes: 190, originDept: '+80m', destArr: '+190m', avgSpeed: '37 km/h' }
    ]
  },

  // ==================== NEW DELHI (NDLS) <-> HOWRAH / KOLKATA (HWH) ====================
  {
    id: 'tr_12302',
    number: '12302',
    name: 'Howrah Rajdhani Express (via Gaya)',
    type: 'Rajdhani',
    fromCode: 'NDLS',
    fromName: 'New Delhi',
    toCode: 'HWH',
    toName: 'Howrah Junction',
    deptTime: '04:55 PM',
    arrTime: '09:55 AM (+1 day)',
    duration: '17h 00m',
    speedCategory: 'Fastest',
    punctualityScore: 94,
    reliabilityRating: 'Very Likely On-Time',
    reliabilityColor: 'green',
    crowdLevel: 'High',
    price: 2650,
    classes: [
      { code: '1A', name: 'First AC', price: 5100, status: 'AVAILABLE-3', statusType: 'available' },
      { code: '2A', name: 'Second AC', price: 3150, status: 'AVAILABLE-22', statusType: 'available' },
      { code: '3A', name: 'Third AC', price: 2650, status: 'AVAILABLE-94', statusType: 'available' }
    ],
    features: ['4-Day Premium Service', 'King of ER', 'WiFi Onboard', 'Hot Gourmet Meals'],
    runsOn: ['Mon', 'Wed', 'Fri', 'Sun'],
    historyLogs: [
      { day: 'Mon, 03 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '91 km/h' },
      { day: 'Tue, 04 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '92 km/h' }
    ]
  },
  {
    id: 'tr_12488',
    number: '12488',
    name: 'Seemanchal Express',
    type: 'Express',
    fromCode: 'NDLS',
    fromName: 'New Delhi',
    toCode: 'HWH',
    toName: 'Howrah Junction',
    deptTime: '08:10 AM',
    arrTime: '09:45 AM (+1 day)',
    duration: '25h 35m',
    speedCategory: 'Cheapest',
    punctualityScore: 34,
    reliabilityRating: 'Severely Delayed (High Risk)',
    reliabilityColor: 'red',
    crowdLevel: 'Extreme',
    price: 490,
    classes: [
      { code: '3A', name: 'Third AC', price: 1320, status: 'WL 94', statusType: 'wl' },
      { code: 'SL', name: 'Sleeper Class', price: 490, status: 'REGRET', statusType: 'regret' }
    ],
    features: ['Tri-Weekly Express', 'Heavy Freight Bottleneck Zone', 'Frequent 4+ Hour Delays'],
    runsOn: ['Mon', 'Thu', 'Sat'],
    historyLogs: [
      { day: 'Mon, 03 Aug', status: 'Delayed +240m', delayMinutes: 240, originDept: '+90m', destArr: '+240m', avgSpeed: '38 km/h' },
      { day: 'Tue, 04 Aug', status: 'Delayed +180m', delayMinutes: 180, originDept: '+65m', destArr: '+180m', avgSpeed: '42 km/h' },
      { day: 'Wed, 05 Aug', status: 'Delayed +310m', delayMinutes: 310, originDept: '+140m', destArr: '+310m', avgSpeed: '31 km/h' },
      { day: 'Thu, 06 Aug', status: 'Delayed +195m', delayMinutes: 195, originDept: '+80m', destArr: '+195m', avgSpeed: '40 km/h' },
      { day: 'Fri, 07 Aug', status: 'Delayed +260m', delayMinutes: 260, originDept: '+110m', destArr: '+260m', avgSpeed: '35 km/h' },
      { day: 'Sat, 01 Aug', status: 'Delayed +140m', delayMinutes: 140, originDept: '+50m', destArr: '+140m', avgSpeed: '45 km/h' },
      { day: 'Sun, 02 Aug', status: 'Delayed +280m', delayMinutes: 280, originDept: '+120m', destArr: '+280m', avgSpeed: '33 km/h' }
    ]
  },
  {
    id: 'tr_15910',
    number: '15910',
    name: 'Avadh Assam Express',
    type: 'Express Mail',
    fromCode: 'NDLS',
    fromName: 'New Delhi',
    toCode: 'HWH',
    toName: 'Howrah Junction',
    deptTime: '07:20 AM',
    arrTime: '11:15 AM (+1 day)',
    duration: '27h 55m',
    speedCategory: 'Cheapest',
    punctualityScore: 28,
    reliabilityRating: 'Extreme Delay Risk (Avoid)',
    reliabilityColor: 'red',
    crowdLevel: 'Extreme',
    price: 450,
    classes: [
      { code: '3A', name: 'Third AC', price: 1250, status: 'GNWL 145', statusType: 'wl' },
      { code: 'SL', name: 'Sleeper Class', price: 450, status: 'REGRET', statusType: 'regret' }
    ],
    features: ['Chronic Congestion Route', 'Not Recommended for Connections'],
    runsOn: ['Daily'],
    historyLogs: [
      { day: 'Mon, 03 Aug', status: 'Delayed +350m', delayMinutes: 350, originDept: '+160m', destArr: '+350m', avgSpeed: '29 km/h' },
      { day: 'Tue, 04 Aug', status: 'Delayed +280m', delayMinutes: 280, originDept: '+120m', destArr: '+280m', avgSpeed: '34 km/h' },
      { day: 'Wed, 05 Aug', status: 'Delayed +320m', delayMinutes: 320, originDept: '+140m', destArr: '+320m', avgSpeed: '31 km/h' },
      { day: 'Thu, 06 Aug', status: 'Delayed +190m', delayMinutes: 190, originDept: '+75m', destArr: '+190m', avgSpeed: '41 km/h' },
      { day: 'Fri, 07 Aug', status: 'Delayed +410m', delayMinutes: 410, originDept: '+200m', destArr: '+410m', avgSpeed: '25 km/h' },
      { day: 'Sat, 01 Aug', status: 'Delayed +240m', delayMinutes: 240, originDept: '+95m', destArr: '+240m', avgSpeed: '38 km/h' },
      { day: 'Sun, 02 Aug', status: 'Delayed +310m', delayMinutes: 310, originDept: '+135m', destArr: '+310m', avgSpeed: '32 km/h' }
    ]
  },
  {
    id: 'tr_11057',
    number: '11057',
    name: 'Amritsar Express (via NDLS-MMCT)',
    type: 'Express Mail',
    fromCode: 'NDLS',
    fromName: 'New Delhi',
    toCode: 'MMCT',
    toName: 'Mumbai Central',
    deptTime: '11:45 PM',
    arrTime: '06:20 AM (+2 days)',
    duration: '30h 35m',
    speedCategory: 'Cheapest',
    punctualityScore: 39,
    reliabilityRating: 'High Delay Risk',
    reliabilityColor: 'red',
    crowdLevel: 'High',
    price: 590,
    classes: [
      { code: '3A', name: 'Third AC', price: 1580, status: 'GNWL 75', statusType: 'wl' },
      { code: 'SL', name: 'Sleeper Class', price: 590, status: 'REGRET', statusType: 'regret' }
    ],
    features: ['Weekend Special', 'Slow Freight Corridor', 'Heavy Intermediate Delays'],
    runsOn: ['Sat', 'Sun'],
    historyLogs: [
      { day: 'Mon, 03 Aug', status: 'Delayed +190m', delayMinutes: 190, originDept: '+75m', destArr: '+190m', avgSpeed: '40 km/h' },
      { day: 'Tue, 04 Aug', status: 'Delayed +160m', delayMinutes: 160, originDept: '+60m', destArr: '+160m', avgSpeed: '43 km/h' },
      { day: 'Wed, 05 Aug', status: 'Delayed +215m', delayMinutes: 215, originDept: '+85m', destArr: '+215m', avgSpeed: '37 km/h' },
      { day: 'Thu, 06 Aug', status: 'Delayed +140m', delayMinutes: 140, originDept: '+50m', destArr: '+140m', avgSpeed: '45 km/h' },
      { day: 'Fri, 07 Aug', status: 'Delayed +280m', delayMinutes: 280, originDept: '+115m', destArr: '+280m', avgSpeed: '32 km/h' },
      { day: 'Sat, 01 Aug', status: 'Delayed +175m', delayMinutes: 175, originDept: '+70m', destArr: '+175m', avgSpeed: '41 km/h' },
      { day: 'Sun, 02 Aug', status: 'Delayed +210m', delayMinutes: 210, originDept: '+90m', destArr: '+210m', avgSpeed: '38 km/h' }
    ]
  },
  {
    id: 'tr_12304',
    number: '12304',
    name: 'Poorva Express (via Patna)',
    type: 'Superfast Express',
    fromCode: 'NDLS',
    fromName: 'New Delhi',
    toCode: 'HWH',
    toName: 'Howrah Junction',
    deptTime: '05:40 PM',
    arrTime: '05:00 PM (+1 day)',
    duration: '23h 20m',
    speedCategory: 'Cheapest',
    punctualityScore: 78,
    reliabilityRating: 'Likely On-Time',
    reliabilityColor: 'lime',
    crowdLevel: 'Moderate',
    price: 1680,
    classes: [
      { code: '2A', name: 'Second AC', price: 2380, status: 'AVAILABLE-8', statusType: 'available' },
      { code: '3A', name: 'Third AC', price: 1680, status: 'AVAILABLE-56', statusType: 'available' },
      { code: 'SL', name: 'Sleeper', price: 620, status: 'RAC 14', statusType: 'rac' }
    ],
    features: ['LHB Rake', 'Pantry Catering'],
    runsOn: ['Wed', 'Thu', 'Sat', 'Sun'],
    historyLogs: [
      { day: 'Wed, 05 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '72 km/h' },
      { day: 'Thu, 06 Aug', status: 'Delayed +18m', delayMinutes: 18, originDept: '+5m', destArr: '+18m', avgSpeed: '69 km/h' }
    ]
  },

  // ==================== CHENNAI CENTRAL (MAS) <-> KSR BENGALURU (SBC) ====================
  {
    id: 'tr_20607',
    number: '20607',
    name: 'Mysuru Vande Bharat Express',
    type: 'Vande Bharat',
    fromCode: 'MAS',
    fromName: 'Chennai Central',
    toCode: 'SBC',
    toName: 'KSR Bengaluru',
    deptTime: '05:50 AM',
    arrTime: '10:20 AM',
    duration: '4h 30m',
    speedCategory: 'Fastest',
    punctualityScore: 97,
    reliabilityRating: 'Very Likely On-Time',
    reliabilityColor: 'green',
    crowdLevel: 'Moderate',
    price: 1365,
    classes: [
      { code: 'EC', name: 'Executive Chair', price: 2485, status: 'AVAILABLE-28', statusType: 'available' },
      { code: 'CC', name: 'AC Chair Car', price: 1365, status: 'AVAILABLE-110', statusType: 'available' }
    ],
    features: ['High Speed Corridor', 'Breakfast Onboard', 'GPS Live Tracking'],
    runsOn: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
    historyLogs: [
      { day: 'Mon, 03 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '98 km/h' },
      { day: 'Tue, 04 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '97 km/h' }
    ]
  },
  {
    id: 'tr_12027',
    number: '12027',
    name: 'Bengaluru Shatabdi Express',
    type: 'Shatabdi',
    fromCode: 'MAS',
    fromName: 'Chennai Central',
    toCode: 'SBC',
    toName: 'KSR Bengaluru',
    deptTime: '05:30 PM',
    arrTime: '10:25 PM',
    duration: '4h 55m',
    speedCategory: 'Fastest',
    punctualityScore: 92,
    reliabilityRating: 'Very Likely On-Time',
    reliabilityColor: 'green',
    crowdLevel: 'Low',
    price: 1180,
    classes: [
      { code: 'EC', name: 'Executive Chair', price: 2120, status: 'AVAILABLE-15', statusType: 'available' },
      { code: 'CC', name: 'AC Chair Car', price: 1180, status: 'AVAILABLE-85', statusType: 'available' }
    ],
    features: ['Tri-Weekly Shatabdi', 'Dinner Included', 'Executive Comfort'],
    runsOn: ['Tue', 'Thu', 'Sat'],
    historyLogs: [
      { day: 'Mon, 03 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '92 km/h' }
    ]
  },
  {
    id: 'tr_12639',
    number: '12639',
    name: 'Brindavan Express',
    type: 'Superfast Express',
    fromCode: 'MAS',
    fromName: 'Chennai Central',
    toCode: 'SBC',
    toName: 'KSR Bengaluru',
    deptTime: '07:40 AM',
    arrTime: '01:40 PM',
    duration: '6h 00m',
    speedCategory: 'Cheapest',
    punctualityScore: 85,
    reliabilityRating: 'Likely On-Time',
    reliabilityColor: 'green',
    crowdLevel: 'Moderate',
    price: 480,
    classes: [
      { code: 'CC', name: 'AC Chair Car', price: 480, status: 'AVAILABLE-45', statusType: 'available' },
      { code: '2S', name: 'Second Seating', price: 145, status: 'AVAILABLE-120', statusType: 'available' }
    ],
    features: ['Popular Day Intercity', 'Short Stops'],
    runsOn: ['Daily'],
    historyLogs: [
      { day: 'Mon, 03 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '78 km/h' }
    ]
  },

  // ==================== AHMEDABAD (ADI) <-> MUMBAI CENTRAL (MMCT) ====================
  {
    id: 'tr_82902',
    number: '82902',
    name: 'IRCTC Tejas Express',
    type: 'Tejas Premium',
    fromCode: 'ADI',
    fromName: 'Ahmedabad Jn',
    toCode: 'MMCT',
    toName: 'Mumbai Central',
    deptTime: '06:40 AM',
    arrTime: '01:05 PM',
    duration: '6h 25m',
    speedCategory: 'Fastest',
    punctualityScore: 94,
    reliabilityRating: 'High Reliability',
    reliabilityColor: 'green',
    crowdLevel: 'Low',
    price: 1980,
    classes: [
      { code: 'EC', name: 'Executive Chair', price: 3450, status: 'AVAILABLE-30', statusType: 'available' },
      { code: 'CC', name: 'AC Chair Car', price: 1980, status: 'AVAILABLE-95', statusType: 'available' },
    ],
    features: ['Travel Insurance Included', 'Infotainment System', 'Hostess Service'],
    runsOn: ['Mon', 'Tue', 'Thu', 'Fri', 'Sat', 'Sun'],
    historyLogs: [
      { day: 'Mon, 03 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '89 km/h' },
      { day: 'Tue, 04 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '90 km/h' },
      { day: 'Thu, 06 Aug', status: 'Delayed +4m', delayMinutes: 4, originDept: 'On Time', destArr: '+4m', avgSpeed: '88 km/h' },
      { day: 'Fri, 07 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '89 km/h' },
      { day: 'Sat, 01 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '90 km/h' },
      { day: 'Sun, 02 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '89 km/h' }
    ]
  },
  {
    id: 'tr_20902',
    number: '20902',
    name: 'Vande Bharat Express',
    type: 'Vande Bharat',
    fromCode: 'ADI',
    fromName: 'Ahmedabad Jn',
    toCode: 'MMCT',
    toName: 'Mumbai Central',
    deptTime: '03:00 PM',
    arrTime: '08:25 PM',
    duration: '5h 25m',
    speedCategory: 'Fastest',
    punctualityScore: 95,
    reliabilityRating: 'High Reliability',
    reliabilityColor: 'green',
    crowdLevel: 'Moderate',
    price: 1420,
    classes: [
      { code: 'EC', name: 'Executive Chair', price: 2630, status: 'AVAILABLE-16', statusType: 'available' },
      { code: 'CC', name: 'AC Chair Car', price: 1420, status: 'RAC 5', statusType: 'rac' }
    ],
    features: ['160 km/h Capable', 'Automatic Doors', 'Hot Meals'],
    runsOn: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
    historyLogs: [
      { day: 'Mon, 03 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '95 km/h' },
      { day: 'Tue, 04 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '96 km/h' },
      { day: 'Wed, 05 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '95 km/h' },
      { day: 'Fri, 07 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '96 km/h' },
      { day: 'Sat, 01 Aug', status: 'Delayed +3m', delayMinutes: 3, originDept: 'On Time', destArr: '+3m', avgSpeed: '94 km/h' },
      { day: 'Sun, 02 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '95 km/h' }
    ]
  }
]
