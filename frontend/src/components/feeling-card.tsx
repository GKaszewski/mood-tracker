import AwfulIcon from "../assets/icons/awful";
import BadIcon from "../assets/icons/bad";
import GoodIcon from "../assets/icons/good";
import MehIcon from "../assets/icons/meh";
import RadIcon from "../assets/icons/rad";
import Card from "./card";
import EmblaCarousel from "./embla-carousel";
import MoodEntryButton from "./mood-entry-button";

const FeelingCard = () => {
  return (
    <Card className="flex flex-col items-center p-4 aspect-square w-fit justify-between">
      <div>
        <p className="font-semibold text-2xl">How are you feeling?</p>
      </div>
      <div className="flex flex-col items-center justify-center select-none">
        <EmblaCarousel
          options={{
            loop: true,
            skipSnaps: true,
          }}
        >
          <div className="flex flex-col gap-2 items-center justify-center w-full h-full">
            <MoodEntryButton
              icon={<AwfulIcon className="cursor-pointer hover:scale-110" />}
            />
            <p className="font-semibold">Awful</p>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center w-full h-full">
            <BadIcon className="cursor-pointer hover:scale-110" />
            <p className="font-semibold">Bad</p>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center w-full h-full">
            <MehIcon className="cursor-pointer hover:scale-110" />
            <p className="font-semibold">Meh</p>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center w-full h-full">
            <GoodIcon className="cursor-pointer hover:scale-110" />
            <p className="font-semibold">Good</p>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center w-full h-full">
            <RadIcon className="cursor-pointer hover:scale-110" />
            <p className="font-semibold">Rad</p>
          </div>
        </EmblaCarousel>
      </div>
      <span className="text-sm text-gray-500">Swipe to select your mood</span>
    </Card>
  );
};

export default FeelingCard;
