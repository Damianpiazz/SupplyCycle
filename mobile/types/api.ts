// ADR-0000: Standard API response types

export interface ApiResponse<T> {
  data: T;
}

export interface ApiListResponse<T> {
  data: T[];
  total: number;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    timestamp: string;
    details?: Record<string, string[]>;
  };
}
