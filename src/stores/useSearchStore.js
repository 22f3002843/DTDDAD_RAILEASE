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
  // What the traveller said matters most: 'reliability' | 'price' | 'comfort'.
  // Set from the landing search card; drives the default ranking of results.
  const travelPriority = ref('reliability')

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

    // 2. Ensure every station search includes at least 1 Red (<75%) unreliable train
    const hasRedTrain = directMatches.some(t => (t.reliabilityColor === 'red' || t.punctualityScore < 75))

    if (!hasRedTrain || directMatches.length < 4) {
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
          reliabilityColor: 'green',
          crowdLevel: 'Low',
          price: 1580,
          classes: [
            { code: 'EC', name: 'Executive Chair', price: 2850, status: 'AVAILABLE-18', statusType: 'available' },
            { code: 'CC', name: 'AC Chair Car', price: 1580, status: 'RAC 12', statusType: 'rac' }
          ],
          features: ['High Speed Chair Car', 'Wi-Fi Onboard'],
          runsOn: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
          historyLogs: [
            { day: 'Mon, 03 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '96 km/h' },
            { day: 'Tue, 04 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '95 km/h' },
            { day: 'Wed, 05 Aug', status: 'Delayed +3m', delayMinutes: 3, originDept: 'On Time', destArr: '+3m', avgSpeed: '94 km/h' },
            { day: 'Fri, 07 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '96 km/h' },
            { day: 'Sat, 01 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '95 km/h' },
            { day: 'Sun, 02 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '96 km/h' }
          ]
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
          duration: '11h 30m',
          speedCategory: 'Fastest',
          punctualityScore: 89,
          reliabilityRating: 'Moderate Reliability',
          reliabilityColor: 'yellow',
          crowdLevel: 'High',
          price: 2350,
          classes: [
            { code: '1A', name: 'First AC', price: 4500, status: 'AVAILABLE-2', statusType: 'available' },
            { code: '2A', name: 'Second AC', price: 2850, status: 'RAC 4', statusType: 'rac' },
            { code: '3A', name: 'Third AC', price: 2350, status: 'WL 42', statusType: 'wl' }
          ],
          features: ['Pantry Included', 'Priority Track'],
          runsOn: ['Daily'],
          historyLogs: [
            { day: 'Mon, 03 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '88 km/h' },
            { day: 'Tue, 04 Aug', status: 'Delayed +12m', delayMinutes: 12, originDept: '+4m', destArr: '+12m', avgSpeed: '85 km/h' },
            { day: 'Wed, 05 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '89 km/h' },
            { day: 'Thu, 06 Aug', status: 'Delayed +8m', delayMinutes: 8, originDept: '+2m', destArr: '+8m', avgSpeed: '87 km/h' },
            { day: 'Fri, 07 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '88 km/h' },
            { day: 'Sat, 01 Aug', status: 'Delayed +14m', delayMinutes: 14, originDept: '+5m', destArr: '+14m', avgSpeed: '84 km/h' },
            { day: 'Sun, 02 Aug', status: 'On Time', delayMinutes: 0, originDept: 'On Time', destArr: 'On Time', avgSpeed: '89 km/h' }
          ]
        },
        {
          id: `tr_gen_3_red_${fromCode}_${toCode}`,
          number: '14016',
          name: `${fromCity} - ${toCity} Seemanchal Passenger Mail`,
          type: 'OTHER',
          fromCode: fromCode,
          fromName: fromName,
          toCode: toCode,
          toName: toName,
          deptTime: '01:15 PM',
          arrTime: '11:45 AM (+1 day)',
          duration: '22h 30m',
          speedCategory: 'Cheapest',
          punctualityScore: 48,
          reliabilityRating: 'High Delay Risk (Unreliable)',
          reliabilityColor: 'red',
          crowdLevel: 'High',
          price: 520,
          classes: [
            { code: '3A', name: 'Third AC', price: 1350, status: 'GNWL 62', statusType: 'wl' },
            { code: 'SL', name: 'Sleeper (SL)', price: 520, status: 'REGRET', statusType: 'regret' }
          ],
          features: ['Heavy Section Congestion', 'Not Recommended for Time-Sensitive Travel'],
          runsOn: ['Daily'],
          historyLogs: [
            { day: 'Mon, 03 Aug', status: 'Delayed +140m', delayMinutes: 140, originDept: '+60m', destArr: '+140m', avgSpeed: '42 km/h' },
            { day: 'Tue, 04 Aug', status: 'Delayed +95m', delayMinutes: 95, originDept: '+40m', destArr: '+95m', avgSpeed: '48 km/h' },
            { day: 'Wed, 05 Aug', status: 'Delayed +120m', delayMinutes: 120, originDept: '+55m', destArr: '+120m', avgSpeed: '45 km/h' },
            { day: 'Thu, 06 Aug', status: 'Delayed +180m', delayMinutes: 180, originDept: '+80m', destArr: '+180m', avgSpeed: '38 km/h' },
            { day: 'Fri, 07 Aug', status: 'Delayed +60m', delayMinutes: 60, originDept: '+25m', destArr: '+60m', avgSpeed: '52 km/h' },
            { day: 'Sat, 01 Aug', status: 'Delayed +110m', delayMinutes: 110, originDept: '+45m', destArr: '+110m', avgSpeed: '46 km/h' },
            { day: 'Sun, 02 Aug', status: 'Delayed +85m', delayMinutes: 85, originDept: '+35m', destArr: '+85m', avgSpeed: '50 km/h' }
          ]
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

    // Sorting.
    //
    // An explicit filter chosen by the user always wins. When none is set we do
    // NOT fall back to source order or departure time: results are ranked by the
    // traveller's stated priority, defaulting to reliability. Ranking is the
    // product's opinion, and sorting by confidence rather than by clock time is
    // the most visible expression of what RailEase is for.
    if (activeFilter.value === 'Fastest') {
      result = result.sort((a, b) => parseFloat(a.duration) - parseFloat(b.duration))
    } else if (activeFilter.value === 'Most Reliable') {
      result = result.sort((a, b) => b.punctualityScore - a.punctualityScore)
    } else if (activeFilter.value === 'Cheapest') {
      result = result.sort((a, b) => a.price - b.price)
    } else if (travelPriority.value === 'price') {
      // Cheapest first, but reliability breaks ties so a cheap unreliable train
      // never outranks an equally cheap dependable one.
      result = [...result].sort(
        (a, b) => a.price - b.price || b.punctualityScore - a.punctualityScore
      )
    } else if (travelPriority.value === 'comfort') {
      // Lower crowding first, reliability as the tiebreaker.
      const crowdRank = { Low: 0, Moderate: 1, High: 2 }
      result = [...result].sort(
        (a, b) =>
          (crowdRank[a.crowdLevel] ?? 1) - (crowdRank[b.crowdLevel] ?? 1) ||
          b.punctualityScore - a.punctualityScore
      )
    } else {
      result = [...result].sort((a, b) => b.punctualityScore - a.punctualityScore)
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
    travelPriority,
    activeFilter,
    selectedJourneyClasses,
    selectedTrainTypes,
    selectedTimeSlot,
    availableTrains,
    filteredTrains,
    swapStations
  }
})
