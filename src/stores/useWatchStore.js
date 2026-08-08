import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'railease.watchlist.v1'

/**
 * The watchlist: trains a traveller has asked us to keep an eye on.
 *
 * Why this deliberately does not require an account:
 *   Watching is the only reason anyone comes back to this app, so the cost of
 *   starting must be as close to zero as possible. Asking for a sign-up before
 *   the traveller has felt any benefit trades the habit we want for a database
 *   row we do not need. The list therefore lives in the browser, and an account
 *   is only ever offered later as an upgrade, in exchange for alerts on a phone.
 *
 * Stored shape, one entry per watched train:
 *   {
 *     id:        String,  // train id, the stable key
 *     number:    String,  // e.g. '12952'
 *     name:      String,
 *     fromCode:  String,
 *     toCode:    String,
 *     deptTime:  String,
 *     arrTime:   String,
 *     addedAt:   Number   // epoch milliseconds, for ordering
 *   }
 */
export const useWatchStore = defineStore('watch', () => {
  const watched = ref(loadFromStorage())

  /**
   * Read the saved watchlist out of local storage.
   *
   * Algorithm in plain English:
   *   Try to read and parse the stored list. If anything is missing, corrupt, or
   *   the browser denies access, return an empty list rather than throwing. A
   *   failure to restore a convenience feature must never stop the app loading.
   *
   * @returns {Array<Object>} the saved entries, or an empty array
   */
  function loadFromStorage() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      const parsed = raw ? JSON.parse(raw) : []
      return Array.isArray(parsed) ? parsed : []
    } catch (error) {
      console.warn('[RailEase Watch] Could not read the saved watchlist:', error)
      return []
    }
  }

  /**
   * Write the current watchlist back to local storage.
   *
   * @returns {void}
   */
  function persist() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(watched.value))
    } catch (error) {
      console.warn('[RailEase Watch] Could not save the watchlist:', error)
    }
  }

  /**
   * Whether a given train is already being watched.
   *
   * @param {Object} train - train object with an id or number
   * @returns {Boolean} true when already on the list
   */
  function isWatched(train) {
    if (!train) return false
    return watched.value.some((entry) => entry.id === train.id || entry.number === train.number)
  }

  /**
   * Add or remove a train from the watchlist.
   *
   * Algorithm in plain English:
   *   If the train is already on the list, drop it. Otherwise record just enough
   *   of it to render the watching screen without needing the original search,
   *   stamp the time so entries can be ordered, and save. Returns whether the
   *   train is on the list afterwards, so the caller can show the right message.
   *
   * @param {Object} train - train object
   * @returns {Boolean} true when the train is now watched
   */
  function toggleWatch(train) {
    if (!train) return false

    if (isWatched(train)) {
      watched.value = watched.value.filter(
        (entry) => entry.id !== train.id && entry.number !== train.number
      )
      persist()
      return false
    }

    watched.value = [
      ...watched.value,
      {
        id: train.id,
        number: train.number,
        name: train.name,
        fromCode: train.fromCode,
        toCode: train.toCode,
        fromName: train.fromName,
        toName: train.toName,
        deptTime: train.deptTime,
        arrTime: train.arrTime,
        punctualityScore: train.punctualityScore,
        addedAt: Date.now()
      }
    ]
    persist()
    return true
  }

  /**
   * Remove a train from the watchlist by its id.
   *
   * @param {String} id - the train id
   * @returns {void}
   */
  function removeWatch(id) {
    watched.value = watched.value.filter((entry) => entry.id !== id)
    persist()
  }

  const watchCount = computed(() => watched.value.length)

  // Most recently added first: the trip a traveller just looked at is the one
  // they are most likely to be thinking about when they return.
  const watchedNewestFirst = computed(() =>
    [...watched.value].sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0))
  )

  return {
    watched,
    watchedNewestFirst,
    watchCount,
    isWatched,
    toggleWatch,
    removeWatch
  }
})
