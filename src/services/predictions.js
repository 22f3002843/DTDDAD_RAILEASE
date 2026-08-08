/**
 * Risk prediction.
 *
 * This module turns running history into the warnings a passenger did not know
 * to ask for. It is the part of the product that no competitor offers, and the
 * part that has to be most careful about honesty.
 *
 * Two rules shape every function here:
 *
 *   1. A card that does not apply is ABSENT, not greyed out and not shown as
 *      "no risk detected". Absence carries information: if a traveller sees two
 *      cards, there are exactly two things to think about. This is what allows
 *      the catalogue to grow without any screen becoming dense, and it is the
 *      mechanism that keeps the interface calm.
 *
 *   2. Every card states the evidence behind it with a denominator. "Ran late on
 *      19 of the last 30 days" can be checked by the reader; "high risk" cannot.
 *
 * Cards are returned already sorted by severity, because the scarcest resource
 * a traveller has is attention, and the thing most likely to hurt them belongs
 * at the top.
 */

import { analyseHistory } from './scoring'
import { getHistory } from './history'
import { parseTimeToMinutes, formatMinutesAsTime, getRealisticArrival } from './reliability'

// Order used when sorting the card stack.
const SEVERITY_ORDER = { high: 0, medium: 1, info: 2 }

// Arrivals between these hours are treated as the difficult small hours, when
// onward transport is scarce and expensive.
const LATE_NIGHT_START = 23 * 60
const LATE_NIGHT_END = 5 * 60

/**
 * Warn when the train will realistically land far later than the timetable says.
 *
 * Algorithm in plain English:
 *   Ask what time this train actually tends to arrive. If that is meaningfully
 *   later than the printed time, say so, and back it with how many days ran late
 *   and how bad a bad day gets. Stay silent when the typical day is close to
 *   schedule, because a warning about nothing trains people to ignore warnings.
 *
 * @param {Object} train - train object
 * @param {Object} stats - output of analyseHistory
 * @returns {Object|null} a risk card, or null when not applicable
 */
function realisticArrivalCard(train, stats) {
  const realistic = getRealisticArrival(train)
  if (!realistic) return null

  const lateDays = stats.totalDays - stats.onTimeDays

  return {
    id: 'realistic_arrival',
    severity: stats.medianDelay >= 60 ? 'high' : 'medium',
    headline: `You will probably arrive around ${realistic}, not ${String(train.arrTime).replace(/\s*\(.*\)/, '')}`,
    evidence: `This train ran late on ${lateDays} of the last ${stats.totalDays} days. A typical late day adds about ${stats.medianDelay} minutes, and a bad one adds ${stats.p90Delay}.`,
    confidence: 'likely',
    sampleSize: stats.totalDays
  }
}

/**
 * Warn when the realistic arrival lands in the small hours.
 *
 * Algorithm in plain English:
 *   Work out when the train actually tends to arrive. If the timetable promised
 *   a civilised hour but reality lands in the middle of the night, raise this.
 *   The gap between the two is the whole point: a passenger who booked a train
 *   arriving at eleven at night has not planned for a two in the morning arrival,
 *   and will discover the problem standing on a platform looking for a taxi.
 *
 * @param {Object} train - train object
 * @param {Object} stats - output of analyseHistory
 * @returns {Object|null} a risk card, or null when not applicable
 */
function lateNightArrivalCard(train, stats) {
  const scheduled = parseTimeToMinutes(train.arrTime)
  if (scheduled === null) return null

  const realisticMinutes = (scheduled + stats.medianDelay) % 1440
  const isLateNight = realisticMinutes >= LATE_NIGHT_START || realisticMinutes < LATE_NIGHT_END
  const wasScheduledLateNight = scheduled >= LATE_NIGHT_START || scheduled < LATE_NIGHT_END

  // Only worth saying when the delay is what pushes it into the small hours.
  if (!isLateNight || wasScheduledLateNight) return null

  return {
    id: 'late_night_arrival',
    severity: 'high',
    headline: 'You will likely arrive in the middle of the night',
    evidence: `Scheduled for ${formatMinutesAsTime(scheduled)}, but delays typically push arrival to around ${formatMinutesAsTime(realisticMinutes)}. Taxis are scarce at that hour and usually cost more.`,
    action: { label: 'Watch this train', type: 'watch' },
    confidence: 'likely',
    sampleSize: stats.totalDays
  }
}

