---
phase: 1
plan: 1
wave: 1
depends_on: []
files_modified:
  - package.json
  - src/app/layout.tsx
  - src/app/page.tsx
  - src/app/globals.css
  - components.json
autonomous: true
user_setup: []
must_haves:
  truths:
    - "Project runs without errors"
    - "Tailwind and shadcn/ui are properly configured"
  artifacts:
    - "package.json exists"
    - "components.json exists"
---

# Plan 1.1: Foundation Setup

<objective>
Initialize the Next.js 14 project, install Tailwind CSS, and configure shadcn/ui for the design system.

Purpose: Provide the foundational codebase structure for Voyage.
Output: Bootstrapped Next.js application with styling libraries.
</objective>

<context>
Load for context:
- .gsd/SPEC.md
</context>

<tasks>

<task type="auto">
  <name>Initialize Next.js with Tailwind</name>
  <files>package.json, src/app/layout.tsx, src/app/page.tsx</files>
  <action>
    Initialize a new Next.js 14 project in the current directory using `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm`. Use non-interactive mode.
    AVOID: Creating a sub-directory. The project should be at the root of `s:\anti gravity\sarthi assist`.
  </action>
  <verify>npm run build completes successfully</verify>
  <done>Next.js is installed and builds.</done>
</task>

<task type="auto">
  <name>Configure shadcn/ui</name>
  <files>components.json, tailwind.config.ts, src/app/globals.css</files>
  <action>
    Initialize shadcn/ui using `npx shadcn-ui@latest init -y`. Choose default styles and neutral colors.
    AVOID: Manual configuration. Use the CLI to ensure consistency.
  </action>
  <verify>cat components.json</verify>
  <done>shadcn/ui is initialized with components.json present.</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] Project runs without errors
- [ ] Tailwind and shadcn/ui are properly configured
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
</success_criteria>
