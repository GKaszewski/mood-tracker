import { useMoodTrend } from "../lib/hooks/use-stats";
import Card from "./card";
import MoodsPieChart from "./moods-pie-chart";

const MoodTrend = () => {
  const { data, isLoading, isError } = useMoodTrend({
    startDate: null,
    endDate: null,
  });

  return (
    <Card className="aspect-square items-center justify-evenly">
      <h1 className="font-bold text-2xl">Mood trends</h1>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading mood trend</p>}
      <div className="flex items-center justify-center w-full h-40">
        <MoodsPieChart />
      </div>
      {data && <p className="font-semibold text-lg">{data.trend}</p>}
    </Card>
  );
};

export default MoodTrend;
