export interface ApiResponse {
  statusCode?: number;
  message?: string;
  data?: any;
}

export interface ApiFetchOption {
  loading?: boolean;
  force?: boolean;
}
