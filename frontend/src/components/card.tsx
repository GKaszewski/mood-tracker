import { cn } from "../lib/utils";

interface Props extends React.HTMLProps<HTMLDivElement> {
  aero?: boolean;
}

const Card = (props: Props) => {
  return (
    <div
      {...props}
      className={cn(
        "border border-white/40 bg-white/20 flex flex-col items-center justify-center p-2 rounded-2xl shadow-lg ring-1 ring-white/5 isolate backdrop-blur-lg w-96 aspect-video",
        props.className
      )}
    >
      {props.children}
    </div>
  );
};

export default Card;
