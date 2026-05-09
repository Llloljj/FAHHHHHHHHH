---
phase: 4
plan: 1
wave: 1
depends_on: ["3"]
files_modified:
  - src/components/expense-ledger.tsx
  - src/app/actions/expense-actions.ts
  - src/components/ai-concierge.tsx
autonomous: true
user_setup: []
must_haves:
  truths:
    - "Settlement dashboard shows exactly who owes whom."
    - "AI Concierge 'Ledger' mode can explain the splits."
  artifacts:
    - "Updated ExpenseLedger with settlement logic."
---

# Plan 4.1: Settlement Engine & AI Ledger Integration

<objective>
Complete the Expense Ledger by implementing a precise settlement engine (pairwise debt calculation) and connecting it to the AI 'Split Explainer'.

Purpose: Remove ambiguity in group finances.
Output: A settlement UI and AI-powered financial clarification.
</objective>

<context>
- .gsd/SPEC.md
- src/components/expense-ledger.tsx
- src/app/actions/expense-actions.ts
</context>

<tasks>

<task type="auto">
  <name>Implement Settlement Logic</name>
  <files>src/components/expense-ledger.tsx</files>
  <action>
    Calculate pairwise debts (e.g., "Alice owes Bob ₹500").
    Update the UI to display a "Settlements" section below the ledger.
    Use a clean, premium design with arrows indicating money flow.
  </action>
  <verify>Verify that the sums match the total expenses.</verify>
  <done>Settlement UI implemented.</done>
</task>

<task type="auto">
  <name>AI Ledger Context Integration</name>
  <files>src/components/ai-concierge.tsx</files>
  <action>
    Pass the `expenses` and `members` data to the `AiConcierge` component.
    Update the prompt context for the 'ledger' mode to include current financial state.
  </action>
  <verify>Check if AI can answer "Who owes the most?".</verify>
  <done>AI now has ledger awareness.</done>
</task>

<task type="auto">
  <name>Enhance Expense Actions</name>
  <files>src/app/actions/expense-actions.ts</files>
  <action>
    Ensure `addExpense` correctly populates `expense_splits` for all members. (Already partially done, but verify).
    Add a `settleDebt` action to mark a pairwise debt as paid.
  </action>
  <verify>Check database for settlement records.</verify>
  <done>Settlement actions added.</done>
</task>

</tasks>

<verification>
- [ ] Settlement dashboard is accurate.
- [ ] AI can explain specific expense splits.
</verification>

<success_criteria>
- [ ] All tasks verified
</success_criteria>
