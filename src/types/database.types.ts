export type TripMemberRole = 'admin' | 'member';

export interface Trip {
  id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget_per_person: number;
  total_budget: number;
  creator_id: string;
  created_at: string;
}

export interface TripMember {
  id: string;
  trip_id: string;
  user_id: string;
  role: TripMemberRole;
  joined_at: string;
}

export interface Expense {
  id: string;
  trip_id: string;
  payer_id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  created_at: string;
}

export interface ExpenseSplit {
  id: string;
  expense_id: string;
  user_id: string;
  amount: number;
}

export type ListingType = 'home' | 'vehicle' | 'guide';

export interface Listing {
  id: string;
  host_id: string;
  type: ListingType;
  title: string;
  description: string;
  price_per_day: number;
  location: string;
  images: string[];
  features: string[];
  is_verified: boolean;
  created_at: string;
}

export interface HostProfile {
  id: string;
  user_id: string;
  full_name: string;
  bio: string;
  kyc_status: 'pending' | 'verified' | 'rejected';
  identity_doc_url?: string;
  created_at: string;
}
