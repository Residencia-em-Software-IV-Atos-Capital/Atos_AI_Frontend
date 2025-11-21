import { api } from "./api";
import {
  AnalyzeResponse,
  CsvReportResponse,
  QueryRequest,
  RootResponse,
} from "../types/atos";

/**
 * GET /
 * Retorna status raiz da API
 */
export const getRoot = async (): Promise<RootResponse> => {
  const { data } = await api.get<RootResponse>("/");
  return data;
};

/**
 * POST /analyze
 * Envia uma pergunta para análise
 */
export const analyzeData = async (userQuestion: string) => {
  const payload = { user_question: userQuestion };

  const response = await api.post("/analyze", payload, {
    responseType: "arraybuffer", // permite PDF / CSV / JSON / texto
  });

  const contentType = response.headers["content-type"] || "";

// --- PDF ---
if (contentType.includes("application/pdf")) {
  const blob = new Blob([response.data], { type: "application/pdf" });
  const fileUrl = URL.createObjectURL(blob);
  const fileName = response.headers["x-filename"] || "relatorio.pdf";

  return {
    type: "pdf",
    message: "📄 PDF gerado.",
    fileUrl,
    fileName,
  };
}

// --- EXCEL (XLSX) ---
if (
  contentType.includes(
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  )
) {
  const blob = new Blob([response.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const fileUrl = URL.createObjectURL(blob);
  const fileName = response.headers["x-filename"] || "relatorio.xlsx";

  return {
    type: "excel",
    message: "📘 Excel gerado.",
    fileUrl,
    fileName,
  };
}

  // --- CSV (mantido exatamente como estava) ---
  if (contentType.includes("text/csv")) {
    const blob = new Blob([response.data], { type: "text/csv" });
    const fileUrl = URL.createObjectURL(blob);
    const fileName = response.headers["x-filename"] || "relatorio.csv";

    return {
      type: "csv",
      message: "📊 CSV gerado.",
      fileUrl,
      fileName,
    };
  }
};


/**
 * GET /report/csv
 * Gera relatório CSV com base na pergunta
 */
export const getCsvReport = async (
  userQuestion: string
): Promise<CsvReportResponse> => {
  const { data } = await api.get<CsvReportResponse>("/report/csv", {
    params: { user_question: userQuestion },
  });
  return data;
};
