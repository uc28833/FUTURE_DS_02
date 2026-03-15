import { motion } from "framer-motion";
import { getScatterData } from "@/data/churnData";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from "recharts";

export default function ChurnScatter() {
  const data = getScatterData();
  const active = data.filter(d => d.status === "active");
  const churned = data.filter(d => d.status === "churned");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.35 }}
      className="card-analytics p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-section-header">Churn vs. Feature Adoption</h3>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Active
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-destructive" />
            Churned
          </span>
        </div>
      </div>

      {/* Danger Zone Label */}
      <div className="h-[280px] relative">
        <div className="absolute top-[55%] left-[8%] text-[10px] font-medium text-destructive/60 uppercase tracking-widest pointer-events-none z-10">
          Danger Zone
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
            <XAxis
              dataKey="featureAdoption"
              name="Feature Adoption"
              tick={{ fontSize: 12, fill: "hsl(215, 16%, 47%)" }}
              tickFormatter={(v) => `${v}%`}
              axisLine={{ stroke: "hsl(214, 32%, 91%)" }}
              tickLine={false}
              label={{ value: "Feature Adoption %", position: "insideBottom", offset: -5, fontSize: 11, fill: "hsl(215, 16%, 47%)" }}
            />
            <YAxis
              dataKey="tenure"
              name="Tenure"
              tick={{ fontSize: 12, fill: "hsl(215, 16%, 47%)" }}
              axisLine={false}
              tickLine={false}
              width={35}
              label={{ value: "Tenure (months)", angle: -90, position: "insideLeft", fontSize: 11, fill: "hsl(215, 16%, 47%)" }}
            />
            <ZAxis range={[20, 20]} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(214, 32%, 91%)",
                borderRadius: "8px",
                fontSize: "12px",
                fontFamily: "IBM Plex Mono, monospace",
              }}
            />
            <Scatter name="Active" data={active} fill="hsl(221, 83%, 53%)" opacity={0.6} />
            <Scatter name="Churned" data={churned} fill="hsl(0, 84%, 60%)" opacity={0.6} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
