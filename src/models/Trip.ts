import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITrip extends Document {
  id: string; // Keep string ID for compatibility
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget_per_person: number;
  total_budget: number;
  creator_id: string | null;
  created_at: Date;
}

const TripSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  destination: { type: String, required: true },
  start_date: { type: String, required: true },
  end_date: { type: String, required: true },
  budget_per_person: { type: Number, required: true },
  total_budget: { type: Number, required: true },
  creator_id: { type: String, default: null },
  created_at: { type: Date, default: Date.now }
});

const Trip: Model<ITrip> = mongoose.models.Trip || mongoose.model<ITrip>('Trip', TripSchema);

export default Trip;
