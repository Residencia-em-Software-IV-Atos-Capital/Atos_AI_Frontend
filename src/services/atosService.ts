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
export const analyzeData = async (
  userQuestion: string
): Promise<AnalyzeResponse> => {
  const payload: QueryRequest = { user_question: userQuestion };
  const { data } = await api.post<AnalyzeResponse>("/analyze", payload);
  return data;
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
