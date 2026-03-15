// ============================================================
// Synthetic dataset for Retention & Churn Analytics Dashboard
// ============================================================

export interface Customer {
  id: string;
  joinDate: string; // YYYY-MM
  churnDate: string | null;
  subscriptionType: "monthly" | "quarterly" | "annual";
  mrr: number;
  loginsPerWeek: number;
  featureAdoptionRate: number; // 0-1
  supportTickets: number;
  tenureMonths: number;
  status: "active" | "churned";
}

export interface MonthlyMetrics {
  month: string;
  startCustomers: number;
  newCustomers: number;
  churnedCustomers: number;
  endCustomers: number;
  churnRate: number;
  retentionRate: number;
  mrr: number;
  expansionMrr: number;
  contractionMrr: number;
  churnedMrr: number;
  nrr: number;
}

export interface CohortRow {
  cohort: string;
  sizes: number[];
  retentionRates: number[];
}

export interface SegmentData {
  segment: string;
  total: number;
  churned: number;
  churnRate: number;
  avgTenure: number;
  avgClv: number;
}

// --- Generate synthetic customers ---
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rand = seededRandom(42);

function generateCustomers(): Customer[] {
  const customers: Customer[] = [];
  const subTypes: Customer["subscriptionType"][] = ["monthly", "quarterly", "annual"];
  const subWeights = [0.5, 0.2, 0.3];

  const cohorts = [
    "2024-01","2024-02","2024-03","2024-04","2024-05","2024-06",
    "2024-07","2024-08","2024-09","2024-10","2024-11","2024-12",
  ];

  let id = 1;
  for (const cohort of cohorts) {
    const size = Math.floor(80 + rand() * 120);
    for (let i = 0; i < size; i++) {
      const r = rand();
      const subType = r < subWeights[0] ? subTypes[0] : r < subWeights[0] + subWeights[1] ? subTypes[1] : subTypes[2];
      const mrr = subType === "monthly" ? 29 + Math.floor(rand() * 70) : subType === "quarterly" ? 79 + Math.floor(rand() * 120) : 199 + Math.floor(rand() * 300);
      const featureAdoption = Math.min(1, Math.max(0, rand() * 0.6 + (subType === "annual" ? 0.3 : 0.1)));
      const logins = subType === "annual" ? 2 + rand() * 8 : 0.5 + rand() * 5;

      // Churn probability based on sub type, tenure, usage
      const cohortIdx = cohorts.indexOf(cohort);
      const maxTenure = 12 - cohortIdx;
      const baseChurn = subType === "monthly" ? 0.08 : subType === "quarterly" ? 0.04 : 0.02;
      const usageModifier = logins < 2 ? 1.8 : logins < 4 ? 1.0 : 0.5;

      let churned = false;
      let churnMonth: string | null = null;
      let tenure = maxTenure;

      for (let m = 1; m <= maxTenure; m++) {
        const monthChurn = baseChurn * usageModifier * (m <= 3 ? 1.5 : 0.7);
        if (rand() < monthChurn) {
          churned = true;
          tenure = m;
          const cm = cohortIdx + m;
          if (cm < 12) {
            churnMonth = `2024-${String(cm + 1).padStart(2, "0")}`;
          } else {
            churnMonth = `2025-${String(cm - 11).padStart(2, "0")}`;
          }
          break;
        }
      }

      customers.push({
        id: `C${String(id++).padStart(4, "0")}`,
        joinDate: cohort,
        churnDate: churned ? churnMonth : null,
        subscriptionType: subType,
        mrr,
        loginsPerWeek: Math.round(logins * 10) / 10,
        featureAdoptionRate: Math.round(featureAdoption * 100) / 100,
        supportTickets: Math.floor(rand() * 8),
        tenureMonths: tenure,
        status: churned ? "churned" : "active",
      });
    }
  }
  return customers;
}

export const customers = generateCustomers();

// --- Monthly Metrics ---
export function calculateMonthlyMetrics(): MonthlyMetrics[] {
  const months = [
    "2024-01","2024-02","2024-03","2024-04","2024-05","2024-06",
    "2024-07","2024-08","2024-09","2024-10","2024-11","2024-12",
  ];
  const metrics: MonthlyMetrics[] = [];

  for (const month of months) {
    const active = customers.filter(c => c.joinDate <= month && (!c.churnDate || c.churnDate > month));
    const startCustomers = customers.filter(c => c.joinDate < month && (!c.churnDate || c.churnDate >= month)).length;
    const newCust = customers.filter(c => c.joinDate === month).length;
    const churned = customers.filter(c => c.churnDate === month).length;
    const endCustomers = active.length;
    const mrr = active.reduce((s, c) => s + c.mrr, 0);
    const churnRate = startCustomers > 0 ? churned / startCustomers : 0;
    const expansionMrr = Math.round(mrr * 0.03);
    const churnedMrr = Math.round(mrr * churnRate);
    const contractionMrr = Math.round(mrr * 0.01);
    const startMrr = mrr - expansionMrr + churnedMrr + contractionMrr;
    const nrr = startMrr > 0 ? (startMrr + expansionMrr - churnedMrr - contractionMrr) / startMrr : 1;

    metrics.push({
      month,
      startCustomers: Math.max(startCustomers, 1),
      newCustomers: newCust,
      churnedCustomers: churned,
      endCustomers,
      churnRate: Math.round(churnRate * 1000) / 10,
      retentionRate: Math.round((1 - churnRate) * 1000) / 10,
      mrr,
      expansionMrr,
      contractionMrr,
      churnedMrr,
      nrr: Math.round(nrr * 1000) / 10,
    });
  }
  return metrics;
}

