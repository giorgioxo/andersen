export interface IAuthApiResponse {
  email: string;
}

export interface IAuthResult {
  email: string;
  token: string;
  statusCode: number;
}

export interface IAuthSession {
  email: string;
  token: string;
}

export interface ILogoutPayload {
  email: string;
  password: string;
  token: string;
}
