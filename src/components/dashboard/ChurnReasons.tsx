import { motion } from "framer-motion";
import { getChurnReasons } from "@/data/churnData";

export default function ChurnReasons() {
  const reasons = getChurnReasons();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
      className="card-analytics p-6"
    >
      <h3 className="text-section-header mb-6">Top Churn Drivers</h3>
      <div className="space-y-4">
        {reasons.map((r, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-foreground">{r.reason}</span>
              <span className="font-mono-data text-sm font-medium">{r.percentage}%</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${r.percentage}%` }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
                className="h-full rounded-full"
                style={{
                  backgroundColor: i === 0 ? "hsl(0, 84%, 60%)" : i === 1 ? "hsl(38, 92%, 50%)" : "hsl(221, 83%, 53%)",
                  opacity: 1 - i * 0.12,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono-data">{r.count} customers</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
