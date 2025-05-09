export interface IApiResponse<T = any> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
  pagination?: { total: number; page: number; limit: number };
}
