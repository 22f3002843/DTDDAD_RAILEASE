/**
 * Station-by-station route data.
 *
 * Why this is its own module:
 *   The waypoints were declared inside LiveStatusView, so the only screen that
 *   could draw a route was the one that happened to own the data. Any other
 *   view wanting to show a journey had to invent its own shape, which is how
 *   the dashboard ended up with an abstract curve carrying no station names.
 *
 * Shape of one waypoint:
 *   {
 *     name:     String,   // 'Kota Jn'
 *     code:     String,   // 'KOTA'
 *     arrTime:  String,   // '09:00 PM'
 *     halt:     String,   // '10 mins' | 'Origin' | 'Destination'
 *     dist:     Number,   // kilometres from origin
 *     status:   String,   // 'passed' | 'approaching' | 'upcoming'
 *     isMajor:  Boolean
 *   }
 */

const DELHI_MUMBAI = [
  { name: 'New Delhi', code: 'NDLS', arrTime: '04:55 PM', halt: 'Origin', dist: 0, status: 'passed', isMajor: true },
  { name: 'Mathura Jn', code: 'MTJ', arrTime: '06:40 PM', halt: '2 mins', dist: 141, status: 'passed', isMajor: false },
  { name: 'Kota Jn', code: 'KOTA', arrTime: '09:00 PM', halt: '10 mins', dist: 465, status: 'passed', isMajor: true },
  { name: 'Ratlam Jn', code: 'RTM', arrTime: '12:05 AM', halt: '5 mins', dist: 731, status: 'approaching', isMajor: true },
  { name: 'Vadodara Jn', code: 'BRC', arrTime: '03:20 AM', halt: '10 mins', dist: 992, status: 'upcoming', isMajor: true },
  { name: 'Surat', code: 'ST', arrTime: '04:45 AM', halt: '5 mins', dist: 1122, status: 'upcoming', isMajor: true },
  { name: 'Mumbai Central', code: 'MMCT', arrTime: '08:35 AM', halt: 'Destination', dist: 1386, status: 'upcoming', isMajor: true }
]

const DELHI_VARANASI = [
  { name: 'New Delhi', code: 'NDLS', arrTime: '06:00 AM', halt: 'Origin', dist: 0, status: 'passed', isMajor: true },
  { name: 'Mathura Jn', code: 'MTJ', arrTime: '07:25 AM', halt: '2 mins', dist: 141, status: 'passed', isMajor: false },
  { name: 'Agra Cantt', code: 'AGC', arrTime: '08:05 AM', halt: '5 mins', dist: 195, status: 'passed', isMajor: true },
  { name: 'Gwalior Jn', code: 'GWL', arrTime: '09:20 AM', halt: '3 mins', dist: 313, status: 'approaching', isMajor: true },
  { name: 'Jhansi Jn', code: 'VGLJ', arrTime: '10:45 AM', halt: '8 mins', dist: 410, status: 'upcoming', isMajor: true },
  { name: 'Kanpur Central', code: 'CNB', arrTime: '12:30 PM', halt: '10 mins', dist: 630, status: 'upcoming', isMajor: true },
  { name: 'Varanasi Jn', code: 'BSB', arrTime: '02:00 PM', halt: 'Destination', dist: 780, status: 'upcoming', isMajor: true }
]

const MUMBAI_AHMEDABAD = [
  { name: 'Ahmedabad Jn', code: 'ADI', arrTime: '06:40 AM', halt: 'Origin', dist: 0, status: 'passed', isMajor: true },
  { name: 'Nadiad Jn', code: 'ND', arrTime: '07:19 AM', halt: '2 mins', dist: 46, status: 'passed', isMajor: false },
  { name: 'Vadodara Jn', code: 'BRC', arrTime: '08:03 AM', halt: '5 mins', dist: 100, status: 'passed', isMajor: true },
  { name: 'Surat', code: 'ST', arrTime: '09:35 AM', halt: '5 mins', dist: 230, status: 'approaching', isMajor: true },
  { name: 'Vapi', code: 'VAPI', arrTime: '10:46 AM', halt: '2 mins', dist: 325, status: 'upcoming', isMajor: false },
  { name: 'Mumbai Central', code: 'MMCT', arrTime: '01:05 PM', halt: 'Destination', dist: 493, status: 'upcoming', isMajor: true }
]

/**
 * The station list for a journey.
 *
 * Algorithm in plain English:
 *   Match the trip against the corridors we hold real station data for, using
 *   the train number first and the route text as a fallback. When nothing
 *   matches, return just the origin and destination read out of the trip rather
 *   than inventing stations: a made-up "Junction A" on a route we know nothing
 *   about is worse than an honest two-stop line.
 *
 * @param {Object} trip - active trip with trainNumber, from and to
 * @returns {Array<Object>} waypoints, origin first
 */
export function getRouteWaypoints(trip) {
  if (!trip) return []

  const number = String(trip.trainNumber || '')
  const routeText = `${trip.from || ''} ${trip.to || ''} ${trip.trainName || ''}`.toUpperCase()

  if (['19020', '12952', '12954', '12925', '12903', '20901', '12951'].includes(number) ||
      (routeText.includes('MMCT') && routeText.includes('NDLS'))) {
    return DELHI_MUMBAI
  }

  if (['22436', '14258', '12392'].includes(number) || routeText.includes('BSB')) {
    return DELHI_VARANASI
  }

  if (['82902', '12934', '12902'].includes(number) || routeText.includes('ADI')) {
    return MUMBAI_AHMEDABAD
  }

  const fromName = (trip.from || 'Origin').split('(')[0].trim()
  const fromCode = /\(([^)]+)\)/.exec(trip.from || '')?.[1] || 'DEP'
  const toName = (trip.to || 'Destination').split('(')[0].trim()
  const toCode = /\(([^)]+)\)/.exec(trip.to || '')?.[1] || 'ARR'

  return [
    { name: fromName, code: fromCode, arrTime: '', halt: 'Origin', dist: 0, status: 'passed', isMajor: true },
    { name: toName, code: toCode, arrTime: '', halt: 'Destination', dist: 0, status: 'upcoming', isMajor: true }
  ]
}

/**
 * How far along the route the train currently is, as a fraction.
 *
 * Algorithm in plain English:
 *   Find the station the train is approaching. Everything before it has been
 *   passed, so express its distance as a share of the total route distance.
 *   Falls back to counting stations when the data carries no distances, and to
 *   the midpoint when there is nothing useful to go on.
 *
 * @param {Array<Object>} waypoints - route waypoints
 * @returns {Number} 0 to 1
 */
export function getRouteProgress(waypoints) {
  if (!waypoints || waypoints.length < 2) return 0

  const total = waypoints[waypoints.length - 1].dist
  const currentIndex = waypoints.findIndex((stop) => stop.status === 'approaching')
  const index = currentIndex === -1
    ? waypoints.filter((stop) => stop.status === 'passed').length - 1
    : currentIndex

  if (total > 0) {
    return Math.max(0, Math.min(1, (waypoints[Math.max(0, index)].dist || 0) / total))
  }
  return Math.max(0, Math.min(1, Math.max(0, index) / (waypoints.length - 1)))
}