/**
 * Estimate whether a waitlisted class is likely to clear.
 *
 * Algorithm in plain English:
 *   Read the waitlist position out of the status text. Compare it against how
 *   reliably this train has been running: a train that runs cleanly tends to be
 *   in steady demand with predictable turnover, so shorter waitlists on better
 *   trains clear more often. Convert position and reliability into a rough
 *   chance, then describe it in words rather than pretending to a precision the
 *   data cannot support. Skip classes that are already confirmed or fully shut.
 *
 * @param {Object} train - train object
 * @param {Object} stats - output of analyseHistory
 * @returns {Object|null} a risk card, or null when nothing is waitlisted
 */
function waitlistCard(train, stats) {
  const waitlisted = (train.classes || []).find((cls) => cls.statusType === 'wl')
  if (!waitlisted) return null

  const positionMatch = /(\d+)/.exec(waitlisted.status || '')
  if (!positionMatch) return null

  const position = parseInt(positionMatch[1], 10)

  // Shorter queues clear more often; steadier trains turn over more predictably.
  const positionFactor = Math.max(0, 1 - position / 80)
  const chance = Math.round(Math.max(5, Math.min(95, positionFactor * 100 * (0.6 + stats.onTimeRate * 0.4))))

  const outlook = chance >= 70 ? 'good' : chance >= 35 ? 'uncertain' : 'poor'
  const severity = chance >= 70 ? 'info' : chance >= 35 ? 'medium' : 'high'

  return {
    id: 'waitlist_outlook',
    severity,
    headline:
      outlook === 'good'
        ? 'Your waitlist will probably clear'
        : outlook === 'uncertain'
          ? 'Your waitlist may not clear'
          : 'Your waitlist is unlikely to clear',
    evidence: `${waitlisted.status} in ${waitlisted.name || waitlisted.code}. Based on queue length and how steadily this train runs, roughly a ${chance} in 100 chance of confirming before the chart is prepared.`,
    confidence: 'possible',
    sampleSize: stats.totalDays
  }
}

/**
 * Warn when a train is not merely late but unpredictable.
 *
 * Algorithm in plain English:
 *   Compare a typical day against a bad day. When the gap between them is wide,
 *   the train cannot be planned around at all: a passenger cannot leave a buffer
 *   for a delay whose size they cannot anticipate. This is a different and worse
 *   problem than being consistently late, so it gets its own card.
 *
 * @param {Object} train - train object
 * @param {Object} stats - output of analyseHistory
 * @returns {Object|null} a risk card, or null when the train is predictable
 */
function unpredictabilityCard(train, stats) {
  if (stats.standardDeviation < 45 || stats.p90Delay - stats.medianDelay < 60) return null

  return {
    id: 'unpredictable',
    severity: 'high',
    headline: 'This train is unpredictable, not just late',
    evidence: `A typical day runs ${stats.medianDelay} minutes behind, but a bad day runs ${stats.p90Delay}. The gap makes it hard to plan a buffer, so avoid this train if you have a fixed commitment.`,
    confidence: 'confirmed',
    sampleSize: stats.totalDays
  }
}

/**
 * Warn a high-stakes traveller specifically.
 *
 * Algorithm in plain English:
 *   For an exam, interview, medical appointment or connecting flight, the cost of
 *   being late is not proportional to the delay: any delay past the deadline is
 *   a total loss, and arriving early is worth almost nothing. So for these trips
 *   the question is not the average day but how often the train fails badly at
 *   all. Count those days and state the count plainly.
 *
 * @param {Object} train - train object
 * @param {Object} stats - output of analyseHistory
 * @param {String} highStakesType - e.g. 'exam', 'interview'
 * @returns {Object|null} a risk card, or null when not applicable
 */
function highStakesCard(train, stats, highStakesType) {
  if (!highStakesType || highStakesType === 'other') return null
  // A single bad day in a month is not a pattern. Warning on it would make the
  // app cry wolf, and a warning that fires on everything gets ignored on the
  // one train where it mattered.
  if (stats.majorDays < 2) return null

  const label = {
    exam: 'an exam',
    interview: 'an interview',
    medical: 'a medical appointment',
    flight: 'a connecting flight'
  }[highStakesType] || 'a fixed commitment'

  return {
    id: 'high_stakes_risk',
    severity: stats.majorDays >= 3 ? 'high' : 'medium',
    headline: `Risky for ${label}`,
    evidence: `This train was more than an hour late on ${stats.majorDays} of the last ${stats.totalDays} days. For a fixed commitment, consider an earlier train or a more dependable one.`,
    confidence: 'confirmed',
    sampleSize: stats.totalDays
  }
}

