import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import FeedbackModel from "@/models/feedback";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  await connectDB();

  const { id } = req.query;

  if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid feedback ID" });
  }

  try {
    const feedback = await FeedbackModel.findById(id).lean();

    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    return res.status(200).json({ data: feedback });
  } catch (error) {
    console.error("Failed to fetch feedback:", error);
    return res.status(500).json({ error: "Failed to fetch feedback" });
  }
}
