import { Pie, PieChart, Tooltip } from "recharts";

type Props = {};

interface EvidenceGatheringData {
  name: string;
  value: number;
  fill: string;
}
const evidenceGatheringData: EvidenceGatheringData[] = [
  { name: "Collected", value: 2000, fill: "#C4E8D1" },
  { name: "Pending", value: 3000, fill: "#5BB98B" },
  { name: "Not Collected", value: 5000, fill: "#2B9A66" },
];

interface CustomPiechartLegendLegendProps {
  payload: EvidenceGatheringData[];
}

const CustomPiechartLegend: React.FC<CustomPiechartLegendLegendProps> = ({
  payload,
}) => {
  return (
    <div className="w-full mx-auto flex flex-col px-16 py-3 text-sm gap-4">
      {payload.map((entry, index) => (
        <div
          key={`legend-item-${index}`}
          className="flex justify-between items-center "
        >
          {/* Display the text */}
          {/* Display the React icon */}
          <div className="flex gap-2 items-center">
            <div
              className={`w-3 h-3 rounded-full ${
                entry.name.toLowerCase() === "collected"
                  ? "bg-[#2B9A66]"
                  : entry.name.toLowerCase() === "pending"
                  ? "bg-[#5BB98B]"
                  : "bg-[#C4E8D1]"
              }`}
            ></div>
            <span className="text-nowrap">{entry.name}</span>
          </div>
          <span className="font-semibold">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function EvidenceGatheringChart({}: Props) {
  return (
    <div className="flex flex-col gap-3 [@media(min-width:1400px)]:gap-4 w-full h-full rounded-[8px] min-h-[400px]">
      <p className="w-full text-nowrap">Evidence gathering</p>
      <div className="w-full rounded-[8px] p-3 bg-gray-100 border border-neutral-2 border-solid">
        <div className="w-full rounded-[8px] py-11 bg-white shadow-md flex flex-col gap-12 justify-center mx-auto">
          <div className=" w-full flex justify-center mx-auto rounded-[8px] p-0">
            <PieChart width={250} height={250}>
              <Pie
                data={evidenceGatheringData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={100}
                cornerRadius={5} // Add rounded edges
                paddingAngle={2} // Adds gap between sections
                fill="#82ca9d"
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  percent,
                }) => {
                  // Calculate label position
                  const radius = innerRadius + (outerRadius - innerRadius) / 2;
                  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

                  return (
                    <text
                      x={x}
                      y={y}
                      fill="white"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="text-base font-bold"
                    >
                      {`${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }}
                labelLine={false} // Removes label lines
              />
              <Tooltip />
            </PieChart>
          </div>
          <CustomPiechartLegend payload={evidenceGatheringData} />
        </div>
      </div>
    </div>
  );
}
