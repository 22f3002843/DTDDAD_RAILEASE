/**
 * Running-history synthesis.
 *
 * Why this file exists:
 *   The app ships with 7 hand-authored days of history per train. Seven points
 *   cannot support a median, a percentile, or any honest probability statement.
 *   Rather than hand-maintaining 300 rows of fake data, this module derives a
 *   30-day window from the figure a human already curated: punctualityScore.
 *
 * Why the delays are not uniform random:
 *   Real train delays are right-skewed. Most days cluster near zero and a long
 *   tail of severe delays sits far out. A uniform distribution would produce a
 *   dataset where "typical" and "worst" are close together, and every downstream
 *   statistic (median, tail risk, buffer advice) would behave nothing like
 *   reality. The generator below draws from an exponential-shaped tail so the
 *   synthetic data has the same shape as the real phenomenon.
 *
 * Determinism:
 *   A seeded pseudo-random generator is used, keyed on the train number, so the
 *   same train always produces the same history across reloads. Without this the
 *   score would drift every time the page refreshed, which would destroy the
 *   one thing this product sells: numbers a user can trust and re-check.
 */

// Days of history the derivation layer expects to work with.
const HISTORY_WINDOW_DAYS = 30

// Roughly 3 in 100 running days are treated as cancellations.
const CANCELLATION_RATE = 0.03

/**
 * Deterministic pseudo-random number generator (mulberry32).
 *
 * Algorithm in plain English:
 *   Hold a 32-bit integer of state. Each call advances the state by a fixed odd
 *   increment, scrambles the bits through two multiply-and-xor rounds, and maps
 *   the result into the range 0 to 1. Same seed in, same sequence out, every time.
 *
 * @param {Number} seed - any integer; the same seed yields the same sequence
 * @returns {Function} a function returning the next float in [0, 1)
 */
