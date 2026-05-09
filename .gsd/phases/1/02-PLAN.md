---
phase: 1
plan: 2
wave: 2
depends_on: ["1"]
files_modified:
  - .env.local
  - src/lib/supabase/client.ts
  - src/lib/supabase/server.ts
  - src/app/login/page.tsx
  - src/app/api/auth/callback/route.ts
autonomous: false
user_setup:
  - service: supabase
    why: "Database and Authentication"
    env_vars:
      - name: NEXT_PUBLIC_SUPABASE_URL
        source: "Supabase Dashboard -> Settings -> API"
      - name: NEXT_PUBLIC_SUPABASE_ANON_KEY
        source: "Supabase Dashboard -> Settings -> API"
must_haves:
  truths:
    - "User can log in with Google/Email"
    - "Supabase client is configured"
  artifacts:
    - "src/lib/supabase/client.ts exists"
    - "src/lib/supabase/server.ts exists"
---

# Plan 1.2: Supabase Auth & Database Setup

<objective>
Configure Supabase for authentication and database access, and build the login page.

Purpose: Enable user authentication for Voyage.
Output: Configured Supabase clients and a functional login page.
</objective>

<context>
Load for context:
- .gsd/SPEC.md
</context>

<tasks>

<task type="checkpoint:human-action">
  <name>Setup Supabase Project</name>
  <files>.env.local</files>
  <action>
    The user needs to create a Supabase project and provide the URL and ANON KEY.
  </action>
  <verify>Check if .env.local contains NEXT_PUBLIC_SUPABASE_URL</verify>
  <done>Environment variables are set.</done>
</task>

<task type="auto">
  <name>Create Supabase Clients</name>
  <files>src/lib/supabase/client.ts, src/lib/supabase/server.ts</files>
  <action>
    Install `@supabase/supabase-js` and `@supabase/ssr`.
    Create the client-side and server-side Supabase utility clients following the official Supabase SSR guide for Next.js App Router.
    AVOID: Using deprecated auth-helpers.
  </action>
  <verify>npm list @supabase/ssr</verify>
  <done>Supabase clients are created.</done>
</task>

<task type="auto">
  <name>Build Login Page</name>
  <files>src/app/login/page.tsx, src/app/api/auth/callback/route.ts</files>
  <action>
    Create a login page using shadcn/ui components (Card, Input, Button).
    Implement OAuth (Google) and Email/Password login forms.
    Create the auth callback route for OAuth redirects.
    AVOID: Storing tokens in localStorage directly; use Supabase SSR cookies.
  </action>
  <verify>Check if login page renders without errors.</verify>
  <done>Login page exists and is functional.</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] User can log in
- [ ] Supabase clients are configured correctly
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
</success_criteria>
