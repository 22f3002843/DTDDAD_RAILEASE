import { onMounted, onUnmounted } from 'vue'

/**
 * Reveals elements carrying the .reveal-on-scroll class as they enter the viewport.
 *
 * Why this is shaped the way it is:
 *   The earlier version observed elements immediately inside onMounted and used a
 *   negative bottom rootMargin. Both worked against content that was already on
 *   screen at load. onMounted can run before the browser has finished layout, so
 *   elements were measured at zero height, and the negative margin shrank the
 *   detection box further — together they meant above-the-fold content never
 *   crossed the intersection threshold and the page rendered blank until the user
 *   scrolled and forced a recalculation.
 *
 *   Two changes fix it: wait one animation frame so layout has settled before
 *   observing, and drop the negative bottom margin so anything genuinely visible
 *   counts as visible. A zero threshold is used because for a reveal animation
 *   "any part of it is on screen" is the correct trigger.
 *
 * Algorithm in plain English:
 *   On mount, wait for the next animation frame. Collect every element marked for
 *   reveal. Immediately mark as revealed any element already intersecting the
 *   viewport, so nothing above the fold depends on a scroll event. Observe the
 *   rest, and reveal each one as it scrolls into view. Disconnect on unmount.
 */
export function useScrollReveal() {
  let observer = null
  let frameId = null

  onMounted(() => {
    // Defer to the next frame so the browser has completed layout and elements
    // report their real dimensions to IntersectionObserver.
    frameId = requestAnimationFrame(() => {
      const elements = document.querySelectorAll('.reveal-on-scroll')

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed')
              // Once revealed, stop watching it; the animation only runs once.
              observer.unobserve(entry.target)
            }
          })
        },
        {
          threshold: 0,
          rootMargin: '0px'
        }
      )

      elements.forEach((el) => {
        // Safety net: if an element is already within the viewport at this point,
        // reveal it directly rather than relying on the observer callback firing.
        const box = el.getBoundingClientRect()
        const isAlreadyVisible = box.top < window.innerHeight && box.bottom > 0

        if (isAlreadyVisible) {
          el.classList.add('revealed')
        } else {
          observer.observe(el)
        }
      })
    })
  })

  onUnmounted(() => {
    if (frameId) cancelAnimationFrame(frameId)
    if (observer) observer.disconnect()
  })
}
