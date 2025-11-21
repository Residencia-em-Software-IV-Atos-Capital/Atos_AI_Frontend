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
import { Download } from "lucide-react";

interface MessageBubbleProps {
  message: {
    id: string;
    content: string; // pode ser texto ou CSV puro
    sender: "user" | "ai";
    label?: string;
    value?: string;
    type?: "text" | "report" | "chart";
    data?: Record<string, unknown>[] | null;
    visualization_type?: "line" | "bar" | "pie" | null;
    x_axis?: string | null;
    y_axis?: string | null;
    fileUrl?: string;
    fileName?: string;
    fileType?: "pdf" | "excel" | "csv";
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

  const downloadCSV = (csvString: string, filename = "dados.csv") => {
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseCSV = (csv: string) => {
    const [headerLine, ...lines] = csv.trim().split("\n");
    const headers = headerLine.split(",");
    const rows = lines.map((l) => l.split(","));
    return { headers, rows };
  };

  const isCSV = (text: string) => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) return false;
    const headers = lines[0].split(",");
    return headers.length > 1;
  };

  const renderChart = () => {
    if (!message.data || !message.visualization_type) return null;

    const xKey = normalizeKey(message.x_axis, message.data);
    const yKey = normalizeKey(message.y_axis, message.data);

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

  // ---------- Layout ----------
  const chartHeight = message.data ? Math.max(300, message.data.length * 50) : 300;
  const csvDetected = isCSV(message.content);

  return (
    <div className={`flex mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      <Card
        className={`p-4 rounded-2xl shadow-sm ${
          isUser
            ? "bg-gradient-primary text-primary-foreground"
            : "bg-card border border-border text-foreground"
        }`}
        style={{ width: "fit-content", maxWidth: "100%" }}
      >
        <div>
          {!csvDetected && <p className="text-sm whitespace-pre-wrap">{message.content}</p>}

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

          {message.type === "report" && message.fileUrl && !csvDetected && (
            <a
              href={message.fileUrl}
              download={message.fileName}
              className="px-4 py-2 mt-2 inline-block bg-primary text-white rounded-lg hover:bg-primary/80 transition"
            >
              ⬇️ Baixar {message.fileType === "pdf" ? "PDF" : "Excel"}
            </a>
          )}


          {/* CSV Detectado */}
          {csvDetected && (
            <div className="mt-4 space-y-2">
              <div className="overflow-x-auto border rounded">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      {parseCSV(message.content).headers.map((h, i) => (
                        <th
                          key={i}
                          className="px-2 py-1 border-b bg-gray-100 text-left font-medium"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parseCSV(message.content).rows.map((row, ri) => (
                      <tr key={ri}>
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-2 py-1 border-b">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={() =>
                  downloadCSV(message.content, `relatorio-${message.id}.csv`)
                }
                className="flex items-center gap-2 px-4 py-2 bg-gradient-primary text-white rounded-lg shadow transition"
              >
                <Download className="w-4 h-4" /> Baixar
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
