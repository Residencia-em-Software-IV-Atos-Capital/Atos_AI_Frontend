import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------- Tipos ----------

export type BarPoint = {
  month_label: string; 
  total_sales: number;
};

export type BarResponse = {
  type: "bar";
  status: string;
  message: string;
  query: string;
  data: BarPoint[];
  x_axis: string | null;
  y_axis: string | null;
};

export type ClientPiePoint = {
  client_name: string;
  value_purchased: number;
  total_orders: number;
};

export type SellerPiePoint = {
  seller_name: string;
  total_sold: number;
};

export type PieResponse = {
  type: "pie";
  status: string;
  message: string;
  queries: { top_clients: string; top_sellers: string };
  data_clients: ClientPiePoint[];
  data_sellers: SellerPiePoint[];
  client_labels: { name: string; value: string; count: string };
  seller_labels: { name: string; value: string };
};

export type AnalyzeRequest = { user_question: string };

export type AnalyzeResponse = {
  message?: string;
  query?: string | null;
  data?: any;
  visualization_type?: string;
  x_axis?: string | null;
  y_axis?: string | null;
  label?: string | null;
  value?: string | null;
};

export function mapBarToChartJS(barData: BarPoint[]) {
  const labels = barData.map((p) => p.month_label);
  const data = barData.map((p) => Number(p.total_sales));
  return { labels, datasets: [{ label: "Vendas", data }] };
}

export function mapClientsToPie(clients: ClientPiePoint[]) {
  return {
    labels: clients.map((c) => c.client_name),
    values: clients.map((c) => Number(c.value_purchased)),
  };
}

export function mapSellersToPie(sellers: SellerPiePoint[]) {
  return {
    labels: sellers.map((s) => s.seller_name),
    values: sellers.map((s) => Number(s.total_sold)),
  };
}


/**
 * GET /bar/static
 */
export async function getStaticBarChart(): Promise<BarResponse> {
  const resp = await api.get<BarResponse>("/bar/static");
  return resp.data;
}

/**
 * GET /pie/static
 */
export async function getStaticPieChart(): Promise<PieResponse> {
  const resp = await api.get<PieResponse>("/pie/static");
  return resp.data;
}

/**
 * POST /analyze
 * Essa função trata respostas JSON e também possíveis retornos de arquivo (CSV/PDF/XLSX)
 * Retorna um objeto com: { isFile: boolean, filename?, mimeType?, blob?, json? }
 */
export async function analyzeData(
  userQuestion: string
): Promise<
  | ({ isFile: false } & { json: AnalyzeResponse })
  | ({ isFile: true } & { filename?: string; mimeType?: string; blob: Blob })
> {
  // Faz a requisição pedindo arraybuffer para lidar com arquivos binários quando o backend retornar.
  const url = "/analyze";
  const payload: AnalyzeRequest = { user_question: userQuestion };

  const resp = await api.post(url, payload, { responseType: "arraybuffer" });

  const contentType = resp.headers["content-type"] || "";
  const disposition = resp.headers["content-disposition"] || "";

  // Se for um arquivo (ex.: application/pdf, text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)
  if (contentType && !contentType.includes("application/json") && !contentType.includes("text/json")) {
    const filenameMatch = /filename\*=UTF-8''([^;\n\r]+)/i.exec(disposition) || /filename="?([^";\n\r]+)"?/i.exec(disposition);
    const filename = filenameMatch ? decodeURIComponent(filenameMatch[1]) : undefined;
    const blob = new Blob([resp.data], { type: contentType });
    return { isFile: true, filename, mimeType: contentType, blob };
  }

  // Caso seja JSON: decodifica o arraybuffer para string e parseia
  const text = new TextDecoder("utf-8").decode(resp.data);
  try {
    const json = JSON.parse(text) as AnalyzeResponse;
    return { isFile: false, json };
  } catch (err) {
    // Se não foi possível parsear, devolve erro simples
    throw new Error("Resposta do servidor não pôde ser parseada como JSON ou arquivo.");
  }
}

// ---------- Pequenas utilidades para salvar arquivo no front-end ----------
export function downloadBlob(blob: Blob, filename = "download") {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

// Export default agrupando funções para consumo simples
export default {
  getStaticBarChart,
  getStaticPieChart,
  analyzeData,
  mapBarToChartJS,
  mapClientsToPie,
  mapSellersToPie,
  downloadBlob,
};
