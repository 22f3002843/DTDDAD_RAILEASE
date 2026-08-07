import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { MOCK_TRAINS } from '@/data/trains'
import { POPULAR_STATIONS } from '@/data/stations'

export const useSearchStore = defineStore('search', () => {
  const fromStation = ref(POPULAR_STATIONS[0]) // NDLS
  const toStation = ref(POPULAR_STATIONS[1])   // MMCT
  const travelDate = ref(new Date().toISOString().split('T')[0])
  const selectedClass = ref('All Classes')
  const travelPurpose = ref('')
  const activeFilter = ref('All') // 'Fastest', 'Most Reliable', 'Cheapest'

  const availableTrains = ref([...MOCK_TRAINS])

  function swapStations() {
    const temp = fromStation.value
    fromStation.value = toStation.value
    toStation.value = temp
  }

  const filteredTrains = computed(() => {
    const fromCode = fromStation.value?.code || 'NDLS'
    const toCode = toStation.value?.code || 'MMCT'

    // Match trains by station pair
    let match = availableTrains.value.filter(
      t => (t.fromCode === fromCode && t.toCode === toCode) ||
           (t.fromCode === toCode && t.toCode === fromCode)
    )

    // Fallback if specific route doesn't have exact hardcoded trains
    if (match.length === 0) {
      match = availableTrains.value.slice(0, 5).map(t => ({
        ...t,
        fromCode: fromCode,
        fromName: fromStation.value?.name || 'Origin Station',
        toCode: toCode,
        toName: toStation.value?.name || 'Destination Station'
      }))
    }

    let result = [...match]

    if (selectedClass.value && selectedClass.value !== 'All Classes') {
      result = result.filter(t => t.classes.some(c => c.code === selectedClass.value))
    }

    if (activeFilter.value === 'Fastest') {
      result = result.sort((a, b) => parseFloat(a.duration) - parseFloat(b.duration))
    } else if (activeFilter.value === 'Most Reliable') {
      result = result.sort((a, b) => b.punctualityScore - a.punctualityScore)
    } else if (activeFilter.value === 'Cheapest') {
      result = result.sort((a, b) => a.price - b.price)
    }

    return result
  })

  return {
    fromStation,
    toStation,
    travelDate,
    selectedClass,
    travelPurpose,
    activeFilter,
    availableTrains,
    filteredTrains,
    swapStations
  }
})
