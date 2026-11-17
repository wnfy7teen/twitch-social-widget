import type { WidgetConfig, SocialMediaConfig, WidgetMode, ThemeName } from './types';

export type { WidgetConfig, SocialMediaConfig, WidgetMode, ThemeName } from './types';

export const defaultCardSizes = {
  cardWidth: 220,
  cardHeight: 48,
  iconSize: 18,
  textSize: 14,
};

export const defaultInstagramConfig: SocialMediaConfig = {
  platform: 'instagram',
  username: 'elya_asmadulova',
  link: 'https://www.instagram.com/elya_asmadulova/',
  isEnabled: true,
};

export const defaultTelegramConfig: SocialMediaConfig = {
  platform: 'telegram',
  username: 'vanesso44ka',
  link: 'https://t.me/vanesso44ka',
  isEnabled: true,
};

export const defaultWebsiteConfig: SocialMediaConfig = {
  platform: 'website',
  username: 'vanesso4ka.site',
  link: 'https://vanesso4ka.site',
  isEnabled: true,
};

export const initialConfig: WidgetConfig = {
  title: 'Follow Me',
  mode: 'horizontal',
  theme: 'pink',
  ...defaultCardSizes,
  animationSpeed: 0.6,
  glowIntensity: 0.7,
  showBackgroundParticles: true,
  autoHide: false,
  autoHideDelay: 5,
  showDuration: 12,
  hideDuration: 30,
  instagram: defaultInstagramConfig,
  telegram: defaultTelegramConfig,
  website: defaultWebsiteConfig,
};
