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
} from "recharts";
import { Card } from "@/components/ui/card";

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    sender: "user" | "ai";
    type?: "text" | "report" | "chart";
    data?: Record<string, unknown>[] | null;
    visualization_type?: "line" | "bar" | "pie" | null;
    x_axis?: string | null;
    y_axis?: string | null;
  };
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === "user";

  const renderChart = () => {
    if (!message.data || !message.visualization_type) return null;

    switch (message.visualization_type) {
      case "line":
        return (
          <LineChart data={message.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={message.x_axis ?? ""} />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={message.y_axis ?? ""}
              stroke="#4f46e5"
              strokeWidth={2}
            />
          </LineChart>
        );

      case "bar":
        return (
          <BarChart data={message.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={message.x_axis ?? ""} />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey={message.y_axis ?? ""}
              fill="#4f46e5"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        );

      case "pie":
        return (
          <PieChart>
            <Pie
              data={message.data}
              dataKey={message.y_axis ?? ""}
              nameKey={message.x_axis ?? ""}
              outerRadius={100}
              fill="#4f46e5"
              label
            >
              {message.data.map((_, i) => (
                <Cell
                  key={i}
                  fill={`hsl(${(i * 60) % 360}, 70%, 60%)`}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`flex mb-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <Card
        className={`max-w-lg p-4 rounded-2xl shadow-sm ${
          isUser
            ? "bg-gradient-primary text-primary-foreground"
            : "bg-card border border-border text-foreground"
        }`}
      >
        <div>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>

          {message.type === "chart" && message.data && (
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