// --- Cohort Analysis ---
export function calculateCohorts(): CohortRow[] {
  const cohorts = [
    "2024-01","2024-02","2024-03","2024-04","2024-05","2024-06",
    "2024-07","2024-08","2024-09","2024-10","2024-11","2024-12",
  ];

  return cohorts.map((cohort, idx) => {
    const cohortCustomers = customers.filter(c => c.joinDate === cohort);
    const size = cohortCustomers.length;
    const maxMonths = 12 - idx;
    const sizes: number[] = [size];
    const rates: number[] = [100];

    for (let m = 1; m <= maxMonths; m++) {
      const monthStr = idx + m < 12
        ? `2024-${String(idx + m + 1).padStart(2, "0")}`
        : `2025-${String(idx + m - 11).padStart(2, "0")}`;
      const remaining = cohortCustomers.filter(c => !c.churnDate || c.churnDate > monthStr).length;
      sizes.push(remaining);
      rates.push(Math.round((remaining / size) * 100));
    }

    return { cohort, sizes, retentionRates: rates };
  });
}

// --- Segment Analysis ---
export function calculateSegments(): SegmentData[] {
  const types: Customer["subscriptionType"][] = ["monthly", "quarterly", "annual"];
  return types.map(type => {
    const seg = customers.filter(c => c.subscriptionType === type);
    const churned = seg.filter(c => c.status === "churned");
    return {
      segment: type.charAt(0).toUpperCase() + type.slice(1),
      total: seg.length,
      churned: churned.length,
      churnRate: Math.round((churned.length / seg.length) * 1000) / 10,
      avgTenure: Math.round(seg.reduce((s, c) => s + c.tenureMonths, 0) / seg.length * 10) / 10,
      avgClv: Math.round(seg.reduce((s, c) => s + c.mrr * c.tenureMonths, 0) / seg.length),
    };
  });
}

// --- Scatter data for churn vs usage ---
export function getScatterData() {
  return customers.map(c => ({
    featureAdoption: Math.round(c.featureAdoptionRate * 100),
    tenure: c.tenureMonths,
    status: c.status,
    logins: c.loginsPerWeek,
    id: c.id,
  }));
}

// --- KPI calculations ---
export function calculateKPIs() {
  const metrics = calculateMonthlyMetrics();
  const latest = metrics[metrics.length - 1];
  const prev = metrics[metrics.length - 2];

  const totalActive = customers.filter(c => c.status === "active").length;
  const totalChurned = customers.filter(c => c.status === "churned").length;
  const avgMrr = Math.round(customers.filter(c => c.status === "active").reduce((s, c) => s + c.mrr, 0) / totalActive);
  const avgChurnRate = latest.churnRate;
  const churnRateDelta = Math.round((latest.churnRate - prev.churnRate) * 10) / 10;
  const clv = Math.round(avgMrr / (avgChurnRate / 100));
  const prevClv = Math.round(avgMrr / (prev.churnRate / 100));

  return {
    churnRate: avgChurnRate,
    churnRateDelta,
    nrr: latest.nrr,
    nrrDelta: Math.round((latest.nrr - prev.nrr) * 10) / 10,
    arpu: avgMrr,
    arpuDelta: Math.round((avgMrr - Math.round(latest.mrr / latest.endCustomers)) * 10) / 10,
    clv,
    clvDelta: clv - prevClv,
    totalActive,
    totalChurned,
    mrr: latest.mrr,
    sparklines: metrics.map(m => ({ month: m.month, churnRate: m.churnRate, nrr: m.nrr, mrr: m.mrr })),
  };
}

// --- Churn reasons ---
export function getChurnReasons() {
  return [
    { reason: "Low product usage (<2 logins/week)", percentage: 34, count: Math.round(customers.filter(c => c.status === "churned").length * 0.34) },
    { reason: "Price sensitivity (monthly plans)", percentage: 22, count: Math.round(customers.filter(c => c.status === "churned").length * 0.22) },
    { reason: "Poor onboarding (Month 1-3 churn)", percentage: 19, count: Math.round(customers.filter(c => c.status === "churned").length * 0.19) },
    { reason: "Feature gaps / unmet needs", percentage: 14, count: Math.round(customers.filter(c => c.status === "churned").length * 0.14) },
    { reason: "Competitor switch", percentage: 7, count: Math.round(customers.filter(c => c.status === "churned").length * 0.07) },
    { reason: "Business closure / other", percentage: 4, count: Math.round(customers.filter(c => c.status === "churned").length * 0.04) },
  ];
}
