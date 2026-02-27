import { CATEGORIES, PRIORITIES, TEAMS } from "@/types/feedback";

interface SearchFiltersProps {
  search: string;
  category: string;
  priority: string;
  team: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onTeamChange: (value: string) => void;
}

function SelectFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 outline-none transition-colors focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
    >
      <option value="">All {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt.charAt(0).toUpperCase() + opt.slice(1).replace("-", " ")}
        </option>
      ))}
    </select>
  );
}

export default function SearchFilters({
  search,
  category,
  priority,
  team,
  onSearchChange,
  onCategoryChange,
  onPriorityChange,
  onTeamChange,
}: SearchFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by name or message..."
        className="min-w-[240px] flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
      />
      <SelectFilter
        label="categories"
        value={category}
        options={CATEGORIES}
        onChange={onCategoryChange}
      />
      <SelectFilter
        label="priorities"
        value={priority}
        options={PRIORITIES}
        onChange={onPriorityChange}
      />
      <SelectFilter
        label="teams"
        value={team}
        options={TEAMS}
        onChange={onTeamChange}
      />
    </div>
  );
}
