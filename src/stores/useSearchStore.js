import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { MOCK_TRAINS } from '@/data/trains'
import { POPULAR_STATIONS } from '@/data/stations'

export const useSearchStore = defineStore('search', () => {
  const fromStation = ref(POPULAR_STATIONS[0]) // NDLS
  const toStation = ref(POPULAR_STATIONS[1])   // MMCT
  const travelDate = ref(new Date().toISOString().split('T')[0])
  const selectedClass = ref('All Classes')
  const selectedQuota = ref('GENERAL')
  const travelPurpose = ref('')
  const activeFilter = ref('All') // 'Fastest', 'Most Reliable', 'Cheapest'

  // Refine Results Sidebar Filters (IRCTC Style)
  const selectedJourneyClasses = ref(['1A', '2A', '3A', '3E', 'SL', 'EC', 'CC'])
  const selectedTrainTypes = ref(['RAJDHANI', 'VANDE BHARAT', 'SHATABDI', 'DURONTO', 'OTHER'])
  const selectedTimeSlot = ref('all') // 'early', 'morning', 'midday', 'night', 'all'

  const availableTrains = ref([...MOCK_TRAINS])

  function swapStations() {
    const temp = fromStation.value
    fromStation.value = toStation.value
    toStation.value = temp
  }

  // Bi-directional & Multi-category search algorithm
  const filteredTrains = computed(() => {
    const fromCode = fromStation.value?.code || 'NDLS'
    const toCode = toStation.value?.code || 'MMCT'
    const fromName = fromStation.value?.name || 'Origin Station'
    const toName = toStation.value?.name || 'Destination Station'
    const fromCity = fromStation.value?.city || 'Origin'
    const toCity = toStation.value?.city || 'Destination'

    // 1. Bi-directional matching from hardcoded database
    let directMatches = availableTrains.value.filter(
      t => (t.fromCode === fromCode && t.toCode === toCode) ||
           (t.fromCode === toCode && t.toCode === fromCode)
    ).map(t => {
      if (t.fromCode !== fromCode) {
        return {
          ...t,
          fromCode: fromCode,
          fromName: fromName,
          toCode: toCode,
          toName: toName,
        }
      }
      return t
    })

    // 2. Fallback generator if fewer than 4 direct trains exist
    if (directMatches.length < 4) {
      const generated = [
        {
          id: `tr_gen_1_${fromCode}_${toCode}`,
          number: '20901',
          name: `${fromCity} - ${toCity} Vande Bharat Express`,
          type: 'VANDE BHARAT',
          fromCode: fromCode,
          fromName: fromName,
          toCode: toCode,
          toName: toName,
          deptTime: '06:00 AM',
          arrTime: '01:30 PM',
          duration: '7h 30m',
          speedCategory: 'Fastest',
          punctualityScore: 95,
          reliabilityRating: 'High Reliability',
          crowdLevel: 'Low',
          price: 1580,
          classes: [
            { code: 'EC', name: 'Executive Chair', price: 2850, status: 'AVAILABLE-18', statusType: 'available' },
            { code: 'CC', name: 'AC Chair Car', price: 1580, status: 'AVAILABLE-82', statusType: 'available' }
          ],
          features: ['High Speed Chair Car', 'Wi-Fi Onboard'],
          runsOn: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat', 'Sun']
        },
        {
          id: `tr_gen_2_${fromCode}_${toCode}`,
          number: '12951',
          name: `${fromCity} ${toCity} Superfast Rajdhani`,
          type: 'RAJDHANI',
          fromCode: fromCode,
          fromName: fromName,
          toCode: toCode,
          toName: toName,
          deptTime: '07:50 PM',
          arrTime: '05:20 AM (+1 day)',
          duration: '33h 30m',
          speedCategory: 'Fastest',
          punctualityScore: 92,
          reliabilityRating: 'High Reliability',
          crowdLevel: 'High',
          price: 2350,
          classes: [
            { code: '1A', name: 'First AC', price: 4500, status: 'AVAILABLE-2', statusType: 'available' },
            { code: '2A', name: 'Second AC', price: 2850, status: 'AVAILABLE-14', statusType: 'available' },
            { code: '3A', name: 'Third AC', price: 2350, status: 'AVAILABLE-95', statusType: 'available' }
          ],
          features: ['Pantry Included', 'Priority Track'],
          runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        {
          id: `tr_gen_3_${fromCode}_${toCode}`,
          number: '12630',
          name: `YPR S KRNTI EXP`,
          type: 'OTHER',
          fromCode: fromCode,
          fromName: fromName,
          toCode: toCode,
          toName: toName,
          deptTime: '08:30 AM',
          arrTime: '05:25 AM (+2 days)',
          duration: '44h 55m',
          speedCategory: 'Cheapest',
          punctualityScore: 89,
          reliabilityRating: 'High',
          crowdLevel: 'Moderate',
          price: 1050,
          classes: [
            { code: 'SL', name: 'Sleeper (SL)', price: 720, status: 'RAC 12', statusType: 'rac' },
            { code: '3E', name: 'AC 3 Economy (3E)', price: 1250, status: 'AVAILABLE-30', statusType: 'available' },
            { code: '3A', name: 'AC 3 Tier (3A)', price: 1450, status: 'AVAILABLE-42', statusType: 'available' },
            { code: '2A', name: 'AC 2 Tier (2A)', price: 2150, status: 'AVAILABLE-8', statusType: 'available' },
            { code: '1A', name: 'AC First Class (1A)', price: 3450, status: 'AVAILABLE-4', statusType: 'available' }
          ],
          features: ['Superfast Service', 'Pantry Car'],
          runsOn: ['Mon', 'Wed', 'Thu', 'Sat', 'Sun']
        },
        {
          id: `tr_gen_4_${fromCode}_${toCode}`,
          number: '12250',
          name: `${toCity} AC Duronto`,
          type: 'DURONTO',
          fromCode: fromCode,
          fromName: fromName,
          toCode: toCode,
          toName: toName,
          deptTime: '11:00 PM',
          arrTime: '08:30 AM (+1 day)',
          duration: '9h 30m',
          speedCategory: 'Fastest',
          punctualityScore: 89,
          reliabilityRating: 'High',
          crowdLevel: 'Low',
          price: 1450,
          classes: [
            { code: '2A', name: 'Second AC', price: 2150, status: 'AVAILABLE-15', statusType: 'available' },
            { code: '3A', name: 'Third AC', price: 1450, status: 'AVAILABLE-45', statusType: 'available' }
          ],
          features: ['Non-Stop Express', 'Clean Bedding'],
          runsOn: ['Tue', 'Thu', 'Sat']
        }
      ]

      const existingIds = new Set(directMatches.map(t => t.number))
      generated.forEach(g => {
        if (!existingIds.has(g.number)) {
          directMatches.push(g)
        }
      })
    }

    let result = [...directMatches]

    // Apply Journey Class filter
    if (selectedJourneyClasses.value.length > 0) {
      result = result.filter(t => t.classes.some(c => selectedJourneyClasses.value.includes(c.code)))
    }

    // Apply Train Type filter
    if (selectedTrainTypes.value.length > 0) {
      result = result.filter(t => {
        const typeUpper = (t.type || '').toUpperCase()
        if (selectedTrainTypes.value.includes('OTHER')) {
          if (!['RAJDHANI', 'VANDE BHARAT', 'SHATABDI', 'DURONTO'].includes(typeUpper)) return true
        }
        return selectedTrainTypes.value.includes(typeUpper)
      })
    }

    // Apply Departure Time slot filter
    if (selectedTimeSlot.value !== 'all') {
      result = result.filter(t => {
        const hour = parseInt(t.deptTime.split(':')[0]) + (t.deptTime.includes('PM') && !t.deptTime.startsWith('12') ? 12 : 0)
        if (selectedTimeSlot.value === 'early') return hour >= 0 && hour < 6
        if (selectedTimeSlot.value === 'morning') return hour >= 6 && hour < 12
        if (selectedTimeSlot.value === 'midday') return hour >= 12 && hour < 18
        if (selectedTimeSlot.value === 'night') return hour >= 18 && hour < 24
        return true
      })
    }

    // Sorting
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
    selectedQuota,
    travelPurpose,
    activeFilter,
    selectedJourneyClasses,
    selectedTrainTypes,
    selectedTimeSlot,
    availableTrains,
    filteredTrains,
    swapStations
  }
})
