import { motion } from "framer-motion";
import { calculateMonthlyMetrics } from "@/data/churnData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export default function ChurnTrendChart() {
  const metrics = calculateMonthlyMetrics();

  const data = metrics.map(m => ({
    month: m.month.replace("2024-", ""),
    churnRate: m.churnRate,
    retentionRate: m.retentionRate,
    churned: m.churnedCustomers,
    newCustomers: m.newCustomers,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.25 }}
      className="card-analytics p-6"
    >
      <h3 className="text-section-header mb-6">Monthly Churn Trend</h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" vertical={false} />
            <XAxis
              dataKey="month"
              tickFormatter={(v) => {
                const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                return monthNames[parseInt(v) - 1] || v;
              }}
              tick={{ fontSize: 12, fill: "hsl(215, 16%, 47%)" }}
              axisLine={{ stroke: "hsl(214, 32%, 91%)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "hsl(215, 16%, 47%)" }}
              tickFormatter={(v) => `${v}%`}
              axisLine={false}
              tickLine={false}
              width={45}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(214, 32%, 91%)",
                borderRadius: "8px",
                fontSize: "13px",
                fontFamily: "IBM Plex Mono, monospace",
              }}
              formatter={(value: number) => [`${value}%`]}
            />
            <Line
              type="linear"
              dataKey="churnRate"
              stroke="hsl(0, 84%, 60%)"
              strokeWidth={2}
              name="Churn Rate"
              dot={{ r: 3, fill: "hsl(0, 84%, 60%)" }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="linear"
              dataKey="retentionRate"
              stroke="hsl(142, 71%, 45%)"
              strokeWidth={2}
              name="Retention Rate"
              dot={{ r: 3, fill: "hsl(142, 71%, 45%)" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
