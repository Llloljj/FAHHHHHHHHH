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
