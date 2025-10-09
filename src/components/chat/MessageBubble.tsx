import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { Card } from "@/components/ui/card";

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    sender: "user" | "ai";
    label?: string;
    value?: string;
    type?: "text" | "report" | "chart";
    data?: Record<string, unknown>[] | null;
    visualization_type?: "line" | "bar" | "pie" | null;
    x_axis?: string | null;
    y_axis?: string | null;
  };
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === "user";

  const normalizeKey = (key: string | null | undefined, data: Record<string, unknown>[]) => {
    if (!key || data.length === 0) return null;
    const lower = key.toLowerCase();
    const found = Object.keys(data[0]).find((k) => k.toLowerCase() === lower);
    return found || key;
  };

  const renderChart = () => {
    if (!message.data || !message.visualization_type) return null;

    const xKey = normalizeKey(message.x_axis, message.data);
    const yKey = normalizeKey(message.y_axis, message.data);

    const labelKey = message.x_axis ?? message.label ?? "";
    const valueKey = message.y_axis ?? message.value ?? "";

    console.log("Mensagem renderizada: ", message);

    switch (message.visualization_type) {
      case "line":
        return (
          <LineChart data={message.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={xKey ?? ""}
              tick={{ fontSize: message.data.length > 5 ? 10 : 12 }}
              angle={-25}
              textAnchor="end"
              interval={0}
            />
            <YAxis />
            <Tooltip
              formatter={(value: number) =>
                new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
              }
            />
            <Line type="monotone" dataKey={yKey ?? ""} stroke="#4f46e5" strokeWidth={2} dot />
          </LineChart>
        );

      case "bar":
        return (
          <BarChart data={message.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={xKey ?? ""}
              tick={{ fontSize: message.data.length > 5 ? 10 : 12 }}
              angle={-25}
              textAnchor="end"
              interval={0}
            />
            <YAxis />
            <Tooltip
              formatter={(value: number) =>
                new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
              }
            />
            <Bar dataKey={yKey ?? ""} fill="#4f46e5" radius={[8, 8, 0, 0]}>
              <LabelList
                dataKey={yKey ?? ""}
                position="top"
                formatter={(value: number) =>
                  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value)
                }
              />
            </Bar>
          </BarChart>
        );

      case "pie": {
        if (!message.data || message.data.length === 0) return null;

        const labelKey = message.label ?? "nomeproduto";
        const valueKey = message.value ?? "total_vendas";

        const pieData = message.data.map(d => ({
          ...d,
          [valueKey]: Number(d[valueKey as keyof typeof d] ?? 0),
        }));

        return (
          <PieChart>
            <Pie
              data={pieData}
              dataKey={valueKey}
              nameKey={labelKey}
              outerRadius={100}
              fill="#4f46e5"
              label={(entry) =>
                `${entry[labelKey]}: ${new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                  maximumFractionDigits: 0,
                }).format(entry[valueKey] as number)}`
              }
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={`hsl(${(i * 60) % 360}, 70%, 60%)`} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) =>
                new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
              }
            />
          </PieChart>
        );
      }
      default:
        return null;
    }
  };

  // Determina altura mínima e aumenta conforme quantidade de dados
  const chartHeight = message.data ? Math.max(300, message.data.length * 50) : 300;

  return (
    <div className={`flex mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      <Card
        className={`p-4 rounded-2xl shadow-sm ${
          isUser ? "bg-gradient-primary text-primary-foreground" : "bg-card border border-border text-foreground"
        }`}
        style={{ width: "fit-content", maxWidth: "100%" }}
      >
        <div>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>

          {message.type === "chart" && message.data && (
            <div
              className="mt-4 overflow-x-auto"
              style={{ width: "100%", height: chartHeight }}
            >
              <div
                style={{
                  width: Math.max(500, message.data.length * 100),
                  height: "100%",
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  {renderChart()}
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
