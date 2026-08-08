# UX Review — open observations

Raised by Dhanashree after walking through the app on 2026-08-09.

These are **observations, not prescribed solutions**. Each one is a thing that felt
wrong while using the app; how to resolve it is still open. Tick items off only
when the underlying feeling is fixed, not merely when something was changed.

---

## Navigation & buttons

- [x] **1. Duplicate destinations.** Some buttons have different names but take you to the same place. The repetition is unnecessary.

- [x] **2. Two dashboard buttons.** "Go to Dashboard" and "Sign in to Dashboard" exist as separate, differently-worded buttons.

- [x] **3. Sidebar disappears on Watching.** Clicking Watching removes the sidebar, forcing a Back navigation to get the sidebar options again.
  *(Same cause affects Train Detail — both use the public layout rather than AppLayout.)*

## Home page

- [ ] **4. Too much text.** The home page carries more copy than a first-time visitor will read.

- [x] **5. "Comfort" is undefined.** When trains are ranked by Comfort, it is not clear what that is measured on.
  *(Currently derived from crowd level and whether the train type is premium, but this is never stated on screen.)*

## Search and filters

- [x] **6. Hide-filters control is not visible.** It was missed entirely on first glance.

## "What could go wrong" page

- [x] **7. Too much text.** The same content could carry more visually and less in prose.

## 30-day record

- [x] **8. Is it necessary at all?** Open question whether the record earns its place.

- [x] **9. The graph feels dead.** It shows no quantities on the graph itself — no axis, no numbers, no scale.

- [x] **10. Wrong depiction for an urgent user.** Someone in a hurry needs a different presentation from what is there now.

## My Bookings

- [x] **11. The calendar card is hidden.** The calendar sits in the title bar; clicking it reveals a card with all the information, but nothing signals that it is there.

- [x] **12. That card may belong elsewhere.** It reads as dashboard content rather than My Bookings content. Open question whether that reading is right.

---

## Notes

- Items 8, 10 and 12 are **questions**, not defects. They may resolve as "leave it as is,
  for this reason" — that still counts as closed, provided the reason is written down.
- Items 3 and 7 came from work done in the `feat/reliability-and-recovery` branch,
  so they are regressions introduced by that change rather than pre-existing issues.
