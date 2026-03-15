import { motion } from "framer-motion";
import { calculateCohorts } from "@/data/churnData";
import { useState } from "react";

export default function CohortHeatmap() {
  const cohorts = calculateCohorts();
  const [hovered, setHovered] = useState<{ cohort: string; month: number; rate: number; size: number } | null>(null);

  const getOpacity = (rate: number) => Math.max(0.08, rate / 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="card-analytics p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-section-header">Cohort Retention Heatmap</h3>
        {hovered && (
          <div className="text-sm font-mono-data text-muted-foreground">
            {hovered.cohort} · Month {hovered.month} · <span className="text-foreground font-medium">{hovered.rate}%</span> · n={hovered.size}
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left text-label pb-3 pr-4 font-medium">Cohort</th>
              {Array.from({ length: 12 }, (_, i) => (
                <th key={i} className="text-center text-label pb-3 px-1 font-medium min-w-[44px]">
                  M{i}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cohorts.map((row) => (
              <tr key={row.cohort}>
                <td className="font-mono-data text-sm py-1 pr-4 text-muted-foreground">{row.cohort}</td>
                {Array.from({ length: 12 }, (_, i) => {
                  const rate = row.retentionRates[i];
                  const size = row.sizes[i];
                  const hasData = i < row.retentionRates.length;
                  return (
                    <td key={i} className="py-1 px-1">
                      {hasData ? (
                        <div
                          className="rounded-sm text-center font-mono-data text-xs py-1.5 cursor-default transition-all"
                          style={{
                            backgroundColor: `hsl(221, 83%, 53%, ${getOpacity(rate)})`,
                            color: rate > 60 ? "hsl(221, 83%, 20%)" : "hsl(var(--muted-foreground))",
                          }}
                          onMouseEnter={() => setHovered({ cohort: row.cohort, month: i, rate, size })}
                          onMouseLeave={() => setHovered(null)}
                        >
                          {rate}%
                        </div>
                      ) : (
                        <div className="rounded-sm bg-secondary/30 py-1.5" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
