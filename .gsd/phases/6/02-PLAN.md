---
phase: 6
plan: 2
wave: 2
depends_on: ["1"]
files_modified:
  - src/app/dashboard/bookings/page.tsx
  - src/app/dashboard/host/page.tsx
  - src/components/booking-card.tsx
autonomous: true
user_setup: []
must_haves:
  truths:
    - "Guests can see their upcoming bookings."
    - "Hosts can see bookings for their listings and approve/reject them."
  artifacts:
    - "Guest Booking Dashboard."
    - "Host Management Dashboard."
---

# Plan 6.2: Booking Dashboards & Management

<objective>
Implement dashboards for both guests and hosts to manage their bookings and listings.

Purpose: Provide a central hub for trip logistics and marketplace activity.
Output: Integrated dashboards in the user profile area.
</objective>

<context>
- .gsd/SPEC.md
- src/app/actions/booking-actions.ts
</context>

<tasks>

<task type="auto">
  <name>Build Guest Booking Dashboard</name>
  <files>src/app/dashboard/bookings/page.tsx</files>
  <action>
    Fetch all bookings where the user is the guest.
    Display them in a clean, high-contrast list with status indicators.
    Link each booking to the corresponding trip or listing details.
  </action>
  <verify>Check if guest bookings appear correctly.</verify>
  <done>Guest dashboard implemented.</done>
</task>

<task type="auto">
  <name>Build Host Management Dashboard</name>
  <files>src/app/dashboard/host/page.tsx</files>
  <action>
    Fetch all listings owned by the user.
    Fetch all bookings for those listings.
    Display an overview of earnings, active listings, and pending booking requests.
  </action>
  <verify>Check if host data appears correctly.</verify>
  <done>Host dashboard implemented.</done>
</task>

<task type="auto">
  <name>Create Shared Booking Card Component</name>
  <files>src/components/booking-card.tsx</files>
  <action>
    Create a reusable component to display booking details (Dates, Price, Status, Listing Info).
    Follow the "Super Travel" aesthetic.
  </action>
  <verify>Check visual consistency.</verify>
  <done>Component created.</done>
</task>

</tasks>

<verification>
- [ ] Dashboards successfully fetch and display data from Supabase.
- [ ] Status updates (mocked for now) reflect in the UI.
</verification>

<success_criteria>
- [ ] All tasks verified
</success_criteria>
