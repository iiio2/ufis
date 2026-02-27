import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import FeedbackModel from "@/models/feedback";
import {
  createFeedbackSchema,
  feedbackQuerySchema,
} from "@/schemas/feedback";
import { extractFeedbackMetadata } from "@/lib/langchain";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  switch (req.method) {
    case "POST":
      return handleCreate(req, res);
    case "GET":
      return handleList(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}

async function handleCreate(req: NextApiRequest, res: NextApiResponse) {
  const parsed = createFeedbackSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: parsed.error.flatten().fieldErrors,
    });
  }

  const { name, email, message } = parsed.data;

  try {
    const extraction = await extractFeedbackMetadata(name, message);

    const feedback = await FeedbackModel.create({
      name,
      email,
      message,
      ...extraction,
    });

    return res.status(201).json({ data: feedback });
  } catch (error) {
    console.error("Failed to create feedback:", error);
    return res.status(500).json({ error: "Failed to create feedback" });
  }
}

async function handleList(req: NextApiRequest, res: NextApiResponse) {
  const parsed = feedbackQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid query parameters",
      details: parsed.error.flatten().fieldErrors,
    });
  }

  const { search, category, priority, team, page, limit } = parsed.data;

  try {
    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$text = { $search: search };
    }
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (team) filter.team = team;

    const skip = (page - 1) * limit;

    const [feedbacks, total] = await Promise.all([
      FeedbackModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      FeedbackModel.countDocuments(filter),
    ]);

    return res.status(200).json({
      data: feedbacks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to list feedbacks:", error);
    return res.status(500).json({ error: "Failed to list feedbacks" });
  }
}
