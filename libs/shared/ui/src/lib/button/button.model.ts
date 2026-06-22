export enum UiButtonPriority {
  Primary = 'primary',
  Secondary = 'secondary',
}

export type UiButtonType = 'button' | 'submit' | 'reset';

export const transformUiButtonPriority = (priority: string): UiButtonPriority =>
  priority === UiButtonPriority.Secondary ? UiButtonPriority.Secondary : UiButtonPriority.Primary;
