export interface AuthNotificationConfig {
  method: string;
  urlPart: string;
  message: (email?: string) => string;
}

export const AUTH_SUCCESS_NOTIFICATION_CONFIG: AuthNotificationConfig[] = [
  {
    method: 'POST',
    urlPart: '/sign-up',
    message: (email) => `${email} registered successfully`,
  },
  {
    method: 'POST',
    urlPart: '/sign-in/reset',
    message: (email) => `${email} password reset successfully`,
  },
  {
    method: 'POST',
    urlPart: '/sign-in',
    message: (email) => `${email} signed in successfully`,
  },
  {
    method: 'DELETE',
    urlPart: '/sign-in/out',
    message: () => 'Signed out successfully',
  },
];
