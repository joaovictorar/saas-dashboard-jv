import { Bar } from "react-chartjs-2";
import type { ChartData } from "chart.js";
import InsightsList, { type Insight } from "../components/InsightsList";
import { darkChartOptions } from "../components/charts";

const performanceData: ChartData<"bar"> = {
  labels: ["Visits", "Signups", "Trials", "Paid"],
  datasets: [
    {
      label: "Performance",
      data: [12450, 1284, 640, 326],
      backgroundColor: [
        "rgba(99, 102, 241, 0.7)",
        "rgba(139, 92, 246, 0.7)",
        "rgba(34, 197, 94, 0.7)",
        "rgba(249, 115, 22, 0.7)"
      ],
      borderRadius: 10
    }
  ]
};

const kpis: Insight[] = [
  { label: "Visits", value: "12,450" },
  { label: "Signups", value: "1,284" },
  { label: "Paid Users", value: "326" },
  { label: "Bounce Rate", value: "28%" }
];

export default function AnalyticsSection() {
  return (
    <section className="content-section active-section">
      <header className="topbar">
        <div>
          <h1>Analytics</h1>
          <p>Track product performance and growth trends.</p>
        </div>
      </header>

      <section className="panel-grid">
        <div className="panel">
          <div className="panel-header">
            <h2>Monthly Performance</h2>
          </div>
          <Bar data={performanceData} options={darkChartOptions} />
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>KPI Summary</h2>
          </div>
          <InsightsList items={kpis} />
        </div>
      </section>
    </section>
  );
}
