export type Platform = 'instagram' | 'telegram' | 'website';

export type ThemeName = 'default' | 'pink' | 'lavender' | 'purple';

export type WidgetMode = 'horizontal' | 'vertical';

export interface SocialMediaConfig {
  platform: Platform;
  username: string;
  link: string;
  isEnabled: boolean;
}

export interface WidgetConfig {
  title: string;
  mode: WidgetMode;
  theme: ThemeName;
  animationSpeed: number;
  glowIntensity: number;
  showBackgroundParticles: boolean;
  autoHide: boolean;
  autoHideDelay: number;
  showDuration: number;
  hideDuration: number;
  instagram: SocialMediaConfig;
  telegram: SocialMediaConfig;
  website: SocialMediaConfig;
}