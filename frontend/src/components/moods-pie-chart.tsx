import { useMemo } from "react";
import { useMoodTrend } from "../lib/hooks/use-stats";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

const gradientMap = {
  Awful: "gradient-0",
  Bad: "gradient-1",
  Meh: "gradient-2",
  Good: "gradient-3",
  Rad: "gradient-4",
};

const MoodsPieChart = () => {
  const { data, isLoading, isError } = useMoodTrend({
    startDate: null,
    endDate: null,
  });
  const pieData = useMemo(() => {
    if (!data) return null;

    return Object.keys(data.moodCounts).map((mood) => ({
      name: mood,
      value: data.moodCounts[mood],
    }));
  }, [data]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading mood trend</p>;
  }

  if (!pieData || pieData.length === 0 || !data) {
    return <p>No data available</p>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={400} height={400} className="outline-none">
        <defs>
          {/* Glow Effect Filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="gradient-0" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fd746c" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#ff9068" stopOpacity={1} />
          </linearGradient>
          <linearGradient id="gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f12711" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#f5af19" stopOpacity={1} />
          </linearGradient>
          <linearGradient id="gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00B4DB" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#0083B0" stopOpacity={1} />
          </linearGradient>
          <linearGradient id="gradient-3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#56ab2f" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#a8e063" stopOpacity={1} />
          </linearGradient>
          <linearGradient id="gradient-4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#11998e" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#38ef7d" stopOpacity={1} />
          </linearGradient>
        </defs>
        <Pie
          data={pieData}
          dataKey={"value"}
          nameKey={"name"}
          cx="50%"
          cy="50%"
          outerRadius="100%"
          innerRadius="75%"
          strokeWidth={0}
          style={{ filter: "url(#glow)" }}
        >
          {pieData.map((entry) => (
            <Cell
              className="outline-none"
              key={`cell-${entry.name}`}
              fill={`url(#${
                gradientMap[entry.name as keyof typeof gradientMap]
              })`}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default MoodsPieChart;
