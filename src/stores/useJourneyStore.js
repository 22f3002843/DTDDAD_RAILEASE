import { defineStore } from 'pinia'
import { ref } from 'vue'
import { MOCK_UPCOMING_TRIPS, HIGH_STAKES_TYPES, LIVE_NETWORK_STATUS } from '@/data/journeys'

export const useJourneyStore = defineStore('journey', () => {
  const upcomingTrips = ref([...MOCK_UPCOMING_TRIPS])
  const selectedStakesType = ref('exam')
  const networkStatus = ref([...LIVE_NETWORK_STATUS])

  const selectedJourney = ref(MOCK_UPCOMING_TRIPS[0])

  function selectTrip(trip) {
    selectedJourney.value = trip
  }

  function setStakesType(typeId) {
    selectedStakesType.value = typeId
  }

  return {
    upcomingTrips,
    selectedStakesType,
    networkStatus,
    selectedJourney,
    highStakesTypes: HIGH_STAKES_TYPES,
    selectTrip,
    setStakesType
  }
})
