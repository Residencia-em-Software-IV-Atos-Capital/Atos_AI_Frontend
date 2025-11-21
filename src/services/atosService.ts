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
      message: "Segue seu arquivo PDF gerado.",
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
      message: "Segue seu arquivo Excel gerado.",
      fileUrl,
      fileName,
    };
  }

  // --- CSV ---
  if (contentType.includes("text/csv")) {
    const decoder = new TextDecoder("utf-8");
    const csvText = decoder.decode(response.data);

    // criar download
    const blob = new Blob([csvText], { type: "text/csv" });
    const fileUrl = URL.createObjectURL(blob);
    const fileName = response.headers["x-filename"] || "relatorio.csv";

    return {
      type: "csv",
      message: csvText, // aqui vai texto puro, igual antes
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
