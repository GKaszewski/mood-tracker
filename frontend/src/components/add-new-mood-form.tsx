import { useState } from "react";
import { CreateMoodEntryRequest, Mood } from "../lib/api/types";
import { useCreateMoodEntry } from "../lib/hooks/use-moods";
import { Form } from "react-aria-components";
import { useActivities } from "../lib/hooks/use-activities";

interface Props {
  selectedMood?: Mood;
}

const AddNewMoodForm = ({ selectedMood }: Props) => {
  const [mood, setMood] = useState<Mood | null>(
    selectedMood === undefined ? null : selectedMood
  );
  const [activities, setActivities] = useState<string[]>([]);
  const [note, setNote] = useState<string>("");

  const { data: userActivities } = useActivities();

  const moodMutation = useCreateMoodEntry();

  const handleMoodChange = (selectedMood: Mood) => {
    setMood(selectedMood);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (mood === null) {
      alert("Please select a mood.");
      return;
    }

    const activitiesString = activities.join(",");

    const newEntry: CreateMoodEntryRequest = {
      mood,
      activities: activitiesString || null,
      note: note || null,
    };

    moodMutation.mutate(newEntry, {
      onSuccess: () => {
        alert("Mood entry submitted successfully!");
        setMood(null);
        setActivities([]);
        setNote("");
      },
      onError: (error) => {
        alert(`Error submitting mood entry: ${error.message}`);
      },
    });
  };

  return (
    <Form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4  h-full">
      <div>
        <label className="block font-semibold mb-2">Mood</label>
        <div className="flex gap-2">
          {Object.values(Mood)
            .filter((value) => typeof value === "number")
            .map((value) => (
              <button
                key={value}
                type="button"
                className={`p-2 border rounded ${
                  mood === value ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
                onClick={() => handleMoodChange(value as Mood)}
              >
                {Mood[value as number]}
              </button>
            ))}
        </div>
      </div>
      <div>
        <label htmlFor="activities" className="block font-semibold mb-2">
          Activities
        </label>
        <div className="flex flex-col gap-2">
          {userActivities?.map((activity) => (
            <label
              key={`activity-label-${activity}`}
              className="flex items-center gap-2"
            >
              <input
                type="checkbox"
                value={activity}
                checked={activities.includes(activity)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setActivities((prev) => [...prev, activity]);
                  } else {
                    setActivities((prev) =>
                      prev.filter((name) => name !== activity)
                    );
                  }
                }}
                className="cursor-pointer"
              />
              {activity}
            </label>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="note" className="block font-semibold mb-2">
          Note (optional)
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <button type="submit" className="p-2 bg-blue-500 text-white rounded">
        Submit
      </button>
    </Form>
  );
};
export default AddNewMoodForm;
