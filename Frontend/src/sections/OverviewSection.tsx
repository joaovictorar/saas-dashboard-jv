import { Line } from "react-chartjs-2";
import type { ChartData } from "chart.js";
import InsightsList, { type Insight } from "../components/InsightsList";
import { darkChartOptions } from "../components/charts";
import type { DashboardResponse } from "../types/api";

interface OverviewSectionProps {
  // null enquanto a API ainda não respondeu
  dashboard: DashboardResponse | null;
}

const revenueData: ChartData<"line"> = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Revenue",
      data: [400, 650, 800, 720, 1100, 1200],
      borderColor: "#6366f1",
      backgroundColor: "rgba(99, 102, 241, 0.15)",
      fill: true,
      tension: 0.35
    }
  ]
};

const insights: Insight[] = [
  { label: "Monthly Growth", value: "+18.4%" },
  { label: "New Customers", value: "+42" },
  { label: "Churn Rate", value: "2.1%" },
  { label: "Conversion", value: "6.8%" }
];

export default function OverviewSection({ dashboard }: OverviewSectionProps) {
  const metrics = dashboard?.data ?? [];

  return (
    <section className="content-section active-section">
      <header className="topbar">
        <div>
          <h1>Dashboard Overview</h1>
          <p>{dashboard ? dashboard.message : "Loading user..."}</p>
        </div>
      </header>

      <section className="stats-grid">
        {metrics.map((item) => (
          <div className="stat-card" key={item.name}>
            <h3>{item.name}</h3>
            <p>{item.value}</p>
          </div>
        ))}
      </section>

      <section className="panel-grid">
        <div className="panel">
          <div className="panel-header">
            <h2>Revenue Analytics</h2>
            <span className="badge">Live</span>
          </div>
          <Line data={revenueData} options={darkChartOptions} />
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Quick Insights</h2>
          </div>
          <InsightsList items={insights} />
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Metrics Table</h2>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((item) => (
                <tr key={item.name}>
                  <td>{item.name}</td>
                  <td>{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
