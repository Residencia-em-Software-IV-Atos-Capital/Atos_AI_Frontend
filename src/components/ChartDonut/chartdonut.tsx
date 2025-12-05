import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutProps {
  labels?: string[];
  values?: number[];
}

export default function ChartDonut({
  labels = ["Marketing", "Operacional", "RH"],
  values = [40, 35, 25],
}: DonutProps) {
  // Cores consistentes com a legenda
  const backgroundColors = [
    "rgb(220, 38, 38)",   // red-600
    "rgb(249, 115, 22)",  // orange-500
    "rgb(234, 179, 8)",   // yellow-500
    "rgb(156, 163, 175)", // gray-400
    "rgb(209, 213, 219)", // gray-300
  ];

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: backgroundColors.slice(0, values.length),
        borderWidth: 2,
        borderColor: "#ffffff",
        hoverOffset: 4,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 12,
          padding: 12,
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return ` ${label}: ${new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(value)} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="chart-wrapper donut-wrapper" style={{ height: '250px', width: '100%' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}