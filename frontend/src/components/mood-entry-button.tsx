import { JSX, useState } from "react";
import { Button, Dialog, DialogTrigger, Modal } from "react-aria-components";
import Card from "./card";
import AddNewMoodForm from "./add-new-mood-form";
import { Mood } from "../lib/api/types";

interface Props {
  icon: JSX.Element;
  mood?: Mood;
}

const MoodEntryButton = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DialogTrigger>
      <Button onPress={() => setIsOpen(true)}>{props.icon}</Button>
      <Modal
        isDismissable
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        className="fixed inset-0 flex items-center justify-center"
      >
        <Dialog className="w-[calc(100%-20px)] md:w-1/3">
          <Card className="justify-start w-full h-full">
            <div className="p-4 overflow-y-auto">
              <h2 className="text-lg font-semibold">Mood Entry</h2>
              <p className="mt-2">How are you feeling today?</p>
              <AddNewMoodForm selectedMood={props.mood} />
            </div>
            <Button onPress={() => setIsOpen(false)}>Cancel</Button>
          </Card>
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
};

export default MoodEntryButton;
