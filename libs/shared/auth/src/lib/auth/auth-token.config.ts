export interface AuthTokenResponseConfig {
  method: string;
  urlPart: string;
}

export const AUTH_TOKEN_RESPONSE_CONFIG: AuthTokenResponseConfig[] = [
  {
    method: 'POST',
    urlPart: '/sign-in',
  },
];
