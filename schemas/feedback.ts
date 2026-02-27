import { z } from "zod";
import { CATEGORIES, PRIORITIES, SENTIMENTS, TEAMS } from "@/types/feedback";

export const createFeedbackSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.email("Invalid email address"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000),
});

export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>;

export const llmExtractionSchema = z.object({
  category: z.enum(CATEGORIES),
  priority: z.enum(PRIORITIES),
  sentiment: z.enum(SENTIMENTS),
  team: z.enum(TEAMS),
});

export type LLMExtraction = z.infer<typeof llmExtractionSchema>;

export const feedbackQuerySchema = z.object({
  search: z.string().optional(),
  category: z.enum(CATEGORIES).optional(),
  priority: z.enum(PRIORITIES).optional(),
  team: z.enum(TEAMS).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type FeedbackQuery = z.infer<typeof feedbackQuerySchema>;