import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Feedback } from "@/types/feedback";
import type { CreateFeedbackInput } from "@/schemas/feedback";

interface FeedbackListResponse {
  data: Feedback[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface FeedbackFilters {
  search?: string;
  category?: string;
  priority?: string;
  team?: string;
  page?: number;
}

async function fetchFeedbacks(
  filters: FeedbackFilters
): Promise<FeedbackListResponse> {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.category) params.set("category", filters.category);
  if (filters.priority) params.set("priority", filters.priority);
  if (filters.team) params.set("team", filters.team);
  if (filters.page) params.set("page", String(filters.page));

  const res = await fetch(`/api/feedbacks?${params}`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch feedbacks");
  }
  return res.json();
}

async function createFeedback(
  input: CreateFeedbackInput
): Promise<{ data: Feedback }> {
  const res = await fetch("/api/feedbacks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to create feedback");
  }
  return res.json();
}

export function useFeedbacks(filters: FeedbackFilters) {
  return useQuery({
    queryKey: ["feedbacks", filters],
    queryFn: () => fetchFeedbacks(filters),
  });
}

export function useCreateFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
    },
  });
}