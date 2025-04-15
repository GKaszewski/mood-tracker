import { useForm } from "react-hook-form";
import { MoodFormData, moodSchema } from "../schemas/mood-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  FieldError,
  Form,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
} from "react-aria-components";

interface Props {
  defaultValues?: MoodFormData;
  onSubmit: (data: MoodFormData) => void;
  onDelete?: (id: string) => void;
}

export const MoodForm: React.FC<Props> = ({
  defaultValues,
  onSubmit,
  onDelete,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MoodFormData>({
    resolver: zodResolver(moodSchema),
    defaultValues,
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Select {...register("mood")}>
          <Label htmlFor="mood">Mood</Label>
          <Button>
            <SelectValue />
            <span aria-hidden="true">▼</span>
          </Button>
          {errors.mood && <FieldError>{errors.mood.message}</FieldError>}
          <Popover>
            <ListBox>
              <ListBoxItem>Awful</ListBoxItem>
              <ListBoxItem>Bad</ListBoxItem>
              <ListBoxItem>Meh</ListBoxItem>
              <ListBoxItem>Good</ListBoxItem>
              <ListBoxItem>Rad</ListBoxItem>
            </ListBox>
          </Popover>
        </Select>
      </div>
      <Button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        {defaultValues ? "Update Mood" : "Add Mood"}
      </Button>
      {onDelete && (
        <Button
          type="button"
          onPress={() => onDelete(defaultValues?.id || "")}
          className="bg-red-500 text-white py-2 px-4 rounded"
        >
          Delete Mood
        </Button>
      )}
    </Form>
  );
};
