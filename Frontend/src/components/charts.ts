import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartOptions
} from "chart.js";

// O Chart.js v4 é "tree-shakeable": registramos só o que usamos.
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Legend,
  Tooltip
);

// Mesmas cores do tema escuro da versão anterior.
// O genérico <"line" | "bar"> garante que só usamos opções válidas
// para esses dois tipos de gráfico.
export const darkChartOptions: ChartOptions<"line" | "bar"> = {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        color: "#f8fafc"
      }
    }
  },
  scales: {
    x: {
      ticks: { color: "#94a3b8" },
      grid: { color: "rgba(255,255,255,0.06)" }
    },
    y: {
      ticks: { color: "#94a3b8" },
      grid: { color: "rgba(255,255,255,0.06)" }
    }
  }
};
