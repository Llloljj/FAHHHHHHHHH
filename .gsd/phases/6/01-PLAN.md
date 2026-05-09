---
phase: 6
plan: 1
wave: 1
depends_on: ["5"]
files_modified:
  - package.json
  - supabase/migrations/00002_bookings_razorpay.sql
  - src/app/actions/booking-actions.ts
  - src/components/booking-modal.tsx
autonomous: true
user_setup:
  - service: razorpay
    why: "We need Razorpay Key ID and Secret for payments."
    env_vars:
      - name: RAZORPAY_KEY_ID
      - name: RAZORPAY_KEY_SECRET
must_haves:
  truths:
    - "Users can initiate a booking with a Razorpay checkout."
    - "Booking status is updated in Supabase after payment."
  artifacts:
    - "Razorpay integration with booking flow."
---

# Plan 6.1: Razorpay Integration & Booking Flow

<objective>
Integrate Razorpay to handle payments for marketplace listings and implement the core booking flow.

Purpose: Enable commercial transactions within the P2P marketplace.
Output: Functional payment checkout and booking management.
</objective>

<context>
- .gsd/SPEC.md
- src/app/marketplace/page.tsx
- src/app/actions/marketplace-actions.ts
</context>

<tasks>

<task type="auto">
  <name>Install Razorpay SDK</name>
  <files>package.json</files>
  <action>
    Install `razorpay` package.
  </action>
  <verify>npm list razorpay</verify>
  <done>Razorpay installed.</done>
</task>

<task type="auto">
  <name>Create Booking Schema</name>
  <files>supabase/migrations/00002_bookings_razorpay.sql</files>
  <action>
    Define tables for `bookings` and `security_deposits`.
    Add RLS policies.
  </action>
  <verify>Check migration file.</verify>
  <done>Database schema updated for bookings.</done>
</task>

<task type="auto">
  <name>Implement Booking Actions</name>
  <files>src/app/actions/booking-actions.ts</files>
  <action>
    Create server actions to:
    1. Create a Razorpay Order.
    2. Confirm payment and create a booking record.
  </action>
  <verify>Check if actions export correctly.</verify>
  <done>Booking backend logic implemented.</done>
</task>

<task type="auto">
  <name>Build Booking Modal</name>
  <files>src/components/booking-modal.tsx</files>
  <action>
    Create a premium booking modal with date selection and Razorpay checkout integration.
    Ensure it follows the "Super Travel" high-contrast design.
  </action>
  <verify>Check if modal opens from marketplace listing.</verify>
  <done>Booking UI complete.</done>
</task>

</tasks>

<verification>
- [ ] Razorpay order creation works.
- [ ] Booking record is created on successful payment.
</verification>

<success_criteria>
- [ ] All tasks verified
</success_criteria>
