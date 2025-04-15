import { Mood } from "../lib/api/types";
import { useMoodEntries } from "../lib/hooks/use-moods";

const MoodsList = () => {
  const { data, error, isLoading } = useMoodEntries();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;

  const prettyMood = (mood: Mood) => {
    switch (mood) {
      case Mood.Awful:
        return "Awful";
      case Mood.Bad:
        return "Bad";
      case Mood.Meh:
        return "Meh";
      case Mood.Good:
        return "Good";
      case Mood.Rad:
        return "Rad";
      default:
        return "Unknown";
    }
  };

  return (
    <div>
      <h1>Mood entries</h1>
      <ul>
        {data.map((mood) => (
          <li key={mood.id}>
            {prettyMood(mood.mood)} -{" "}
            {new Date(mood.created_at).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MoodsList;
