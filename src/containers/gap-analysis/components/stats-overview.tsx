interface StatsOverviewProps {
  stats: {
    total: number;
    passing: number;
    failing: number;
    pending: number;
  };
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-8 bg-[#F9F9FB] p-6 rounded-lg shadow-sm">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-sm text-[#8D8D8D] font-medium text-muted-foreground mb-2">
          Total Controls
        </h3>
        <p className="font-bold text-[#1C2024] text-4xl">{stats.total}</p>
      </div>
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-sm text-[#8D8D8D] font-medium text-muted-foreground mb-2">
          Passing Controls
        </h3>
        <p className="font-bold text-[#1C2024] text-4xl ">{stats.passing}</p>
      </div>
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-sm text-[#8D8D8D] font-medium text-muted-foreground mb-2">
          Failing Controls
        </h3>
        <p className="font-bold text-[#1C2024] text-4xl ">{stats.failing}</p>
      </div>
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-sm text-[#8D8D8D] font-medium text-muted-foreground mb-2">
          Pending Controls
        </h3>
        <p className="font-bold text-[#1C2024] text-4xl">{stats.pending}</p>
      </div>
    </div>
  );
}
