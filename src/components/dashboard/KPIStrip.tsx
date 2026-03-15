import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { calculateKPIs } from "@/data/churnData";

function Sparkline({ data, color, height = 48 }: { data: number[]; color: string; height?: number }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 120;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = height - ((v - min) / range) * (height - 8) - 4;
    return `${x},${y}`;
  });
  const pathD = points.reduce((acc, p, i) => (i === 0 ? `M ${p}` : `${acc} L ${p}`), "");

  return (
    <svg width={w} height={height} className="overflow-visible">
      <path d={pathD} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DeltaBadge({ value, suffix = "%", inverse = false }: { value: number; suffix?: string; inverse?: boolean }) {
  const isPositive = inverse ? value < 0 : value > 0;
  const isNeutral = value === 0;

  return (
    <span className={`inline-flex items-center gap-0.5 text-sm font-medium font-mono-data ${
      isNeutral ? "text-muted-foreground" : isPositive ? "text-success" : "text-destructive"
    }`}>
      {isNeutral ? <Minus className="w-3 h-3" /> : isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {value > 0 ? "+" : ""}{value}{suffix}
    </span>
  );
}

export default function KPIStrip() {
  const kpis = calculateKPIs();

  const cards = [
    {
      label: "Churn Rate",
      value: `${kpis.churnRate}%`,
      delta: kpis.churnRateDelta,
      inverse: true,
      sparkData: kpis.sparklines.map(s => s.churnRate),
      color: "hsl(0, 84%, 60%)",
    },
    {
      label: "Net Revenue Retention",
      value: `${kpis.nrr}%`,
      delta: kpis.nrrDelta,
      inverse: false,
      sparkData: kpis.sparklines.map(s => s.nrr),
      color: "hsl(221, 83%, 53%)",
    },
    {
      label: "ARPU",
      value: `$${kpis.arpu}`,
      delta: kpis.arpuDelta,
      inverse: false,
      suffix: "",
      sparkData: kpis.sparklines.map(s => s.mrr / 100),
      color: "hsl(221, 83%, 53%)",
    },
    {
      label: "Customer LTV",
      value: `$${kpis.clv.toLocaleString()}`,
      delta: kpis.clvDelta,
      inverse: false,
      suffix: "",
      sparkData: kpis.sparklines.map((_, i) => kpis.clv + (i - 6) * 50),
      color: "hsl(142, 71%, 45%)",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
          whileHover={{ y: -2 }}
          className="card-analytics p-6 transition-shadow"
        >
          <p className="text-label">{card.label}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h2 className="text-kpi">{card.value}</h2>
            <DeltaBadge value={card.delta} suffix={card.suffix ?? "%"} inverse={card.inverse} />
          </div>
          <div className="mt-4 rounded-md bg-secondary/50 p-2">
            <Sparkline data={card.sparkData} color={card.color} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
