---
phase: 5
plan: 1
wave: 1
depends_on: ["4"]
files_modified:
  - src/app/marketplace/become-host/page.tsx
  - src/app/marketplace/page.tsx
  - src/app/actions/marketplace-actions.ts
autonomous: true
user_setup: []
must_haves:
  truths:
    - "Users can submit a KYC form (simulated)."
    - "Marketplace shows real listings from the database."
  artifacts:
    - "Become Host page with KYC flow."
    - "Marketplace grid fetching from Supabase."
---

# Plan 5.1: Marketplace Foundation & Host KYC

<objective>
Build the core marketplace infrastructure, enabling users to become hosts via a KYC flow and displaying real listings from the database.

Purpose: Transition from mock data to a functional P2P ecosystem.
Output: Host onboarding flow and real-time listing discovery.
</objective>

<context>
- .gsd/SPEC.md
- src/app/marketplace/page.tsx
- src/app/actions/marketplace-actions.ts
</context>

<tasks>

<task type="auto">
  <name>Create Database Tables</name>
  <files>supabase/migrations/00001_marketplace_ledger.sql</files>
  <action>
    Define tables for `host_profiles`, `listings`, `expenses`, and `expense_splits`.
    Add RLS policies for each.
  </action>
  <verify>Check migration file content.</verify>
  <done>Database schema defined.</done>
</task>

<task type="auto">
  <name>Implement Become Host Page</name>
  <files>src/app/marketplace/become-host/page.tsx</files>
  <action>
    Create a multi-step form for KYC (Personal Info -> ID Upload Simulation -> Verification).
    Use the `submitKYC` action from `marketplace-actions.ts`.
    Follow the premium "Super Travel" aesthetic.
  </action>
  <verify>Check if page renders and form submits.</verify>
  <done>Host onboarding UI complete.</done>
</task>

<task type="auto">
  <name>Connect Marketplace to Supabase</name>
  <files>src/app/marketplace/page.tsx</files>
  <action>
    Update the page to fetch all verified listings from the `listings` table.
    Replace mock cards with real data.
    Implement basic category filtering.
  </action>
  <verify>Verify data appears in the grid.</verify>
  <done>Real-time listing discovery active.</done>
</task>

</tasks>

<verification>
- [ ] KYC form successfully updates `host_profiles`.
- [ ] Marketplace grid reflects database content.
</verification>

<success_criteria>
- [ ] All tasks verified
</success_criteria>
