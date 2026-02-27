import { useState } from "react";
import { Geist } from "next/font/google";
import { useFeedbacks } from "@/hooks/useFeedbacks";
import FeedbackCard from "@/components/FeedbackCard";
import CreateFeedbackModal from "@/components/CreateFeedbackModal";
import SearchFilters from "@/components/SearchFilters";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [team, setTeam] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useFeedbacks({
    search: search || undefined,
    category: category || undefined,
    priority: priority || undefined,
    team: team || undefined,
    page,
  });

  const feedbacks = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div
      className={`${geistSans.variable} min-h-screen bg-zinc-50 font-sans`}
    >
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Feedbacks</h1>
            <p className="mt-1 text-sm text-zinc-500">
              {pagination
                ? `${pagination.total} feedback${pagination.total !== 1 ? "s" : ""}`
                : "Loading..."}
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            + New Feedback
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <SearchFilters
            search={search}
            category={category}
            priority={priority}
            team={team}
            onSearchChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            onCategoryChange={(v) => {
              setCategory(v);
              setPage(1);
            }}
            onPriorityChange={(v) => {
              setPriority(v);
              setPage(1);
            }}
            onTeamChange={(v) => {
              setTeam(v);
              setPage(1);
            }}
          />
        </div>

        {/* Content */}
        {isLoading && (
          <div className="py-20 text-center text-sm text-zinc-500">
            Loading feedbacks...
          </div>
        )}

        {isError && (
          <div className="py-20 text-center text-sm text-red-600">
            Failed to load feedbacks. Please try again.
          </div>
        )}

        {!isLoading && !isError && feedbacks.length === 0 && (
          <div className="py-20 text-center text-sm text-zinc-500">
            No feedbacks found. Create one to get started.
          </div>
        )}

        {!isLoading && !isError && feedbacks.length > 0 && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              {feedbacks.map((feedback) => (
                <FeedbackCard key={feedback._id} feedback={feedback} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-sm text-zinc-600">
                  Page {page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                  disabled={page >= pagination.totalPages}
                  className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      <CreateFeedbackModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
