/**
 * Journey recovery.
 *
 * What this answers: "I missed my train. What do I do now?"
 *
 * Why this is not the same problem as search, and why it needs its own module:
 *   A normal search optimises for the best train. Recovery optimises for the
 *   best train A PERSON CAN ACTUALLY BOARD TODAY, from wherever they are, in
 *   time for whatever they were travelling for. Those rank completely
 *   differently. Re-running the normal search would put a comfortable, punctual
 *   train tomorrow morning at the top, which is not an answer to "I am standing
 *   on a platform right now".
 *
 *   So the ordering here demotes reliability and promotes three things a normal
 *   search barely considers: can I get a seat, how long do I wait, and do I
 *   still make my commitment.
 *
 * Every function is pure: (input) => output.
 */

import { computeBaseConfidence } from './scoring'
import { getRealisticArrival, parseTimeToMinutes, formatMinutesAsTime } from './reliability'

// Below this many minutes of waiting, an option counts as "leaving very soon".
const SOON_MINUTES = 180

/**
 * How likely a traveller is to actually get a seat on a train today.
 *
 * Algorithm in plain English:
 *   Look at every class on the train and take the best situation available.
 *   Open seats are the only certain outcome. A short RAC queue is close to
 *   certain since the traveller at least boards. A waitlist is a gamble whose
 *   odds fall as the queue lengthens, and a regret means the class is shut.
 *   Returns both a numeric score for ranking and a plain phrase for display,
 *   because this figure is the single most important one in a recovery and it
 *   must never be shown as a bare number.
 *
 * @param {Object} train - train object with a classes array
 * @returns {{score: Number, phrase: String, bookableClass: Object|null}}
 */
export function assessBoardability(train) {
  const classes = train.classes || []

  const available = classes.find((cls) => cls.statusType === 'available')
  if (available) {
    return {
      score: 100,
      phrase: `Seats available now in ${available.name} (${available.price} rupees)`,
      bookableClass: available
    }
  }

  const rac = classes.find((cls) => cls.statusType === 'rac')
  if (rac) {
    return {
      score: 75,
      phrase: `RAC in ${rac.name} — you will get on board, seat shared until confirmed`,
      bookableClass: rac
    }
  }

  const waitlisted = classes.find((cls) => cls.statusType === 'wl')
  if (waitlisted) {
    const position = parseInt(/(\d+)/.exec(waitlisted.status || '')?.[1] || '99', 10)
    const score = Math.max(5, 60 - position)
    return {
      score,
      phrase: `Only ${waitlisted.status} in ${waitlisted.name} — may not confirm in time`,
      bookableClass: waitlisted
    }
  }

  return { score: 0, phrase: 'No seats open on this train today', bookableClass: null }
}

/**
 * Minutes a traveller must wait before a train departs.
 *
 * Algorithm in plain English:
 *   Convert both the current time and the train's departure into minutes from
 *   midnight and subtract. If the answer is negative the train has already gone
 *   today, so add a full day to represent tomorrow's run instead.
 *
 * @param {Object} train - train object with deptTime
 * @param {Number} nowMinutes - current time as minutes since midnight
 * @returns {Number} minutes until departure, always zero or more
 */
export function minutesUntilDeparture(train, nowMinutes) {
  const departure = parseTimeToMinutes(train.deptTime)
  if (departure === null) return 24 * 60

  const wait = departure - nowMinutes
  return wait >= 0 ? wait : wait + 24 * 60
}

/**
 * Express a wait in words a stressed person can read at a glance.
 *
 * Algorithm in plain English:
 *   State the gap in hours and minutes, and say outright when the departure
 *   falls on the following day. "In 19h 12m" is technically true but makes a
 *   traveller do date arithmetic while they are panicking; "tomorrow, in 19h"
 *   tells them the thing that actually changes their plans, namely that they
 *   need somewhere to spend the night.
 *
 * @param {Number} minutes - minutes of waiting
 * @param {Number} fromMinutes - the reference moment, as minutes since midnight
 * @returns {String} e.g. 'in 2h 40m' or 'tomorrow, in 19h'
 */
