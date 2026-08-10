/**
 * Confidence scoring.
 *
 * What this answers: "how likely is this train to get me there acceptably?"
 *
 * This is deliberately not the same thing as punctuality. Two trains can share
 * an on-time rate and still deserve different scores, because a train that is
 * reliably twenty minutes late is more useful than one that is randomly between
 * zero and three hours late. A passenger can plan around a predictable offset;
 * they cannot plan around variance. Consistency is therefore weighted as heavily
 * as major delays below, and that judgement is the reason this file exists
 * rather than the app simply displaying punctualityScore.
 *
 * Every function here is pure: (input) => output.
 */

import { getHistory } from './history'

// Delay thresholds, in minutes, that separate qualitatively different outcomes.
// A three-hour delay is not "more" than a one-hour delay; it is a different
// event that destroys the trip, so it is scored separately rather than linearly.
const MINOR_DELAY = 15
const MAJOR_DELAY = 60
const SEVERE_DELAY = 180

/**
 * Break a train's history into the rates the scoring model needs.
 *
 * Algorithm in plain English:
 *   Drop cancelled days from the delay statistics, because a cancellation is a
 *   different failure from a delay and averaging them together would understate
 *   both. Count what share of the remaining days landed in each severity band,
 *   and measure how spread out the delays are. Return the rates plus the raw
 *   figures callers need for messaging.
 *
 * @param {Object} train - train object
 * @returns {Object|null} rates and counts, or null when there is no history
 */
export function analyseHistory(train) {
  const history = getHistory(train)
  if (!history.length) return null

  const running = history.filter((entry) => !entry.cancelled)
  if (!running.length) return null

  const delays = running.map((entry) => entry.delayMinutes || 0)
  const total = delays.length

  const onTime = delays.filter((minutes) => minutes <= 0).length
  const withinMinor = delays.filter((minutes) => minutes <= MINOR_DELAY).length
  const major = delays.filter((minutes) => minutes > MAJOR_DELAY).length
  const severe = delays.filter((minutes) => minutes > SEVERE_DELAY).length

  const mean = delays.reduce((sum, minutes) => sum + minutes, 0) / total
  const variance = delays.reduce((sum, minutes) => sum + (minutes - mean) ** 2, 0) / total
  const standardDeviation = Math.sqrt(variance)

  const sorted = [...delays].sort((a, b) => a - b)

  return {
    totalDays: total,
    cancelledDays: history.length - running.length,
    onTimeDays: onTime,
    onTimeRate: onTime / total,
    withinMinorRate: withinMinor / total,
    majorRate: major / total,
    severeRate: severe / total,
    majorDays: major,
    meanDelay: mean,
    standardDeviation,
    medianDelay: sorted[Math.floor(sorted.length / 2)],
    p90Delay: sorted[Math.floor(sorted.length * 0.9)],
    worstDelay: sorted[sorted.length - 1]
  }
}

/**
 * The base confidence score, before the traveller's priority is applied.
 *
 * Algorithm in plain English:
 *   Combine three signals. Half the score is how often the train arrives within
 *   a quarter of an hour, because that is what a passenger thinks they are
 *   asking about. A quarter is how consistent it is, for the reason given at the
 *   top of this file. The final quarter is tail risk: how bad a genuinely bad
 *   day gets, measured at the ninetieth percentile and compared against three
 *   hours. The weighted total is scaled to a 0 to 100 figure.
 *
 *   Tail risk is used rather than counting rare events. Rates like "share of days
 *   with a major delay" sit near zero even for poor trains, so subtracting them
 *   from one produces a number near one for everybody and the score stops
 *   discriminating. Asking "how bad is a bad day here" separates a train that is
 *   occasionally twenty minutes late from one that is occasionally three hours
 *   late, which is the distinction a traveller actually cares about.
 *
 * @param {Object} train - train object
 * @returns {Number} confidence from 0 to 100, or the curated score when no history
 */
