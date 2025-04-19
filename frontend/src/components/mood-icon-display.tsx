import AwfulIcon from "../assets/icons/awful";
import BadIcon from "../assets/icons/bad";
import GoodIcon from "../assets/icons/good";
import MehIcon from "../assets/icons/meh";
import RadIcon from "../assets/icons/rad";
import { Mood } from "../lib/api/types";

interface Props extends React.HTMLAttributes<SVGElement> {
  mood: Mood;
}

const MoodIconDisplay = ({ mood, ...props }: Props) => {
  switch (mood) {
    case Mood.Awful:
      return <AwfulIcon {...props} />;
    case Mood.Bad:
      return <BadIcon {...props} />;
    case Mood.Meh:
      return <MehIcon {...props} />;
    case Mood.Good:
      return <GoodIcon {...props} />;
    case Mood.Rad:
      return <RadIcon {...props} />;
    default:
      return null;
  }
};

export default MoodIconDisplay;
