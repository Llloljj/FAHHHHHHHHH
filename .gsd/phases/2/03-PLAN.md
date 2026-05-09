---
phase: 2
plan: 3
wave: 3
depends_on: ["2"]
files_modified:
  - src/app/trips/[id]/page.tsx
  - src/app/trips/[id]/invite/page.tsx
  - src/app/actions/member-actions.ts
autonomous: true
user_setup: []
must_haves:
  truths:
    - "Users can generate an invite link for a trip"
    - "Other users can join the trip using the link"
  artifacts:
    - "Trip dashboard page exists"
---

# Plan 2.3: Trip Dashboard & Member Invites

<objective>
Build the individual Trip Dashboard where the group collaborates, and implement the member invitation flow.

Purpose: Serve as the hub for a specific group trip.
Output: Trip Dashboard UI and join-trip logic.
</objective>

<context>
Load for context:
- src/types/database.types.ts
</context>

<tasks>

<task type="auto">
  <name>Build Trip Dashboard</name>
  <files>src/app/trips/[id]/page.tsx</files>
  <action>
    Create the Trip Dashboard page.
    Fetch the specific trip and its members.
    Display trip details (destination, dates, total budget).
    List the members.
    Add an "Invite Member" button.
  </action>
  <verify>Verify data fetching uses the trip ID parameter.</verify>
  <done>Trip Dashboard UI complete.</done>
</task>

<task type="auto">
  <name>Implement Join Logic</name>
  <files>src/app/actions/member-actions.ts</files>
  <action>
    Create a Server Action `joinTrip(tripId: string)`.
    Insert the current user into `trip_members` as a 'member'.
    Redirect to the trip dashboard.
  </action>
  <verify>Ensure action checks if user is already a member before inserting.</verify>
  <done>Join logic complete.</done>
</task>

<task type="auto">
  <name>Build Invite Landing Page</name>
  <files>src/app/trips/[id]/invite/page.tsx</files>
  <action>
    Create a public page showing the trip details and a "Join Trip" button.
    If the user is not logged in, redirect them to `/login?next=/trips/[id]/invite`.
    If logged in, button triggers `joinTrip` action.
  </action>
  <verify>npm run build</verify>
  <done>Invite landing page is functional.</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] Users can see the Trip Dashboard.
- [ ] Invite links successfully add users to the trip.
</verification>

<success_criteria>
- [ ] All tasks verified
</success_criteria>