export function computeBaseConfidence(train) {
  const stats = analyseHistory(train)
  if (!stats) return train.punctualityScore || 0

  // Standard deviation is normalised against two hours: a train whose delays
  // vary by two hours or more is treated as maximally unpredictable.
  const consistency = Math.max(0, 1 - stats.standardDeviation / 120)

  // A ninetieth-percentile delay of three hours or worse scores zero here.
  const tailSafety = Math.max(0, 1 - stats.p90Delay / SEVERE_DELAY)

  const score =
    0.50 * stats.withinMinorRate +
    0.25 * consistency +
    0.25 * tailSafety

  return Math.round(Math.max(0, Math.min(1, score)) * 100)
}

/**
 * Rank a train on price relative to the cheapest option on the route.
 *
 * @param {Object} train - train object
 * @param {Number} cheapestPrice - lowest price among the compared trains
 * @returns {Number} 0 to 1, where 1 is the cheapest
 */
function priceAdvantage(train, cheapestPrice) {
  if (!cheapestPrice || !train.price) return 0.5
  return Math.max(0, Math.min(1, cheapestPrice / train.price))
}

/**
 * Rank a train on comfort from crowding and service class.
 *
 * @param {Object} train - train object
 * @returns {Number} 0 to 1, where 1 is most comfortable
 */
function comfortAdvantage(train) {
  const crowdScore = { Low: 1, Moderate: 0.6, High: 0.25 }[train.crowdLevel] ?? 0.5
  const premiumTypes = ['VANDE BHARAT', 'RAJDHANI', 'SHATABDI', 'DURONTO']
  const isPremium = premiumTypes.some((type) => (train.type || '').toUpperCase().includes(type))

  return Math.max(0, Math.min(1, crowdScore * 0.7 + (isPremium ? 0.3 : 0.1)))
}

/**
 * The score actually shown to a traveller, adjusted for what they said matters.
 *
 * Algorithm in plain English:
 *   Start from the base confidence. When the traveller cares most about arriving
 *   on time, use it unchanged, since the base model already optimises for that.
 *   When they care about price or comfort, keep reliability as the majority of
 *   the score but let the other factor move it, so a cheap dependable train can
 *   outrank an expensive perfect one without reliability ever disappearing from
 *   the ranking. Finally, if this is a high-stakes journey such as an exam or a
 *   medical appointment, subtract a penalty proportional to how often the train
 *   fails catastrophically, because for those trips arriving early has almost no
 *   benefit while arriving late has an enormous cost.
 *
 * @param {Object} train - train object
 * @param {Object} options - { priority, cheapestPrice, highStakes }
 * @returns {Number} adjusted confidence from 0 to 100
 */
export function computeConfidence(train, options = {}) {
  const { priority = 'reliability', cheapestPrice = 0, highStakes = false } = options

  const base = computeBaseConfidence(train)
  let score = base

  if (priority === 'price') {
    score = base * 0.7 + priceAdvantage(train, cheapestPrice) * 100 * 0.3
  } else if (priority === 'comfort') {
    score = base * 0.7 + comfortAdvantage(train) * 100 * 0.3
  }

  if (highStakes) {
    const stats = analyseHistory(train)
    if (stats) score -= stats.severeRate * 40
  }

  return Math.round(Math.max(0, Math.min(100, score)))
}

/**
 * The plain-English verdict phrase paired with a score.
 *
 * A number is never shown without one of these. A bare "64" cannot be
 * calibrated by a passenger; "Sometimes delayed" can.
 *
 * @param {Number} score - confidence from 0 to 100
 * @returns {{phrase: String, level: 'green'|'amber'|'red'}} verdict and severity
 */
export function getVerdict(score) {
  if (score >= 85) return { phrase: 'Very likely on time', level: 'green' }
  if (score >= 70) return { phrase: 'Usually on time', level: 'green' }
  if (score >= 55) return { phrase: 'Sometimes delayed', level: 'amber' }
  if (score >= 40) return { phrase: 'Often delayed', level: 'red' }
  return { phrase: 'Frequently very late', level: 'red' }
}

