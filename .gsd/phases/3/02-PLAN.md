---
phase: 3
plan: 2
wave: 2
depends_on: ["1"]
files_modified:
  - src/components/ai-concierge.tsx
  - src/app/trips/[id]/page.tsx
autonomous: true
user_setup: []
must_haves:
  truths:
    - "Users can chat with the AI from the Trip Dashboard."
    - "Users can switch between the 5 AI modes."
  artifacts:
    - "src/components/ai-concierge.tsx component exists."
---

# Plan 3.2: Unified AI Concierge UI

<objective>
Build a unified chat interface in the Trip Dashboard that allows users to interact with the 5 AI assistants.

Purpose: Provide a premium, accessible interface for the AI capabilities.
Output: A React component utilizing the `useChat` hook with a mode selector.
</objective>

<context>
Load for context:
- .gsd/SPEC.md
</context>

<tasks>

<task type="auto">
  <name>Build AI Concierge Component</name>
  <files>src/components/ai-concierge.tsx</files>
  <action>
    Create a chat interface using shadcn/ui (Card, ScrollArea, Input, Button).
    Use the `useChat` hook from the `ai/react` package.
    Add a dropdown or toggle group to select the active `aiMode`.
    Pass the trip details (destination, dates, budget) and `aiMode` in the initial request body.
    Follow the "Super Travel" high-contrast design system.
  </action>
  <verify>npm run lint</verify>
  <done>Component built.</done>
</task>

<task type="auto">
  <name>Integrate into Trip Dashboard</name>
  <files>src/app/trips/[id]/page.tsx</files>
  <action>
    Replace the "AI Assistant Placeholder" in the Trip Dashboard with the new `AiConcierge` component.
    Pass the current trip details as props so the AI knows the context.
  </action>
  <verify>npm run build</verify>
  <done>Dashboard updated.</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] The chat UI allows switching modes.
- [ ] It correctly mounts inside the Trip Dashboard.
</verification>

<success_criteria>
- [ ] All tasks verified
</success_criteria>
