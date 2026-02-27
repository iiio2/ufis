export const CATEGORIES = [
  "bug",
  "feature-request",
  "improvement",
  "documentation",
  "performance",
  "security",
  "ux",
  "other",
] as const;

export const PRIORITIES = ["critical", "high", "medium", "low"] as const;

export const SENTIMENTS = ["positive", "neutral", "negative"] as const;

export const TEAMS = [
  "engineering",
  "product",
  "design",
  "support",
  "security",
  "devops",
  "qa",
] as const;

export type Category = (typeof CATEGORIES)[number];
export type Priority = (typeof PRIORITIES)[number];
export type Sentiment = (typeof SENTIMENTS)[number];
export type Team = (typeof TEAMS)[number];

export interface Feedback {
  _id: string;
  name: string;
  email: string;
  message: string;
  category: Category;
  priority: Priority;
  sentiment: Sentiment;
  team: Team;
  createdAt: string;
  updatedAt: string;
}