/**
 * Pick the single train to recommend, or null when none qualifies.
 *
 * Algorithm in plain English:
 *   A recommendation is not simply the highest score. A train the traveller
 *   cannot board is not advice, so anything with no seat prospect at all is
 *   discarded. Neither is a train we have just called unreliable, so anything
 *   scoring in the bottom band is discarded too: recommending it would
 *   contradict the warning shown beside it.
 *
 *   Note that price is deliberately NOT used as a filter. An earlier version
 *   rejected trains costing more than a multiple of the cheapest fare, which on
 *   a route where the cheapest option is an unreserved passenger train excluded
 *   every good train and left the worst one as the recommendation. Fare spread
 *   between sleeper and premium classes is legitimate, so price is expressed
 *   through the priority weighting instead, where the traveller controls it.
 *
 * @param {Array<Object>} trains - candidate trains
 * @param {Object} options - { priority, highStakes }
 * @returns {Object|null} the recommended train
 */
export function pickBestTrain(trains, options = {}) {
  if (!Array.isArray(trains) || !trains.length) return null

  const prices = trains.map((train) => train.price).filter(Boolean)
  const cheapestPrice = prices.length ? Math.min(...prices) : 0

  const viable = trains.filter((train) => {
    const hasSeatProspect = (train.classes || []).some((cls) => cls.statusType !== 'regret')
    const notDiscouraged = computeBaseConfidence(train) >= 55
    return hasSeatProspect && notDiscouraged
  })

  if (!viable.length) return null

  return viable.reduce((best, train) => {
    const bestScore = computeConfidence(best, { ...options, cheapestPrice })
    const trainScore = computeConfidence(train, { ...options, cheapestPrice })
    return trainScore > bestScore ? train : best
  })
}

// Manual check: run this file directly to compare scoring across priorities.
if (typeof process !== 'undefined' && process.argv && process.argv[1] && process.argv[1].endsWith('scoring.js')) {
  const samples = [
    { number: '20901', punctualityScore: 95, price: 1580, crowdLevel: 'Low', type: 'VANDE BHARAT', classes: [{ statusType: 'available' }] },
    { number: '12952', punctualityScore: 89, price: 2450, crowdLevel: 'High', type: 'RAJDHANI', classes: [{ statusType: 'available' }] },
    { number: '14016', punctualityScore: 48, price: 520, crowdLevel: 'High', type: 'OTHER', classes: [{ statusType: 'wl' }] }
  ]
  const cheapestPrice = Math.min(...samples.map((t) => t.price))

  samples.forEach((train) => {
    const stats = analyseHistory(train)
    console.log(
      `train ${train.number}:`,
      `base=${computeBaseConfidence(train)}`,
      `reliability=${computeConfidence(train, { priority: 'reliability', cheapestPrice })}`,
      `price=${computeConfidence(train, { priority: 'price', cheapestPrice })}`,
      `highStakes=${computeConfidence(train, { priority: 'reliability', cheapestPrice, highStakes: true })}`,
      `| verdict="${getVerdict(computeBaseConfidence(train)).phrase}"`,
      `sd=${stats ? stats.standardDeviation.toFixed(1) : 'n/a'}`
    )
  })

  console.log('best for on-time :', pickBestTrain(samples, { priority: 'reliability' })?.number)
  console.log('best for cheapest:', pickBestTrain(samples, { priority: 'price' })?.number)
}

