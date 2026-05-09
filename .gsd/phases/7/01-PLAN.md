---
phase: 7
plan: 1
wave: 1
depends_on: ["6"]
files_modified:
  - src/app/travel-hub/page.tsx
  - src/components/transport-search.tsx
  - src/lib/travel-api.ts
autonomous: true
user_setup: []
must_haves:
  truths:
    - "Users can search for flights and trains."
    - "Results link to external providers (Google Flights, IRCTC) with pre-filled parameters."
  artifacts:
    - "Travel Hub dashboard with transport search."
---

# Plan 7.1: Unified External Travel Hub

<objective>
Implement a centralized travel hub for searching flights, trains, and buses with redirects to external booking providers.

Purpose: Provide a "one-stop shop" for all transport logistics.
Output: Integrated transport search engine within the Voyage platform.
</objective>

<context>
- .gsd/SPEC.md
- src/app/dashboard/page.tsx
</context>

<tasks>

<task type="auto">
  <name>Implement Travel Hub Page</name>
  <files>src/app/travel-hub/page.tsx</files>
  <action>
    Create a premium splash page for the Travel Hub.
    Feature quick links to Flight, Train, and Bus search modes.
  </action>
  <verify>Check page accessibility at /travel-hub.</verify>
  <done>Travel Hub UI created.</done>
</task>

<task type="auto">
  <name>Build Transport Search Component</name>
  <files>src/components/transport-search.tsx</files>
  <action>
    Create a unified search interface for transport.
    Support Origin, Destination, Date, and Traveler count.
    Follow the high-contrast aesthetic.
  </action>
  <verify>Check visual consistency.</verify>
  <done>Search component implemented.</done>
</task>

<task type="auto">
  <name>Implement Redirect Logic</name>
  <files>src/lib/travel-api.ts</files>
  <action>
    Create utility functions to generate redirect URLs for:
    1. Google Flights (pre-filled).
    2. IRCTC / Trainman (pre-filled).
    3. RedBus / AbhiBus (pre-filled).
  </action>
  <verify>Test URL generation with sample data.</verify>
  <done>Redirect logic complete.</done>
</task>

</tasks>

<verification>
- [ ] Transport search triggers correct external redirects.
- [ ] UI is fully responsive and premium.
</verification>

<success_criteria>
- [ ] All tasks verified
</success_criteria>