export function describeWait(minutes, fromMinutes = 0) {
  const crossesMidnight = fromMinutes + minutes >= 24 * 60

  let gap
  if (minutes < 60) {
    gap = `in ${minutes} min`
  } else {
    const hours = Math.floor(minutes / 60)
    const rest = minutes % 60
    gap = rest === 0 ? `in ${hours}h` : `in ${hours}h ${rest}m`
  }

  return crossesMidnight ? `tomorrow, ${gap}` : gap
}

/**
 * Whether an option still meets the traveller's deadline.
 *
 * Algorithm in plain English:
 *   With no deadline given, this question does not apply and nothing is claimed.
 *   Otherwise compare the realistic arrival, not the scheduled one, against the
 *   deadline. Using the timetable here would be dishonest in exactly the moment
 *   honesty matters most: telling somebody they will make their interview based
 *   on a time this train rarely achieves is worse than saying nothing.
 *
 * @param {Object} train - train object
 * @param {Number|null} deadlineMinutes - deadline as minutes since midnight
 * @returns {{makesIt: Boolean, phrase: String}|null} verdict, or null when no deadline
 */
export function assessDeadline(train, deadlineMinutes) {
  if (deadlineMinutes === null || deadlineMinutes === undefined) return null

  const realistic = getRealisticArrival(train)
  const arrivalText = realistic || train.arrTime
  const arrivalMinutes = parseTimeToMinutes(arrivalText)
  if (arrivalMinutes === null) return null

  // A next-day arrival is written as "(+1 day)" on the train record.
  const crossesMidnight = /\+\s*\d\s*day/i.test(train.arrTime || '')
  const effectiveArrival = crossesMidnight ? arrivalMinutes + 24 * 60 : arrivalMinutes

  const makesIt = effectiveArrival <= deadlineMinutes

  return {
    makesIt,
    phrase: makesIt
      ? `Arrives around ${formatMinutesAsTime(arrivalMinutes)} — you would still make it`
      : `Arrives around ${formatMinutesAsTime(arrivalMinutes)} — too late for your deadline`
  }
}

/**
 * Build the reasons behind recommending one recovery option.
 *
 * Algorithm in plain English:
 *   Collect the handful of facts that decide a recovery, each as a short line
 *   with a tone: good news, a caution, or a blocker. Order them the way a
 *   stranded person would ask them: can I board, when does it go, do I still
 *   make it, does it cost more, is it dependable. Only facts worth stating are
 *   included, so a clean option shows a short list rather than a wall of ticks.
 *
 * @param {Object} train - candidate train
 * @param {Object} context - { nowMinutes, deadlineMinutes, originalPrice }
 * @returns {Array<{tone: 'good'|'warn'|'bad', text: String}>}
 */
export function buildReasons(train, context) {
  const { nowMinutes, deadlineMinutes = null, originalPrice = 0 } = context
  const reasons = []

  const boardability = assessBoardability(train)
  reasons.push({
    tone: boardability.score >= 75 ? 'good' : boardability.score >= 30 ? 'warn' : 'bad',
    text: boardability.phrase
  })

  const wait = minutesUntilDeparture(train, nowMinutes)
  reasons.push({
    tone: wait <= SOON_MINUTES ? 'good' : 'warn',
    text: `Departs ${describeWait(wait, nowMinutes)}`
  })

  const deadline = assessDeadline(train, deadlineMinutes)
  if (deadline) {
    reasons.push({ tone: deadline.makesIt ? 'good' : 'bad', text: deadline.phrase })
  }

  if (originalPrice && train.price) {
    const difference = train.price - originalPrice
    if (difference > 0) {
      reasons.push({ tone: 'warn', text: `${difference} rupees more than your original ticket` })
    } else if (difference < 0) {
      reasons.push({ tone: 'good', text: `${Math.abs(difference)} rupees cheaper than your original ticket` })
    }
  }

  const confidence = computeBaseConfidence(train)
  if (confidence < 55) {
    reasons.push({ tone: 'warn', text: `This train is often delayed (${confidence}/100 confidence)` })
  }

  return reasons
}

