---
phase: 2
plan: 1
wave: 1
depends_on: []
files_modified:
  - supabase/migrations/00000_init_trips.sql
  - src/types/database.types.ts
autonomous: true
user_setup:
  - service: supabase
    why: "We need the Trips schema deployed to the database."
    action: "Run the SQL in the Supabase SQL Editor."
must_haves:
  truths:
    - "Trips and trip_members tables exist in Supabase."
    - "Row Level Security (RLS) is enabled for both tables."
  artifacts:
    - "src/types/database.types.ts contains the definitions."
---

# Plan 2.1: Trip Database Schema & Types

<objective>
Design and execute the Supabase database schema for Trips and Trip Members, and generate/write the corresponding TypeScript types.

Purpose: Provide the data layer for group collaboration.
Output: SQL migration script and TypeScript interfaces.
</objective>

<context>
Load for context:
- .gsd/SPEC.md
</context>

<tasks>

<task type="auto">
  <name>Create SQL Migration Script</name>
  <files>supabase/migrations/00000_init_trips.sql</files>
  <action>
    Create the SQL script to create `trips` and `trip_members` tables.
    `trips`: id (uuid), title, destination, start_date, end_date, budget_per_person, total_budget, creator_id, created_at.
    `trip_members`: id, trip_id, user_id, role (enum: 'admin', 'member'), joined_at.
    Enable RLS on both tables.
    Add policies so users can see trips they are members of.
  </action>
  <verify>Check if the sql file exists and contains RLS policies.</verify>
  <done>SQL script created.</done>
</task>

<task type="checkpoint:human-action">
  <name>Execute SQL in Supabase</name>
  <files>supabase/migrations/00000_init_trips.sql</files>
  <action>
    The user must copy the contents of `00000_init_trips.sql` and run it in their Supabase SQL editor.
  </action>
  <verify>N/A (Human verification)</verify>
  <done>Tables created in Supabase.</done>
</task>

<task type="auto">
  <name>Define TypeScript Types</name>
  <files>src/types/database.types.ts</files>
  <action>
    Create a TypeScript file containing the interfaces for `Trip` and `TripMember` matching the SQL schema.
  </action>
  <verify>npm run lint</verify>
  <done>TypeScript types are defined.</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] SQL file exists with correct tables and RLS.
- [ ] User confirms SQL was executed.
- [ ] Types are correctly exported.
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
</success_criteria>
