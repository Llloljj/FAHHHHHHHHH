# Voyage - GSD Roadmap

## Phase 1: Foundation & Auth
**Goal:** Establish the project structure, integrate Supabase, and implement user authentication.
- Initialize Next.js 14 App Router project with Tailwind CSS & shadcn/ui.
- Setup Supabase for database and authentication.
- Implement user registration, login, and profile management.
- Create the core UI shell (navigation, sidebar).

## Phase 2: Trip Collaboration & Group Management
**Goal:** Enable users to create trips, invite members, and manage group profiles.
- Implement Trip creation and management.
- Create invitation flow (magic links or codes).
- Build the Trip Dashboard displaying dates, destination, and member list.
- Define Group Profile (ages, interests, budget).

## Phase 3: The AI Suite (The 5 Core Assistants)
**Goal:** Integrate the Google Gemini API to power the 5 AI assistants using the predefined system prompts.
- Implement the AI Travel Assistant (Itinerary Generator).
- Implement the AI Budget Advisor (Real-Time Spend Analysis).
- Implement the AI Activity Recommender.
- Implement the Expense Split Explainer.
- Implement the Group Voting Assistant.
- Build a unified chat/interaction UI for these assistants.

## Phase 4: Expense Ledger & Settlement Engine
**Goal:** Provide robust expense tracking and splitting capabilities.
- Create the Expense tracking UI (add expense, split types).
- Integrate with the AI Expense Split Explainer for settlement calculations.
- Build the Ledger view and Settlement dashboard.

## Phase 5: Peer-to-Peer Marketplace (Listings & KYC)
**Goal:** Build the architecture for locals to list homes, vehicles, and guide services, including KYC.
- Implement the KYC document verification flow (simulate or integrate basic ID check).
- Create the Home Rental (Hospitality) listing flow with image uploads.
- Create the Vehicle Rental listing flow.
- Create the Local Guide registration flow.
- Build the search and discovery UI for the marketplace.

## Phase 6: P2P Bookings & Security Deposits
**Goal:** Enable users to book P2P services and handle security deposits via Razorpay.
- Implement Razorpay integration for payments.
- Build the booking flow for Homes, Vehicles, and Guides.
- Implement the Security Deposit logic for vehicles (hold and refund).
- Build the booking management dashboard for hosts and guests.

## Phase 7: Unified External Travel Hub
**Goal:** Provide access to flights and trains via external partners.
- Build the Flight search interface (mocking API or integrating with a partner redirect).
- Build the Train search interface.
- Implement deep-linking to external booking partners (MakeMyTrip, Goibibo, etc.).
