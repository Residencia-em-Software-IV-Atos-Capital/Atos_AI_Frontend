import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartBarProps {
  labels?: string[];
  values?: number[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  title?: string;
}

export function ChartBar({
  labels = ["Janeiro", "Fevereiro", "Março", "Abril"],
  values = [12, 19, 3, 5],
  xAxisLabel = "Mês/Ano",
  yAxisLabel = "Total de Vendas",
  title = "Evolução de Vendas",
}: ChartBarProps) {
  const data = {
    labels,
    datasets: [
      {
        label: yAxisLabel,
        data: values,
        backgroundColor: "rgba(220, 38, 38, 0.6)", // red-600 with opacity
        borderColor: "rgba(220, 38, 38, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          boxWidth: 12,
          padding: 12,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false, // Removido pois o título já está no Card
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            return ` ${context.dataset.label}: ${new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(value)}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: xAxisLabel,
          font: {
            size: 12,
            weight: 'bold',
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: yAxisLabel,
          font: {
            size: 12,
            weight: 'bold',
          },
        },
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              notation: 'compact',
              compactDisplay: 'short',
            }).format(value as number);
          },
        },
      },
    },
  };

  return (
    <div className="chart-wrapper bar-wrapper" style={{ height: '300px' }}>
      <Bar data={data} options={options} />
    </div>
  );
}

export default ChartBar;