---
phase: 1
plan: 3
wave: 3
depends_on: ["2"]
files_modified:
  - src/app/layout.tsx
  - src/components/navbar.tsx
  - src/components/sidebar.tsx
autonomous: true
user_setup: []
must_haves:
  truths:
    - "Application has a persistent navigation bar"
    - "Application layout supports logged in and logged out states"
  artifacts:
    - "src/components/navbar.tsx exists"
---

# Plan 1.3: Core UI Shell

<objective>
Build the core UI layout of Voyage, including the navigation bar and global layout wrapper, enabling seamless navigation across the app.

Purpose: Provide the structural foundation for all upcoming pages.
Output: A persistent Navbar and main app layout.
</objective>

<context>
Load for context:
- .gsd/SPEC.md
</context>

<tasks>

<task type="auto">
  <name>Build Navigation Bar</name>
  <files>src/components/navbar.tsx</files>
  <action>
    Create a `Navbar` component that displays the 'Voyage' logo/brand.
    Include conditional rendering: If a user is logged in, show 'Dashboard' and 'Sign Out' buttons. If logged out, show a 'Sign In' button.
    Use shadcn/ui buttons and Lucide React icons.
    Fetch the user session using the Supabase server client.
  </action>
  <verify>npm run lint</verify>
  <done>Navbar component is created without errors.</done>
</task>

<task type="auto">
  <name>Update Root Layout</name>
  <files>src/app/layout.tsx</files>
  <action>
    Update the root layout to include the `Navbar` at the top of the page.
    Ensure the main content area takes up the remaining vertical space (`min-h-screen`, `flex-col`).
  </action>
  <verify>npm run build</verify>
  <done>Layout successfully integrates the Navbar.</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] Application has a persistent navigation bar
- [ ] Application layout supports logged in and logged out states
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
</success_criteria>
