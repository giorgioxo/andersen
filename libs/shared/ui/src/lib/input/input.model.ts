export enum UiInputType {
  Text = 'text',
  Email = 'email',
  Password = 'password',
}

export enum UiPasswordVisibilityState {
  Hidden = 'hidden',
  Visible = 'visible',
}

export enum UiPasswordVisibilityIconType {
  Material = 'material',
  Svg = 'svg',
}

export interface UiPasswordVisibilityView {
  type: UiInputType;
  icon: string;
  iconType: UiPasswordVisibilityIconType;
  ariaLabel: string;
}

export type UiPasswordVisibilityConfig = Record<UiPasswordVisibilityState, UiPasswordVisibilityView>;
