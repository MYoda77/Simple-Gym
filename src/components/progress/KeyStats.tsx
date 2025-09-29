import { StatCard } from "./StatCard";
import { Stat } from "@/types/progress";

interface KeyStatsProps {
  stats: Stat[];
}

export const KeyStats = ({ stats }: KeyStatsProps) => {
  return (
    <section className="mb-6">
      <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:overflow-visible">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            unit={stat.unit}
          />
        ))}
      </div>
    </section>
  );
};