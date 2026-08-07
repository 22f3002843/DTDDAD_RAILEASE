import { defineStore } from 'pinia'
import { ref } from 'vue'
import { MOCK_UPCOMING_TRIPS, HIGH_STAKES_TYPES, LIVE_NETWORK_STATUS } from '@/data/journeys'
import { MOCK_TRAINS } from '@/data/trains'

const STORAGE_KEY_ACTIVE_TRIP = 'railease_active_trip'
const STORAGE_KEY_UPCOMING = 'railease_upcoming_trips'

function loadSavedActiveTrip() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_TRIP)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.warn('[RailEase Store] Could not parse saved active trip', e)
  }
  return MOCK_UPCOMING_TRIPS[0]
}

function loadSavedUpcomingTrips() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_UPCOMING)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.warn('[RailEase Store] Could not parse saved upcoming trips', e)
  }
  return [...MOCK_UPCOMING_TRIPS]
}

export const useJourneyStore = defineStore('journey', () => {
  const upcomingTrips = ref(loadSavedUpcomingTrips())
  const selectedStakesType = ref('exam')
  const networkStatus = ref([...LIVE_NETWORK_STATUS])

  // Current Active Journey initialized from localStorage persistence
  const activeTrip = ref(loadSavedActiveTrip())

  function saveStateToLocalStorage() {
    try {
      if (activeTrip.value) {
        localStorage.setItem(STORAGE_KEY_ACTIVE_TRIP, JSON.stringify(activeTrip.value))
      }
      localStorage.setItem(STORAGE_KEY_UPCOMING, JSON.stringify(upcomingTrips.value))
    } catch (e) {
      console.warn('[RailEase Store] Error saving state to localStorage', e)
    }
  }

  function selectTrip(trip) {
    activeTrip.value = trip
    saveStateToLocalStorage()
  }

  function setStakesType(typeId) {
    selectedStakesType.value = typeId
  }

  // Mark a train from Search Results as the User's Active Journey for RailEase Safeguards
  function setActiveTripFromTrain(train, dateStr, optionalPnr) {
    const generatedPnr = optionalPnr || `${Math.floor(1000000000 + Math.random() * 9000000000)}`
    
    const newTrip = {
      id: `pnr_${generatedPnr}`,
      pnr: generatedPnr,
      trainNumber: train.number,
      trainName: train.name,
      from: `${train.fromName} (${train.fromCode})`,
      to: `${train.toName} (${train.toCode})`,
      date: dateStr || 'Fri, 07 Aug 2026',
      seatInfo: 'Coach B1 • Seat 24 (Selected for RailEase Safeguards)',
      status: 'Confirmed & Synced',
      statusType: 'success',
      riskScore: train.punctualityScore || 92,
      delayProbability: train.punctualityScore >= 90 ? '6%' : train.punctualityScore >= 75 ? '18%' : '45%',
      crowdForecast: train.crowdLevel || 'Moderate',
      weatherImpact: 'Clear',
      routeReliability: `${train.punctualityScore || 90}%`,
      currentStepIndex: 2,
      timeline: [
        { label: 'Booked on Ticket Platform', time: 'Completed externally', completed: true },
        { label: 'RailEase Safeguards Synced', time: 'Just now', active: true },
        { label: 'Departed', time: `${train.deptTime || '06:00 AM'}`, completed: false },
        { label: 'In Progress', time: `En route to ${train.toName}`, completed: false },
        { label: 'Arriving', time: `Estimated ${train.arrTime || '02:00 PM'}`, completed: false }
      ],
      predictedArrival: train.arrTime || '02:00 PM',
      predictionInsights: [
        `Historical 30-day punctuality score for ${train.name} is ${train.punctualityScore || 92}%`,
        `RailEase live satellite radar locked for ${train.fromName} -> ${train.toName} corridor`,
        'All eCatering, PNR alerts, and community feeds synced for this train'
      ]
    }

    // Check if trip already exists in list
    const existingIdx = upcomingTrips.value.findIndex(t => t.trainNumber === train.number || t.pnr === generatedPnr)
    if (existingIdx !== -1) {
      upcomingTrips.value[existingIdx] = newTrip
    } else {
      upcomingTrips.value.unshift(newTrip)
    }

    activeTrip.value = newTrip
    saveStateToLocalStorage()
    return newTrip
  }

  // Fetch / Sync Trip by PNR Number
  function fetchAndSetActiveTripByPnr(pnrInput) {
    const cleanPnr = (pnrInput || '').trim()
    if (!cleanPnr) return null

    // Check existing mock upcoming trips first
    const existing = upcomingTrips.value.find(t => t.pnr === cleanPnr)
    if (existing) {
      activeTrip.value = existing
      saveStateToLocalStorage()
      return existing
    }

    // Try finding matching train in database or select first available
    const matchedTrain = MOCK_TRAINS.find(t => t.number.includes(cleanPnr) || t.id.includes(cleanPnr)) || MOCK_TRAINS[0]
    return setActiveTripFromTrain(matchedTrain, 'Fri, 07 Aug 2026', cleanPnr)
  }

  return {
    upcomingTrips,
    selectedStakesType,
    networkStatus,
    activeTrip,
    selectedJourney: activeTrip, // Backward compatibility alias
    highStakesTypes: HIGH_STAKES_TYPES,
    selectTrip,
    setStakesType,
    setActiveTripFromTrain,
    fetchAndSetActiveTripByPnr
  }
})
