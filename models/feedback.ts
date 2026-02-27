import type { Document, Model } from "mongoose";
import mongoose, { Schema } from "mongoose";
import { CATEGORIES, PRIORITIES, SENTIMENTS, TEAMS } from "@/types/feedback";

export interface FeedbackDocument extends Document {
  name: string;
  email: string;
  message: string;
  category: string;
  priority: string;
  sentiment: string;
  team: string;
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new Schema<FeedbackDocument>(
  {
    name: { type: String, required: true, index: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    category: { type: String, enum: CATEGORIES, required: true, index: true },
    priority: { type: String, enum: PRIORITIES, required: true, index: true },
    sentiment: { type: String, enum: SENTIMENTS, required: true },
    team: { type: String, enum: TEAMS, required: true, index: true },
  },
  { timestamps: true }
);

feedbackSchema.index({ name: "text", message: "text" });

const FeedbackModel: Model<FeedbackDocument> =
  mongoose.models.Feedback ??
  mongoose.model<FeedbackDocument>("Feedback", feedbackSchema);

export default FeedbackModel;