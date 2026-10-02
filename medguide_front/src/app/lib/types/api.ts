export interface ApiError {
  success: false;
  error: string;
  details?: unknown;
}

export interface AxiosErrorResponse {
  code?: string;
  response?: {
    status: number;
    statusText: string;
    data?: ApiError;
  };
  message?: string;
  name?: string;
}

export interface LocalStorageUser {
  id: string;
  name: string;
  email: string;
  cpf: string;
  created: string;
}
