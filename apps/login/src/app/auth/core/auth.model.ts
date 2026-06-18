export interface IAuthApiResponse {
  email: string;
}

export interface IAuthResult {
  email: string;
  token: string;
  statusCode: number;
}
