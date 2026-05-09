# Voyage — Collaborative Group Travel App
## Vision
A unified platform for group travel: AI trip planning, peer-to-peer marketplace (homes, vehicles, guides), and external booking integrations (flights, trains) — all with real-time expense splitting.

## Core Modules
1. Auth & User Profiles
2. Trip Management (create, invite, collaborate)
3. AI Suite (5 assistants)
4. Marketplace — Hotels, Hospitality (home rentals), Vehicles, Guides
5. External Booking Hub (flights via TBO/Tripjack, trains via IRCTC partner)
6. Expense Ledger & Split Engine
7. Group Voting & Decisions
8. Admin Panel (KYC verification, listing approval)

## Tech Stack
- Frontend: Next.js 14 (App Router)
- Styling: Tailwind CSS + shadcn/ui
- Database: Supabase (PostgreSQL)
- Auth: Supabase Auth
- AI: Google Gemini API
- Storage: Cloudinary (images)
- Payments: Razorpay (bookings + security deposits)
- Maps: Google Maps API
- KYC: Digilocker API / manual upload + admin approval
- Email: Resend

## External Integrations
- Flights: TBO API or Tripjack API (redirect + affiliate)
- Trains: IRCTC partner API / RailConnect
- Listing partners: MakeMyTrip, Goibibo, Cleartrip (deep-link aggregator)

## Key Data Models
- User, Trip, TripMember
- Hotel, HomeRental (Hospitality), Vehicle, Guide
- Booking, SecurityDeposit
- Expense, ExpenseSplit, Settlement
- Vote, VoteOption, VoteMember
- AISession (prompt + response cache)