/**
 * Note when platform changes are common enough to catch people out.
 *
 * @param {Object} train - train object
 * @param {Object} stats - output of analyseHistory
 * @returns {Object|null} a risk card, or null when changes are rare
 */
function platformChangeCard(train, stats) {
  const history = getHistory(train)
  const changes = history.filter((entry) => entry.platformChanged).length
  if (changes < 3) return null

  return {
    id: 'platform_change',
    severity: 'medium',
    headline: 'Platform changes are common on this train',
    evidence: `The boarding platform differed from the announced one on ${changes} of the last ${history.length} days. Check the board again shortly before departure.`,
    confidence: 'confirmed',
    sampleSize: history.length
  }
}

/**
 * Acknowledge a genuinely dependable train.
 *
 * Included because a product that only ever warns becomes noise. Confirming
 * that there is nothing to worry about is itself useful information, and it
 * makes the warnings on other trains carry more weight by contrast.
 *
 * @param {Object} train - train object
 * @param {Object} stats - output of analyseHistory
 * @returns {Object|null} a risk card, or null when the train is not dependable
 */
function dependableCard(train, stats) {
  if (stats.onTimeRate < 0.85 || stats.p90Delay > 15) return null

  const tail = stats.p90Delay === 0
    ? 'and it has not had a meaningfully bad day in that window'
    : `and even a bad day only added ${stats.p90Delay} minutes`

  return {
    id: 'dependable',
    severity: 'info',
    headline: 'Nothing to worry about here',
    evidence: `Arrived on time on ${stats.onTimeDays} of the last ${stats.totalDays} days, ${tail}.`,
    confidence: 'confirmed',
    sampleSize: stats.totalDays
  }
}

/**
 * Note when this is the cheapest way to travel the route.
 *
 * @param {Object} train - train object
 * @param {Number} cheapestPrice - lowest fare among compared trains
 * @returns {Object|null} a risk card, or null when it is not the cheapest
 */
function valueCard(train, cheapestPrice) {
  if (!cheapestPrice || train.price !== cheapestPrice) return null

  return {
    id: 'cheapest_option',
    severity: 'info',
    headline: 'Cheapest option on this route',
    evidence: `At ${train.price} rupees this is the lowest fare available today. Weigh that against the reliability above before deciding.`,
    confidence: 'confirmed',
    sampleSize: 0
  }
}

/**
 * Build the full, severity-ordered stack of risk cards for a train.
 *
 * Algorithm in plain English:
 *   Summarise the running history once, then offer that summary to every card
 *   generator in turn. Each generator returns a card only when it has something
 *   genuinely worth saying, and null otherwise. Drop the nulls, then sort what
 *   remains so the most serious warning is read first. The result may legitimately
 *   be a single card, or none at all for an unremarkable train.
 *
 * Input:  train object; context { highStakesType, cheapestPrice }
 * Output: array of card objects, each shaped
 *         { id, severity, headline, evidence, action?, confidence, sampleSize }
 *
 * @param {Object} train - train object
 * @param {Object} context - optional { highStakesType, cheapestPrice }
 * @returns {Array<Object>} severity-ordered risk cards
 */
export function generateRiskCards(train, context = {}) {
  const stats = analyseHistory(train)
  if (!stats) return []

  const { highStakesType = null, cheapestPrice = 0 } = context

  const cards = [
    unpredictabilityCard(train, stats),
    realisticArrivalCard(train, stats),
    lateNightArrivalCard(train, stats),
    highStakesCard(train, stats, highStakesType),
    waitlistCard(train, stats),
    platformChangeCard(train, stats),
    dependableCard(train, stats),
    valueCard(train, cheapestPrice)
  ].filter(Boolean)

  // The all-clear card cannot coexist with a warning. Telling a traveller there
  // is nothing to worry about directly beneath a red warning destroys trust in
  // both statements, so the reassurance yields whenever a real concern exists.
  const hasConcern = cards.some((card) => card.severity !== 'info')
  const resolved = hasConcern ? cards.filter((card) => card.id !== 'dependable') : cards

  return resolved.sort(
    (a, b) => (SEVERITY_ORDER[a.severity] ?? 3) - (SEVERITY_ORDER[b.severity] ?? 3)
  )
}