/**
 * How likely the traveller is to get a seat, and how confident we are saying so.
 *
 * Honesty note:
 *   We hold no waitlist clearance history, so this cannot be a learned figure.
 *   An earlier version multiplied queue position by the train's punctuality,
 *   which implied a relationship that does not exist and dressed a guess as a
 *   derived number. This version uses queue length alone, which is the only
 *   signal actually present, and the interface states that basis rather than
 *   letting the percentage imply more than it knows.
 *
 * Algorithm in plain English:
 *   Take the best class situation on the train. Open seats are certain, so
 *   nothing needs estimating. RAC means the traveller boards regardless, so it
 *   is near certain. For a waitlist, read the queue position and map it onto a
 *   confirmation chance that falls as the queue lengthens: short queues usually
 *   clear by chart preparation, long ones usually do not. A regret means the
 *   class is closed.
 *
 * @param {Object} train - train object with a classes array
 * @returns {{percent: Number|null, label: String, detail: String, level: 'green'|'amber'|'red'}}
 */
export function getSeatOutlook(train) {
  const classes = train.classes || []

  const available = classes.find((cls) => cls.statusType === 'available')
  if (available) {
    return {
      percent: 100,
      label: 'Seat available',
      detail: `Open now in ${available.name}`,
      level: 'green'
    }
  }

  const rac = classes.find((cls) => cls.statusType === 'rac')
  if (rac) {
    return {
      percent: 95,
      label: 'You will board',
      detail: `${rac.status} in ${rac.name} - seat shared until confirmed`,
      level: 'green'
    }
  }

  const waitlisted = classes.find((cls) => cls.statusType === 'wl')
  if (waitlisted) {
    const position = parseInt(/(\d+)/.exec(waitlisted.status || '')?.[1] || '99', 10)

    // Queue length is the only signal we hold. Bands rather than a smooth curve,
    // because a smooth curve would imply precision this estimate does not have.
    let percent
    if (position <= 10) percent = 85
    else if (position <= 25) percent = 60
    else if (position <= 50) percent = 35
    else if (position <= 80) percent = 15
    else percent = 5

    return {
      percent,
      label: percent >= 60 ? 'Likely to confirm' : percent >= 35 ? 'May not confirm' : 'Unlikely to confirm',
      detail: `${waitlisted.status} in ${waitlisted.name}. Estimated from queue length only.`,
      level: percent >= 60 ? 'green' : percent >= 35 ? 'amber' : 'red'
    }
  }

  return { percent: 0, label: 'No seats', detail: 'Every class is closed today', level: 'red' }
}

/**
 * How predictable the train is, as distinct from how punctual it is.
 *
 * Algorithm in plain English:
 *   Compare an ordinary day against a bad day. When those are close the train
 *   can be planned around even if it is habitually late; when they are far
 *   apart no buffer is safe. Returns the gap in minutes alongside a plain word,
 *   because "steady" and "erratic" are the distinction a traveller acts on.
 *
 * @param {Object} train - train object
 * @returns {{label: String, detail: String, level: 'green'|'amber'|'red'}}
 */
export function getPredictability(train) {
  const stats = analyseHistory(train)
  if (!stats) return { label: 'Unknown', detail: 'No running history', level: 'amber' }

  const spread = stats.p90Delay - stats.medianDelay

  if (spread <= 20) {
    return { label: 'Steady', detail: `Bad days add only ${stats.p90Delay} min`, level: 'green' }
  }
  if (spread <= 60) {
    return { label: 'Variable', detail: `Typical ${stats.medianDelay} min, bad day ${stats.p90Delay} min`, level: 'amber' }
  }
  return { label: 'Erratic', detail: `Typical ${stats.medianDelay} min, bad day ${stats.p90Delay} min`, level: 'red' }
}

/**
 * How much spare time to leave, so the score turns into an instruction.
 *
 * Algorithm in plain English:
 *   Use the ninetieth-percentile delay, rounded up to a friendly five or ten
 *   minutes, so the advice covers all but the worst one day in ten. Returns
 *   nothing when the train is dependable enough that no buffer is worth naming.
 *
 * @param {Object} train - train object
 * @returns {String|null} e.g. 'Leave 45 min spare'
 */
export function getSuggestedBuffer(train) {
  const stats = analyseHistory(train)
  if (!stats || stats.p90Delay < 15) return null

  const rounded = Math.ceil(stats.p90Delay / 15) * 15
  return `Leave ${rounded} min spare`
}