function createSeededRandom(seed) {
  let state = seed >>> 0

  return function next() {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Turn a train number into a stable integer seed.
 *
 * Algorithm in plain English:
 *   Walk the characters of the identifier, folding each character code into a
 *   running hash. Any string maps to the same integer every time.
 *
 * @param {String} identifier - train number or id
 * @returns {Number} a 32-bit integer seed
 */
function hashToSeed(identifier) {
  let hash = 2166136261
  const text = String(identifier || 'railease')

  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

/**
 * Label a generated day with a readable calendar date.
 *
 * Why this is not just "Day -30":
 *   The window mixes generated days with any hand-authored ones already on the
 *   train, and those carry labels like "Sun, 02 Aug". Two date formats in one
 *   table reads as a data-quality problem to anyone looking at the evidence,
 *   which is the last place this product can afford to look careless.
 *
 * Algorithm in plain English:
 *   Count backwards from today by the given number of days and format the result
 *   the same way the curated entries are written: short weekday, day of month,
 *   short month.
 *
 * @param {Number} daysAgo - how many days before today this entry represents
 * @returns {String} e.g. 'Sun, 02 Aug'
 */
function formatDayLabel(daysAgo) {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)

  const weekday = date.toLocaleDateString('en-GB', { weekday: 'short' })
  const dayOfMonth = String(date.getDate()).padStart(2, '0')
  const month = date.toLocaleDateString('en-GB', { month: 'short' })

  return `${weekday}, ${dayOfMonth} ${month}`
}

/**
 * Draw the size of one late day, shaped like real railway delays.
 *
 * Algorithm in plain English:
 *   Take a uniform number, feed it through a negative logarithm, and scale it.
 *   That shape means small delays are common and large ones are rare but
 *   possible, which is how delays actually behave. Unreliable trains get a
 *   longer scale, so their tail reaches further out. The result is floored at
 *   one minute, since this function is only called for days already known to be
 *   late, and clamped to a plausible ceiling so a single draw cannot produce an
 *   absurd twelve-hour outlier.
 *
 * @param {Function} random - seeded generator from createSeededRandom
 * @param {Number} severityScale - larger means a heavier delay tail, in minutes
 * @returns {Number} delay in whole minutes, 1 or more
 */
function drawLateMinutes(random, severityScale) {
  const exponential = -Math.log(1 - random())
  const minutes = Math.round(exponential * severityScale)

  return Math.max(1, Math.min(minutes, 360))
}

/**
 * Decide exactly which days in the window ran late.
 *
 * Why a quota rather than a coin flip per day:
 *   Drawing each day independently lets a bad seed hand a train scoring 89 a
 *   window where 29 of 30 days ran clean. The synthetic history would then
 *   contradict the badge shown beside it, and a product whose entire value is
 *   trustworthy numbers cannot contradict itself. Fixing the count removes that
 *   variance while the delay sizes stay randomly shaped.
 *
 * Algorithm in plain English:
 *   Work out how many days should run late from the on-time rate. Build a list
 *   of every day position, walk it backwards swapping each entry with an earlier
 *   one chosen by the seeded generator, then take the first N positions from the
 *   shuffled list. Those are the late days.
 *
 * @param {Function} random - seeded generator
 * @param {Number} dayCount - how many days in the window
 * @param {Number} onTimeRate - 0 to 1, target share of clean days
 * @returns {Set<Number>} the indices of days that ran late
 */
function chooseLateDays(random, dayCount, onTimeRate) {
  const lateCount = Math.round(dayCount * (1 - onTimeRate))
  const positions = Array.from({ length: dayCount }, (unused, index) => index)

  for (let i = positions.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    const swap = positions[i]
    positions[i] = positions[j]
    positions[j] = swap
  }

  return new Set(positions.slice(0, lateCount))
}

/**
 * Build a 30-day running history for a train.
 *
 * Algorithm in plain English:
 *   Seed a generator from the train number so results are stable. Convert the
 *   curated punctuality score into an on-time rate, and choose how heavy the
 *   delay tail should be: a train scoring in the nineties gets a short tail,
 *   a train in the forties gets a long one. Then walk backwards day by day from
 *   the most recent, drawing a delay for each, occasionally marking a day as
 *   cancelled, and marking platform changes more often for less reliable trains.
 *   Any hand-authored historyLogs already on the train are preserved as the most
 *   recent days, so curated detail is never thrown away.
 *
 * Input:  train object with number and punctualityScore, optional historyLogs
 * Output: array of 30 entries, oldest first, each shaped:
 *         { day, status, delayMinutes, originDept, destArr, avgSpeed,
 *           platformChanged, cancelled }
 *
 * @param {Object} train - the train to synthesise history for
 * @returns {Array<Object>} 30 day-entries, oldest first
 */
export function buildHistory(train) {
  const random = createSeededRandom(hashToSeed(train.number || train.id))
  const score = typeof train.punctualityScore === 'number' ? train.punctualityScore : 75

  const onTimeRate = Math.max(0, Math.min(1, score / 100))
  // A train that is late half the time is late by a lot; scale the tail inversely.
  const severityScale = 12 + (100 - score) * 1.6
  const platformChangeRate = (100 - score) / 400

  const curated = Array.isArray(train.historyLogs) ? train.historyLogs : []
  const generatedCount = Math.max(0, HISTORY_WINDOW_DAYS - curated.length)

  // Fix the number of late days up front so the window always agrees with the
  // curated score, then let the seeded generator decide only how bad each is.
  const lateDays = chooseLateDays(random, generatedCount, onTimeRate)

  const generated = []
  for (let dayIndex = 0; dayIndex < generatedCount; dayIndex += 1) {
    const cancelled = random() < CANCELLATION_RATE
    const delayMinutes = cancelled || !lateDays.has(dayIndex)
      ? 0
      : drawLateMinutes(random, severityScale)
    const platformChanged = random() < platformChangeRate

    generated.push({
      day: formatDayLabel(HISTORY_WINDOW_DAYS - dayIndex),
      status: cancelled ? 'Cancelled' : delayMinutes === 0 ? 'On Time' : `Delayed +${delayMinutes}m`,
      delayMinutes,
      originDept: delayMinutes === 0 ? 'On Time' : `+${Math.round(delayMinutes * 0.4)}m`,
      destArr: delayMinutes === 0 ? 'On Time' : `+${delayMinutes}m`,
      avgSpeed: `${Math.round(95 - delayMinutes * 0.08)} km/h`,
      platformChanged,
      cancelled
    })
  }

  // Curated days are the most recent, so they sit at the end of the window.
  return [...generated, ...curated.map((entry) => ({
    platformChanged: false,
    cancelled: false,
    ...entry
  }))]
}

/**
 * Cache of built windows, keyed by train identifier.
 *
 * The cache deliberately lives outside the train objects. An earlier version
 * attached the window to the train with a non-configurable property, which threw
 * as soon as a train passed through a Vue reactive proxy: the proxy cannot
 * honour a read-only own property it did not define. Keying by identifier keeps
 * the derivation layer entirely independent of how the caller wraps its data,
 * which is what a pure service layer is supposed to be.
 */
const historyCache = new Map()

/**
 * Return a train's full history, synthesising it once and reusing it after.
 *
 * Algorithm in plain English:
 *   Look the train up by its identifier. If a window has already been built for
 *   it, hand back the very same array so every caller in the app sees identical
 *   numbers. Otherwise build it, remember it against the identifier, and return
 *   it. Because generation is seeded, a cache miss would produce the same result
 *   anyway; the cache is purely there to avoid repeating the work.
 *
 * @param {Object} train - train object
 * @returns {Array<Object>} the 30-day history window
 */
export function getHistory(train) {
  if (!train) return []

  const key = train.id || train.number
  if (!key) return buildHistory(train)

  if (!historyCache.has(key)) {
    historyCache.set(key, buildHistory(train))
  }
  return historyCache.get(key)
}

// Manual check: run this file directly to inspect the generated distribution.
if (typeof process !== 'undefined' && process.argv && process.argv[1] && process.argv[1].endsWith('history.js')) {
  const samples = [
    { number: '20901', punctualityScore: 95 },
    { number: '12952', punctualityScore: 89 },
    { number: '14016', punctualityScore: 48 }
  ]

  samples.forEach((train) => {
    const history = buildHistory(train)
    const delays = history.map((entry) => entry.delayMinutes)
    const onTime = delays.filter((minutes) => minutes === 0).length
    const sorted = [...delays].sort((a, b) => a - b)

    console.log(
      `train ${train.number} (score ${train.punctualityScore}):`,
      `days=${history.length}`,
      `onTime=${onTime}`,
      `median=${sorted[Math.floor(sorted.length / 2)]}m`,
      `p90=${sorted[Math.floor(sorted.length * 0.9)]}m`,
      `worst=${sorted[sorted.length - 1]}m`
    )
  })
}
