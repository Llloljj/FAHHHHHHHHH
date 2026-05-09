---
phase: 7
plan: 2
wave: 2
depends_on: ["1"]
files_modified:
  - src/app/trips/[id]/itinerary/page.tsx
  - src/components/itinerary-timeline.tsx
  - src/app/actions/itinerary-actions.ts
autonomous: true
user_setup: []
must_haves:
  truths:
    - "Users can see a chronological timeline of all activities and bookings for a specific trip."
    - "The itinerary automatically includes marketplace bookings linked to the trip."
  artifacts:
    - "Master Itinerary Timeline UI."
---

# Plan 7.2: Unified Master Itinerary

<objective>
Consolidate all trip-related data (bookings, travel plans, and activities) into a single chronological timeline.

Purpose: Provide users with a complete operational view of their trip.
Output: Integrated Master Itinerary page for each trip.
</objective>

<context>
- .gsd/SPEC.md
- src/app/trips/[id]/page.tsx
- src/app/actions/booking-actions.ts
</context>

<tasks>

<task type="auto">
  <name>Create Itinerary Page</name>
  <files>src/app/trips/[id]/itinerary/page.tsx</files>
  <action>
    Create a new page to display the master itinerary.
    Fetch trip details, marketplace bookings, and ledger highlights.
  </action>
  <verify>Check page accessibility at /trips/[id]/itinerary.</verify>
  <done>Itinerary page created.</done>
</task>

<task type="auto">
  <name>Build Timeline Component</name>
  <files>src/components/itinerary-timeline.tsx</files>
  <action>
    Create a vertical timeline component that sorts activities by date.
    Include visual indicators for different types (Stay, Transport, Activity, Ledger).
    Follow the "Super Travel" aesthetic (Glassmorphism, Neon accents).
  </action>
  <verify>Check chronological sorting.</verify>
  <done>Timeline component implemented.</done>
</task>

<task type="auto">
  <name>Implement Manual Activity Entry</name>
  <files>src/app/actions/itinerary-actions.ts</files>
  <action>
    Create a server action to allow users to manually add custom activities (e.g., "Dinner at Taj", "City Tour").
  </action>
  <verify>Add a test activity and check if it appears.</verify>
  <done>Manual entry logic complete.</done>
</task>

</tasks>

<verification>
- [ ] Timeline correctly aggregates data from multiple tables.
- [ ] UI is premium and easy to read.
</verification>

<success_criteria>
- [ ] All tasks verified
</success_criteria>
