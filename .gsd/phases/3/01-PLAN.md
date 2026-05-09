---
phase: 3
plan: 1
wave: 1
depends_on: ["2"]
files_modified:
  - .env.local
  - src/app/api/chat/route.ts
  - src/lib/ai/prompts.ts
autonomous: true
user_setup:
  - service: gemini
    why: "We need the Google Gemini API key to power the AI assistants."
    env_vars:
      - name: GOOGLE_GENERATIVE_AI_API_KEY
        source: "Google AI Studio"
must_haves:
  truths:
    - "A valid /api/chat route exists that connects to Gemini."
    - "System prompts are structured for the 5 distinct AI modes."
  artifacts:
    - "src/lib/ai/prompts.ts containing the user-defined prompts."
---

# Plan 3.1: AI Foundation & API Route

<objective>
Set up the Google Gemini connection using the Vercel AI SDK and define the 5 core AI system prompts provided by the user.

Purpose: Provide the backend intelligence for the AI Concierge.
Output: API route capable of streaming responses based on selected AI mode.
</objective>

<context>
Load for context:
- .gsd/SPEC.md
</context>

<tasks>

<task type="auto">
  <name>Install AI SDK</name>
  <files>package.json</files>
  <action>
    Install `ai` and `@google/generative-ai` packages.
  </action>
  <verify>npm list ai</verify>
  <done>AI dependencies installed.</done>
</task>

<task type="checkpoint:human-action">
  <name>Add Gemini API Key</name>
  <files>.env.local</files>
  <action>
    The user must provide the `GOOGLE_GENERATIVE_AI_API_KEY`.
  </action>
  <verify>Check if .env.local contains GOOGLE_GENERATIVE_AI_API_KEY</verify>
  <done>API key added.</done>
</task>

<task type="auto">
  <name>Define System Prompts</name>
  <files>src/lib/ai/prompts.ts</files>
  <action>
    Create a file exporting the 5 system prompts defined in the project constraints (Itinerary, Budget, Activity, Ledger, Voting).
  </action>
  <verify>Check file existence.</verify>
  <done>Prompts defined.</done>
</task>

<task type="auto">
  <name>Create Chat API Route</name>
  <files>src/app/api/chat/route.ts</files>
  <action>
    Implement a Next.js App Router POST handler using `streamText` from the Vercel AI SDK.
    Accept `messages` and an `aiMode` parameter in the request body to dynamically inject the correct system prompt.
  </action>
  <verify>npm run build</verify>
  <done>API route handles streaming chat.</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] The API route successfully compiles and uses the Gemini model.
- [ ] All 5 prompts are stored centrally.
</verification>

<success_criteria>
- [ ] All tasks verified
</success_criteria>
