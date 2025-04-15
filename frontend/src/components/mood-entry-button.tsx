import { JSX, useState } from "react";
import { Button, Dialog, DialogTrigger, Modal } from "react-aria-components";
import Card from "./card";

interface Props {
  icon: JSX.Element;
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
          <Card className="justify-start  w-full h-full">
            <div className="p-4">
              <h2 className="text-lg font-semibold">Mood Entry</h2>
              <p className="mt-2">How are you feeling today?</p>
              {/* Add your mood entry form here */}
            </div>
            <Button onPress={() => alert("Mood submitted!")}>Submit</Button>
            <Button onPress={() => setIsOpen(false)}>Cancel</Button>
          </Card>
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
};

export default MoodEntryButton;
