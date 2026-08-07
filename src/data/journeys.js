export const HIGH_STAKES_TYPES = [
  { id: 'exam', label: 'Exam', icon: 'CheckSquare', description: 'Zero delay risk priority, buffer route options' },
  { id: 'interview', label: 'Interview', icon: 'Hexagon', description: 'Schedule monitoring & arrival assurance' },
  { id: 'medical', label: 'Medical', icon: 'HeartHandshake', description: 'Priority assistance & station support' },
  { id: 'flight', label: 'Flight', icon: 'Plane', description: 'Airport connect synchronization & emergency backup' },
  { id: 'other', label: 'Other', icon: 'Compass', description: 'Standard high-reliability journey tracking' },
]

export const MOCK_UPCOMING_TRIPS = [
  {
    id: 'pnr_84291039',
    pnr: '84291039',
    trainNumber: '22436',
    trainName: 'Vande Bharat Express',
    from: 'New Delhi (NDLS)',
    to: 'Varanasi (BSB)',
    date: 'Tomorrow, 06:00 AM',
    seatInfo: 'Coach C4 • Seat 32 (Window)',
    status: 'On Time',
    statusType: 'success',
    riskScore: 92,
    delayProbability: '8%',
    crowdForecast: 'Moderate',
    weatherImpact: 'Clear',
    routeReliability: '92%',
    currentStepIndex: 3, // In Progress / Booked -> Chart Prepared -> Departed -> In Progress -> Arriving
    timeline: [
      { label: 'Booked', time: 'Aug 04, 10:30 AM', completed: true },
      { label: 'Chart Prepared', time: 'Aug 07, 02:00 PM', completed: true },
      { label: 'Departed', time: 'Aug 08, 06:00 AM', completed: true },
      { label: 'In Progress', time: 'Current Station: Kanpur Central', active: true },
      { label: 'Arriving', time: 'Estimated 02:00 PM', completed: false }
    ],
    predictedArrival: '02:00 PM',
    predictionInsights: [
      'Historical 30-day punctuality rate for this corridor is 92.4% based on past train logs',
      'Weather conditions along Kanpur - Prayagraj segment are clear with optimal visibility',
      'Predictions provide estimated guidance; actual arrival depends on real-time signal dispatch'
    ]
  },
  {
    id: 'pnr_71940281',
    pnr: '71940281',
    trainNumber: '12952',
    trainName: 'Mumbai Rajdhani Express',
    from: 'New Delhi (NDLS)',
    to: 'Mumbai Central (MMCT)',
    date: '12 Aug 2026, 04:55 PM',
    seatInfo: 'Coach B2 • Seat 14 & 15 (Side Lower)',
    status: 'Confirmed',
    statusType: 'primary',
    riskScore: 88,
    delayProbability: '12%',
    crowdForecast: 'High',
    weatherImpact: 'Light Rain',
    routeReliability: '88%',
    currentStepIndex: 1,
    timeline: [
      { label: 'Booked', time: 'Aug 02, 05:15 PM', completed: true },
      { label: 'Chart Prepared', time: 'Expected 12 Aug, 12:00 PM', active: true },
      { label: 'Departed', time: '12 Aug, 04:55 PM', completed: false },
      { label: 'In Progress', time: 'En Route', completed: false },
      { label: 'Arriving', time: 'Estimated 13 Aug, 08:35 AM', completed: false }
    ],
    predictedArrival: '08:35 AM (+1 day)',
    predictionInsights: [
      'Rajdhani Priority signaling enabled across WCR zone',
      'Historical delay buffer averages +10-15m during light rain near Vadodara',
      'Estimated forecast calculated from past 60-day operational telemetry'
    ]
  }
]

export const LIVE_NETWORK_STATUS = [
  { corridor: 'Northern Corridor (NDLS - CNB)', status: 'Optimal', load: '88%', health: 'Smooth' },
  { corridor: 'Western Corridor (MMCT - ADI)', status: 'Optimal', load: '92%', health: 'Smooth' },
  { corridor: 'Eastern Main (HWH - PNBE)', status: 'Normal', load: '85%', health: 'Normal' },
  { corridor: 'Southern Express (MAS - SBC)', status: 'Optimal', load: '79%', health: 'Smooth' },
  { corridor: 'Central Spine (BPL - NGP)', status: 'Normal', load: '90%', health: 'Normal' }
]
