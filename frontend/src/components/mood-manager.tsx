import {
  useCreateMoodEntry,
  useDeleteMoodEntry,
  useUpdateMoodEntry,
} from "../lib/hooks/use-moods";
import { MoodFormData } from "../schemas/mood-schema";
import { useState } from "react";
import { MoodForm } from "./mood-form";

const MoodManager: React.FC = () => {
  const [editingMood, setEditingMood] = useState<MoodFormData | null>(null);
  const createMoodMutation = useCreateMoodEntry();
  const editMoodMutation = useUpdateMoodEntry();
  const deleteMoodMutation = useDeleteMoodEntry();

  const handleAddMood = (data: MoodFormData) => {
    console.log("Adding mood:", data);

    createMoodMutation.mutate({
      ...data,
    });
  };

  const handleEditMood = (data: MoodFormData) => {
    console.log("Editing mood:", data);

    if (editingMood && editingMood.id) {
      editMoodMutation.mutate({
        id: editingMood.id,
        ...editingMood,
        ...data,
      });
    }
  };

  const handleDeleteMood = (id: string) => {
    if (editingMood && editingMood.id) {
      deleteMoodMutation.mutate(id);
      setEditingMood(null);
    }
  };

  return (
    <div>
      <h1>Mood Manager</h1>
      <MoodForm
        defaultValues={editingMood || undefined}
        onSubmit={editingMood ? handleEditMood : handleAddMood}
        onDelete={editingMood ? handleDeleteMood : undefined}
      />
    </div>
  );
};

export default MoodManager;
