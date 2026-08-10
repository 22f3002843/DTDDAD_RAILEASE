import { onMounted, onUnmounted } from 'vue'

/**
 * Smoothly reveals elements carrying .reveal-on-scroll, .reveal-left, .reveal-right, .reveal-scale
 * as the user scrolls down the page.
 */
export function useScrollReveal() {
  let observer = null
  let frameId = null

  onMounted(() => {
    frameId = requestAnimationFrame(() => {
      const elements = document.querySelectorAll(
        '.reveal-on-scroll, .reveal-left, .reveal-right, .reveal-scale'
      )

      if (!elements.length) return

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed')
              observer.unobserve(entry.target)
            }
          })
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -30px 0px' // Triggers smooth animated entrance as element enters viewport during scroll
        }
      )

      // Allow initial layout calculation to complete before observing
      setTimeout(() => {
        elements.forEach((el) => {
          const box = el.getBoundingClientRect()
          // Only reveal immediately if element is in the top 75% of the initial hero viewport
          const isTopHeroElement = box.top >= 0 && box.top < window.innerHeight * 0.75

          if (isTopHeroElement) {
            el.classList.add('revealed')
          } else {
            // Remove any stale revealed class so scroll down animation triggers reliably
            el.classList.remove('revealed')
            observer.observe(el)
          }
        })
      }, 50)
    })
  })

  onUnmounted(() => {
    if (frameId) cancelAnimationFrame(frameId)
    if (observer) observer.disconnect()
  })
}