/**
 * Score a candidate for how good a recovery it is, right now.
 *
 * Algorithm in plain English:
 *   Weight boardability most heavily, because an option you cannot get on is not
 *   an option at all. Reward leaving soon, on a curve that flattens out: the gap
 *   between one hour and three hours of waiting matters far more than the gap
 *   between ten and twelve hours. Apply a heavy penalty if the traveller would
 *   miss their deadline, since that is the entire reason they are looking. Give
 *   reliability a modest weight, deliberately lower than it carries in a normal
 *   search, because a mediocre train you can board beats a perfect one you cannot.
 *
 * @param {Object} train - candidate train
 * @param {Object} context - { nowMinutes, deadlineMinutes }
 * @returns {Number} recovery score, higher is better
 */
export function scoreRecoveryOption(train, context) {
  const { nowMinutes, deadlineMinutes = null } = context

  const boardability = assessBoardability(train).score
  const wait = minutesUntilDeparture(train, nowMinutes)
  const promptness = Math.max(0, 100 - (wait / 60) * 8)
  const confidence = computeBaseConfidence(train)

  let score = boardability * 0.45 + promptness * 0.30 + confidence * 0.25

  const deadline = assessDeadline(train, deadlineMinutes)
  if (deadline && !deadline.makesIt) score -= 45

  return Math.round(score)
}

/**
 * Produce a ranked recovery plan after a missed or cancelled train.
 *
 * Algorithm in plain English:
 *   Drop the train that was missed from the candidates, along with anything
 *   with no seats left at all, since suggesting either would waste the reader's
 *   time. Score what remains for how good a recovery it is and sort. Split the
 *   result into the single best option and the rest, because a stranded person
 *   needs one clear answer first and alternatives second. Finally work out
 *   whether any option gets them there today at all, so the page can lead with
 *   honest reassurance or an honest warning rather than making them infer it.
 *
 * Input:  missedTrain, candidates array, context { nowMinutes, deadlineMinutes }
 * Output: { best, alternatives, canReachToday, summary }
 *
 * @param {Object} missedTrain - the train the traveller did not catch
 * @param {Array<Object>} candidates - other trains on the same route
 * @param {Object} context - { nowMinutes, deadlineMinutes }
 * @returns {Object} the recovery plan
 */
export function buildRecoveryPlan(missedTrain, candidates, context = {}) {
  const nowMinutes = context.nowMinutes ?? 0
  const deadlineMinutes = context.deadlineMinutes ?? null
  const originalPrice = missedTrain?.price || 0

  // The moment the traveller became stranded, which is what every wait should be
  // measured from. Using the wall clock alone was wrong: a train scheduled before
  // the one they missed is not an option today no matter what time it is now, and
  // measuring from "now" made such a train look like it departs shortly. Taking
  // the later of the current time and the missed departure fixes both directions.
  const missedDeparture = parseTimeToMinutes(missedTrain?.deptTime)
  const strandedAt = missedDeparture === null ? nowMinutes : Math.max(nowMinutes, missedDeparture)

  const viable = (candidates || [])
    .filter((train) => train.number !== missedTrain?.number)
    .filter((train) => assessBoardability(train).score > 0)
    .map((train) => ({
      train,
      score: scoreRecoveryOption(train, { nowMinutes: strandedAt, deadlineMinutes }),
      wait: minutesUntilDeparture(train, strandedAt),
      reasons: buildReasons(train, { nowMinutes: strandedAt, deadlineMinutes, originalPrice }),
      boardability: assessBoardability(train),
      deadline: assessDeadline(train, deadlineMinutes)
    }))
    .sort((a, b) => b.score - a.score)

  const best = viable[0] || null
  const alternatives = viable.slice(1, 4)

  // Something counts as available today when it departs before midnight,
  // measured from the moment the traveller became stranded.
  const canReachToday = viable.some((option) => strandedAt + option.wait < 24 * 60)

  let summary
  if (!best) {
    summary = 'There are no trains left on this route today with seats available.'
  } else if (deadlineMinutes !== null && best.deadline && !best.deadline.makesIt) {
    summary = 'No remaining train gets you there before your deadline. Here is the closest option.'
  } else if (canReachToday) {
    summary = 'You can still get there. Here is the best way.'
  } else {
    summary = 'The next available train leaves tomorrow. Here are your options.'
  }

  return { best, alternatives, canReachToday, summary }
}
