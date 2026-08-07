# Railway Travel Experience Platform
## Technology Stack & Development Instructions (For AI Vibe Coding)

---

# Project Overview

Build a **modern, premium, high-fidelity frontend prototype** of a Railway Travel Experience Platform.

This is **NOT a backend project**.

The application should simulate a real railway booking platform using **dummy data only**.

The primary goal is to showcase an exceptional UI/UX with smooth animations, reusable components, and a production-quality frontend architecture.

The application should feel comparable to products from Apple, Linear, Vercel, Stripe, and modern SaaS platforms.

---

# Development Principles

Always prioritize:

- Clean architecture
- Reusable components
- Modular code
- Responsive design
- Accessibility
- Fast loading
- Smooth animations
- Beautiful typography
- Excellent user experience
- Consistent spacing
- Minimalistic design
- Production-quality code structure

Avoid unnecessary complexity.

Everything should be component-driven.

---

# Core Technology Stack

## Framework

Use:

- Vue 3 (Composition API)

Do NOT use Options API.

Always use:

- `<script setup>`

---

## Build Tool

Use:

- Vite

Use Vite as the complete project setup.

---

## Language

Use:

- JavaScript (ES6+)

Do not use TypeScript.

---

## Styling

Use:

- Tailwind CSS

Do NOT write large CSS files.

Use utility classes whenever possible.

Create reusable utility classes only when necessary.

---

## Component Library

Use:

- shadcn-vue

Use shadcn components wherever possible instead of building UI components from scratch.

Examples:

- Button
- Card
- Input
- Dialog
- Sheet
- Drawer
- Badge
- Tabs
- Accordion
- Dropdown Menu
- Popover
- Calendar
- Skeleton
- Toast
- Tooltip

---

## Icons

Primary icon library:

- Lucide Vue

Secondary (only if needed):

- Material Symbols

Never mix more than two icon libraries.

Maintain consistent icon sizes throughout the application.

---

## Routing

Use:

Vue Router

Create proper route-based navigation.

Example routes:

/

/search

/train/:id

/booking

/seat-selection

/ticket

/pnr-status

/live-status

/profile

/settings

/help

---

## State Management

Use:

Pinia

Use Pinia for:

- User state
- Search filters
- Booking flow
- Theme
- Notifications
- Wishlist
- Recently searched trains

---

## Utility Library

Use:

VueUse

Useful composables include:

- Dark mode
- Local storage
- Device detection
- Window size
- Clipboard
- Debounce
- Scroll tracking

---

# Animation Stack

Primary animation library:

Motion Vue

Use Motion Vue for:

- Page transitions
- Hero animations
- Fade effects
- Card animations
- Scale animations
- Hover animations
- Button interactions
- Modal transitions

---

Use GSAP ONLY for premium interactions such as:

- Moving train animation
- Route animation
- Timeline animation
- Scroll storytelling
- SVG path animations

---

Use AOS only for:

- Landing page scroll animations
- Feature cards
- Statistics section
- Testimonials

---

# UI Design Philosophy

Follow these design inspirations:

- Apple
- Linear
- Vercel
- Stripe
- Airbnb
- Notion
- Material Design 3

The UI should look premium and modern rather than resembling a traditional railway website.

---

# Design System

Follow an 8-point spacing system.

Examples:

8px

16px

24px

32px

48px

64px

96px

Maintain consistent spacing throughout.

---

Use rounded corners:

Buttons:

14px

Cards:

20px

Modals:

24px

Search Bar:

999px

---

Shadows

Use soft shadows only.

Avoid harsh shadows.

Prefer:

shadow-md

shadow-lg

shadow-xl

---

Glassmorphism

Use subtly.

Suitable for:

- Navbar
- Floating search bar
- Ticket preview
- Quick action cards

Avoid overusing glass effects.

---

# Typography

Preferred font:

Geist

Alternative:

Inter

Use:

Font Weight

400

500

600

700

Use generous line spacing.

Avoid tiny fonts.

---

# Color Palette

Primary Blue

#2563EB

Accent

#38BDF8

Background

#F8FAFC

Card

#FFFFFF

Text

#0F172A

Success

#16A34A

Warning

#F59E0B

Danger

#EF4444

Use Tailwind color utilities whenever possible.

---

# Responsive Design

Design mobile-first.

Support:

Mobile

Tablet

Laptop

Desktop

Ultra-wide

Never allow layout breaking.

---

# Dark Mode

Implement full dark mode.

Theme should be stored in local storage.

Use smooth transitions.

---

# Images

Use modern illustrations and high-quality placeholders.

Avoid pixelated images.

Use:

- Hero illustrations
- Railway photography
- Station illustrations
- Destination banners
- Minimal illustrations

---

# Dummy Data

Use local JavaScript files.

Store inside:

src/data

Examples:

users.js

trains.js

stations.js

bookings.js

tickets.js

offers.js

reviews.js

notifications.js

Do NOT create any backend.

Do NOT connect any APIs.

Simulate asynchronous requests using Promises where necessary.

---

# Folder Structure

src/

assets/

components/

ui/

common/

booking/

train/

ticket/

profile/

home/

navbar/

footer/

views/

router/

stores/

composables/

layouts/

data/

utils/

animations/

services/

App.vue

main.js

Maintain strict separation of concerns.

---

# Performance

Implement:

- Lazy-loaded routes
- Code splitting
- Reusable components
- Minimal dependencies
- Optimized assets
- Smooth 60fps animations

---

# Accessibility

Ensure:

- Keyboard navigation
- Proper contrast
- Focus states
- Semantic HTML
- Screen reader friendly labels
- Accessible buttons
- Accessible forms

---

# Code Quality

Always:

Use Composition API.

Use reusable components.

Avoid duplicate code.

Keep components under approximately 200 lines whenever practical.

Separate business logic into composables.

Avoid deeply nested components.

Use descriptive naming conventions.

Write clean, maintainable code.

---

# User Experience

Include:

✓ Sticky navigation

✓ Smooth scrolling

✓ Animated search experience

✓ Interactive cards

✓ Skeleton loaders

✓ Empty states

✓ Loading animations

✓ Toast notifications

✓ Success animations

✓ Error states

✓ Hover effects

✓ Ripple button effects

✓ Scroll progress indicator

✓ Animated page transitions

✓ Premium micro-interactions

✓ Floating action buttons

✓ Interactive train cards

✓ Interactive ticket design

✓ Interactive seat selection

✓ Beautiful confirmation screens

---

# Recommended Dependencies

vue

vite

vue-router

pinia

tailwindcss

shadcn-vue

lucide-vue-next

motion-v

gsap

aos

@vueuse/core

tailwindcss-animate

clsx

class-variance-authority

vite-plugin-vue-devtools

---

# Things to Avoid

Do not use Bootstrap.

Do not use jQuery.

Do not use inline styles.

Do not use unnecessary CSS files.

Do not use random animations.

Do not use multiple state management libraries.

Do not overuse gradients.

Do not clutter the interface.

Do not use fake loading delays.

Do not create backend code.

Do not use TypeScript unless explicitly requested.

---

# Expected Final Result

The application should look and feel like a modern railway super app rather than a conventional ticket booking website.

The experience should emphasize speed, simplicity, elegance, and intuitive interactions. Every screen should feel polished, responsive, and production-ready, with reusable Vue components, consistent design patterns, and realistic dummy data that accurately simulates real-world usage.