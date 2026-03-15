import KPIStrip from "@/components/dashboard/KPIStrip";
import CohortHeatmap from "@/components/dashboard/CohortHeatmap";
import ChurnTrendChart from "@/components/dashboard/ChurnTrendChart";
import SegmentBreakdown from "@/components/dashboard/SegmentBreakdown";
import ChurnScatter from "@/components/dashboard/ChurnScatter";
import ChurnReasons from "@/components/dashboard/ChurnReasons";
import Recommendations from "@/components/dashboard/Recommendations";
import { calculateKPIs } from "@/data/churnData";
import { Activity } from "lucide-react";

const Index = () => {
  const kpis = calculateKPIs();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-semibold tracking-tight">Retention Analytics</h1>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="font-mono-data">{kpis.totalActive + kpis.totalChurned} total customers</span>
            <span className="font-mono-data">{kpis.totalActive} active</span>
            <span className="font-mono-data text-destructive">{kpis.totalChurned} churned</span>
            <span className="rounded-md bg-secondary px-3 py-1 text-xs font-medium">Jan–Dec 2024</span>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-[1400px] mx-auto px-6 py-8 space-y-6">
        <KPIStrip />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChurnTrendChart />
          <SegmentBreakdown />
        </div>

        <CohortHeatmap />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChurnScatter />
          <ChurnReasons />
        </div>

        <Recommendations />
      </main>
    </div>
  );
};

export default Index;
