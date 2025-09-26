// src/components/ChartDonut.tsx
import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
//import "../styles/charts.css";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutProps {
  labels?: string[];
  values?: number[];
}

export default function ChartDonut({
  labels = ["Marketing", "Operacional", "RH"],
  values = [40, 35, 25],
}: DonutProps) {
  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "var(--primary-color)",
          "var(--secondary-color)",
          "var(--tertiary-color)",
        ],
        borderWidth: 0,
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
        },
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className="chart-wrapper donut-wrapper">
      <Doughnut data={data} options={options} />
    </div>
  );
}
