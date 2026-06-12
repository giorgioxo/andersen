export type NotificationStatus = 'success' | 'error';

export interface NotificationData {
  message: string;
  status: NotificationStatus;
}
