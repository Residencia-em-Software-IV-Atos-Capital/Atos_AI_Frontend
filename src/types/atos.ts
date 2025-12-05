export interface QueryRequest {
  user_question: string;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}

/**
 * Estrutura esperada de resposta genérica da API.
 * Como o OpenAPI não especifica o formato da resposta,
 * podemos criar tipos genéricos para previsibilidade.
 */
export interface AnalyzeResponse {
  result?: string;
  details?: Record<string, unknown>;
}

export interface CsvReportResponse {
  file_url?: string;
  data?: Record<string, unknown>[];
}

export interface RootResponse {
  status?: string;
  message?: string;
}
