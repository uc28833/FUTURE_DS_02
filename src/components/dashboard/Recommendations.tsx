import { motion } from "framer-motion";
import { AlertTriangle, Zap, Users, Gift } from "lucide-react";

const recommendations = [
  {
    icon: AlertTriangle,
    title: "At-Risk User Alert",
    description: "Implement automated webhook for users with >50% WoW login drop. Trigger a \"Success Check-in\" email within 24 hours.",
    impact: "Estimated 15-20% reduction in preventable churn",
    color: "hsl(0, 84%, 60%)",
  },
  {
    icon: Zap,
    title: "Annual Upsell Campaign",
    description: "Target Month-2 users with high engagement (>4 logins/week) for 15% annual plan discount to lock in tenure.",
    impact: "30% higher retention vs. monthly plans",
    color: "hsl(38, 92%, 50%)",
  },
  {
    icon: Users,
    title: "Onboarding Optimization",
    description: "Audit Time to First Value (TTFV). If Month 1 cohort retention <70%, simplify setup wizard and add guided tours.",
    impact: "Target: <5 min TTFV, +12% M1 retention",
    color: "hsl(221, 83%, 53%)",
  },
  {
    icon: Gift,
    title: "Win-Back Program",
    description: "For churned users with CLV >$1,500, offer 3-month \"Legacy Discount\" (25% off) within 60 days of cancellation.",
    impact: "8-12% reactivation rate expected",
    color: "hsl(142, 71%, 45%)",
  },
];

export default function Recommendations() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.45 }}
      className="card-analytics p-6"
    >
      <h3 className="text-section-header mb-6">Actionable Recommendations</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.01 }}
            className="rounded-lg border border-border p-4 transition-colors hover:bg-secondary/30"
          >
            <div className="flex items-start gap-3">
              <div
                className="p-2 rounded-md"
                style={{ backgroundColor: `${rec.color}15` }}
              >
                <rec.icon className="w-4 h-4" style={{ color: rec.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium">{rec.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{rec.description}</p>
                <p className="text-xs font-medium mt-2 font-mono-data" style={{ color: rec.color }}>
                  ↗ {rec.impact}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
