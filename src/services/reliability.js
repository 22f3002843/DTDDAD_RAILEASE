/**
 * Presentation helpers for the confidence score.
 *
 * This file owns how a score is DISPLAYED. The score itself is computed in
 * scoring.js, and the running history it draws on is built in history.js.
 * Keeping the three apart means every screen in the app grades a train
 * identically and no page can drift into showing its own private number.
 *
 * One rule governs everything here: a score is never rendered without a
 * plain-English verdict beside it and a checkable reason beneath it. A bare
 * number is decoration; a number with a reason is a judgement a passenger can
 * act on, and acting on it is the entire point of the product.
 */

import { getHistory } from './history'
import { analyseHistory, computeBaseConfidence, computeConfidence, getVerdict } from './scoring'

export { computeConfidence, computeBaseConfidence, getVerdict, analyseHistory }

/**
 * Severity level for a train, driven by the confidence score.
 *
 * @param {Object} train - train object
 * @returns {'green'|'amber'|'red'} severity level
 */
export function getReliabilityLevel(train) {
  return getVerdict(computeBaseConfidence(train)).level
}

/**
 * The badge label: the score paired with its verdict phrase.
 *
 * Written as "32/100" rather than "32%" on purpose. A percent sign invites the
 * reader to hear "on time 32 percent of the time", which is not what this
 * number means: it blends punctuality with consistency and how bad a bad day
 * gets. Using a score out of 100 keeps the claim honest, and the on-time
 * frequency is stated separately in the reason line beneath it.
 *
 * @param {Object} train - train object
 * @returns {String} e.g. '95/100 Very likely on time'
 */
export function getReliabilityLabel(train) {
  const score = computeBaseConfidence(train)
  return `${score}/100 ${getVerdict(score).phrase}`
}

/**
 * Tailwind classes for the badge pill.
 *
 * @param {Object} train - train object
 * @returns {String} space-separated Tailwind classes
 */
export function getReliabilityBadgeClass(train) {
  const level = getReliabilityLevel(train)
  if (level === 'green') return 'bg-emerald-50 text-emerald-800 border-emerald-200'
  if (level === 'amber') return 'bg-amber-50 text-amber-800 border-amber-200'
  return 'bg-red-50 text-red-800 border-red-200'
}

/**
 * Tailwind classes for the small status dot.
 *
 * @param {Object} train - train object
 * @returns {String} space-separated Tailwind classes
 */
export function getReliabilityDotClass(train) {
  const level = getReliabilityLevel(train)
  if (level === 'green') return 'bg-emerald-500'
  if (level === 'amber') return 'bg-amber-500'
  // The pulse on the worst band came from the dashboard work on main and is
  // kept here so every surface shows it, not just the one page it started on.
  return 'bg-red-500 animate-pulse'
}

/**
 * Tailwind classes for inline score text.
 *
 * @param {Object} train - train object
 * @returns {String} space-separated Tailwind classes
 */
export function getReliabilityTextClass(train) {
  const level = getReliabilityLevel(train)
  if (level === 'green') return 'text-emerald-600 font-black'
  if (level === 'amber') return 'text-amber-600 font-black'
  return 'text-red-600 font-black'
}

/**
 * The one-line justification shown directly beneath a score.
 *
 * Algorithm in plain English:
 *   With no history, say so plainly rather than inventing confidence. Otherwise
 *   lead with the strongest true statement available. When most days ran clean,
 *   report how many arrived on time against the total, because a denominator is
 *   what makes a claim checkable by the reader. When late days dominate, report
 *   how many ran late and how bad a typical bad day was, since for an unreliable
 *   train the size of the delay is what actually ruins the trip.
 *
 * @param {Object} train - train object
 * @returns {String} e.g. 'Arrived on time on 27 of the last 30 days.'
 */
export function getReliabilityReason(train) {
  const stats = analyseHistory(train)
  if (!stats) return 'Limited running history available for this train.'

  const { onTimeDays, totalDays, p90Delay } = stats
  const lateDays = totalDays - onTimeDays

  if (lateDays === 0) {
    return `Arrived on time on all ${totalDays} of the last ${totalDays} days.`
  }

  if (onTimeDays >= lateDays) {
    return `Arrived on time on ${onTimeDays} of the last ${totalDays} days.`
  }

  return `Ran late on ${lateDays} of the last ${totalDays} days, typically by ${p90Delay} minutes or more on a bad day.`
}

/**
 * How many days of running history back this train's score.
 *
 * @param {Object} train - train object
 * @returns {Number} count of observed days
 */
export function getHistoryWindowDays(train) {
  return getHistory(train).length
}

/**
 * Parse a scheduled time string into minutes since midnight.
 *
 * Algorithm in plain English:
 *   Pull the hour, minute and any AM or PM marker out of the text. Convert a
 *   twelve-hour clock reading into twenty-four-hour form, treating noon and
 *   midnight as the special cases they are, then express the result as a count
 *   of minutes from midnight so arithmetic on it is trivial.
 *
 * @param {String} timeText - e.g. '06:00 AM (+1 day)'
 * @returns {Number|null} minutes since midnight, or null when unparseable
 */
export function parseTimeToMinutes(timeText) {
  const match = /(\d{1,2}):(\d{2})\s*(AM|PM)?/i.exec(timeText || '')
  if (!match) return null

  let hours = parseInt(match[1], 10)
  const minutes = parseInt(match[2], 10)
  const meridiem = (match[3] || '').toUpperCase()

  if (meridiem === 'PM' && hours !== 12) hours += 12
  if (meridiem === 'AM' && hours === 12) hours = 0

  return hours * 60 + minutes
}

/**
 * Format minutes since midnight back into a readable clock time.
 *
 * @param {Number} totalMinutes - minutes since midnight, may exceed a day
 * @returns {String} e.g. '08:20 AM'
 */
export function formatMinutesAsTime(totalMinutes) {
  const wrapped = ((totalMinutes % 1440) + 1440) % 1440
  const hours24 = Math.floor(wrapped / 60)
  const minutes = wrapped % 60
  const meridiem = hours24 >= 12 ? 'PM' : 'AM'
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12

  return `${String(hours12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${meridiem}`
}

/**
 * The arrival time a traveller should actually plan around.
 *
 * Algorithm in plain English:
 *   Take the typical delay for this train and add it to the scheduled arrival.
 *   The median is used rather than the average on purpose: one catastrophic
 *   six-hour day would drag an average upward and misrepresent an ordinary day.
 *   The result is rounded to the nearest five minutes, because the underlying
 *   data does not support minute-level precision and printing an exact figure
 *   would imply a confidence this model has not earned. Returns null when the
 *   typical delay is too small to be worth mentioning, so the interface can omit
 *   the line rather than show a reassurance nobody asked for.
 *
 * @param {Object} train - train object
 * @returns {String|null} e.g. '08:20 AM', or null when there is nothing to say
 */
export function getRealisticArrival(train) {
  const stats = analyseHistory(train)
  if (!stats || stats.medianDelay < 15) return null

  const scheduled = parseTimeToMinutes(train.arrTime)
  if (scheduled === null) return null

  const rounded = Math.round((scheduled + stats.medianDelay) / 5) * 5
  return formatMinutesAsTime(rounded)
}
