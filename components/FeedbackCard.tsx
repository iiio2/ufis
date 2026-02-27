import type { Feedback } from "@/types/feedback";

const priorityColors: Record<string, string> = {
  critical: "bg-red-100 text-red-800",
  high: "bg-orange-100 text-orange-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
};

const sentimentColors: Record<string, string> = {
  positive: "bg-emerald-100 text-emerald-800",
  neutral: "bg-gray-100 text-gray-800",
  negative: "bg-red-100 text-red-800",
};

function Badge({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${className}`}
    >
      {label}
    </span>
  );
}

export default function FeedbackCard({ feedback }: { feedback: Feedback }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-zinc-900">
            {feedback.name}
          </h3>
          <p className="text-xs text-zinc-500">{feedback.email}</p>
        </div>
        <Badge
          label={feedback.priority}
          className={priorityColors[feedback.priority]}
        />
      </div>

      <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-zinc-700">
        {feedback.message}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <Badge
          label={feedback.category}
          className="bg-blue-100 text-blue-800"
        />
        <Badge
          label={feedback.sentiment}
          className={sentimentColors[feedback.sentiment]}
        />
        <Badge
          label={feedback.team}
          className="bg-purple-100 text-purple-800"
        />
        <span className="ml-auto text-xs text-zinc-400">
          {new Date(feedback.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}