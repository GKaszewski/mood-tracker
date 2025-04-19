import { useMemo } from "react";
import { useMoodEntries } from "../lib/hooks/use-moods";
import Card from "./card";
import { cn, getPrettyMood } from "../lib/utils";
import MoodIconDisplay from "./mood-icon-display";

interface Props {
  lastEntriesCount?: number;
}

const DEFAULT_ENTRIES_COUNT = 2;

const RecentEntries = ({ lastEntriesCount }: Props) => {
  const { data, isLoading } = useMoodEntries();

  const lastEntriesCountValue = useMemo(
    () => lastEntriesCount || DEFAULT_ENTRIES_COUNT,
    [lastEntriesCount]
  );

  const lastTwoEntries = useMemo(() => {
    if (!data) return [];
    const sortedEntries = [...data].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return sortedEntries.slice(0, lastEntriesCountValue);
  }, [data, lastEntriesCountValue]);

  const entriesClassName = (index: number) => {
    return cn(
      "flex flex-col gap-2 p-4 border-gray-200",
      index !== lastEntriesCountValue - 1 ? "border-b" : ""
    );
  };

  return (
    <Card>
      {isLoading && <div>Loading...</div>}
      {!data && <div>No data available</div>}
      <h2 className="text-lg font-semibold">Recent Entries</h2>
      <div className="flex flex-col gap-4">
        {lastTwoEntries.map((entry, index) => (
          <div key={entry.id} className={entriesClassName(index)}>
            <p className="text-sm text-gray-500">
              {new Date(entry.created_at).toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
              })}
            </p>
            <div className="flex items-center gap-2">
              <MoodIconDisplay className="w-10 h-10" mood={entry.mood} />
              <div className="flex flex-col gap-1">
                <p className="text-lg font-semibold">
                  {getPrettyMood(entry.mood)}
                </p>
                <p className="text-sm text-gray-700">{entry.note}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
export default RecentEntries;
