export enum NotificationStatus {
  Success = 'success',
  Error = 'error',
}

export interface NotificationData {
  message: string;
  status: NotificationStatus;
}
