import { motion } from "framer-motion";
import { calculateSegments } from "@/data/churnData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = [
  "hsl(0, 84%, 60%)",
  "hsl(38, 92%, 50%)",
  "hsl(142, 71%, 45%)",
];

export default function SegmentBreakdown() {
  const segments = calculateSegments();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="card-analytics p-6"
    >
      <h3 className="text-section-header mb-6">Retention by Subscription Type</h3>

      <div className="h-[200px] mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={segments} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: "hsl(215, 16%, 47%)" }}
              tickFormatter={(v) => `${v}%`}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="segment"
              tick={{ fontSize: 13, fill: "hsl(224, 71%, 4%)" }}
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(214, 32%, 91%)",
                borderRadius: "8px",
                fontSize: "13px",
                fontFamily: "IBM Plex Mono, monospace",
              }}
              formatter={(value: number) => [`${value}%`, "Churn Rate"]}
            />
            <Bar dataKey="churnRate" radius={[0, 4, 4, 0]} barSize={28}>
              {segments.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {segments.map((seg, i) => (
          <div key={seg.segment} className="rounded-md bg-secondary/50 p-3">
            <p className="text-label text-xs">{seg.segment}</p>
            <div className="mt-1">
              <span className="font-mono-data text-lg font-semibold">{seg.total}</span>
              <span className="text-muted-foreground text-xs ml-1">customers</span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground font-mono-data">
              Avg tenure: {seg.avgTenure}mo · CLV: ${seg.avgClv.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
