---
phase: 2
plan: 2
wave: 2
depends_on: ["1"]
files_modified:
  - src/app/dashboard/page.tsx
  - src/app/trips/new/page.tsx
  - src/app/actions/trip-actions.ts
autonomous: true
user_setup: []
must_haves:
  truths:
    - "A logged-in user can create a trip"
    - "The creator is automatically added as an admin member of the trip"
  artifacts:
    - "Server action for trip creation exists"
---

# Plan 2.2: Trip Creation Flow

<objective>
Build the User Dashboard to display user's trips and implement the Trip Creation UI and logic.

Purpose: Allow users to start a new collaborative trip.
Output: Dashboard page, Trip Creation form, and Supabase server actions.
</objective>

<context>
Load for context:
- src/types/database.types.ts
</context>

<tasks>

<task type="auto">
  <name>Build User Dashboard</name>
  <files>src/app/dashboard/page.tsx</files>
  <action>
    Create a Dashboard page.
    Fetch the user's trips from Supabase (by joining `trip_members` and `trips`).
    Display a grid of trips. If no trips exist, show an empty state.
    Add a "Create New Trip" button linking to `/trips/new`.
  </action>
  <verify>Check if page uses `createClient()` and handles empty states.</verify>
  <done>Dashboard UI built.</done>
</task>

<task type="auto">
  <name>Implement Trip Creation Actions</name>
  <files>src/app/actions/trip-actions.ts</files>
  <action>
    Create a Server Action `createTrip(formData: FormData)`.
    Extract title, destination, dates, and budget.
    Insert into `trips` table.
    Insert the current user into `trip_members` as 'admin'.
    Return the new trip ID and redirect.
  </action>
  <verify>Ensure action performs both inserts and redirects.</verify>
  <done>Server action logic complete.</done>
</task>

<task type="auto">
  <name>Build Trip Creation UI</name>
  <files>src/app/trips/new/page.tsx</files>
  <action>
    Create a form for new trips (Title, Destination, Dates, Budget).
    Use shadcn/ui components (Input, Card, Button).
    Wire the form to the `createTrip` server action.
    Match the luxury "Super Travel" UI system.
  </action>
  <verify>npm run build</verify>
  <done>Creation UI is fully functional.</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] Dashboard displays trips.
- [ ] Trip creation logic works (inserts trip + member).
- [ ] UI matches the Super Travel design system.
</verification>

<success_criteria>
- [ ] All tasks verified
</success_criteria>
