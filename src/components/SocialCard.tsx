import React from 'react';
import { motion } from 'framer-motion';
import type { SocialMediaConfig, ThemeName } from '../types';
import { Instagram, Send, Globe } from 'lucide-react';

interface SocialCardProps {
  config: SocialMediaConfig;
  index: number;
  theme: ThemeName;
  width: number;
  height: number;
  iconSize: number;
  textSize: number;
  animationSpeed: number;
  glowIntensity: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const themeClasses: Record<ThemeName, string> = {
  default: 'bg-[#292826]/95 border-[#514d48]',
  pink: 'bg-gradient-to-tr from-[#30272c]/95 to-[#292326]/95 border-pink-300/45',
  lavender: 'bg-gradient-to-tr from-[#292a31]/95 to-[#25262c]/95 border-violet-200/45',
  purple: 'bg-gradient-to-tr from-[#2d2932]/95 to-[#252129]/95 border-purple-300/45',
};

const themeIconClasses: Record<ThemeName, string> = {
  default: 'bg-[#45413d]',
  pink: 'bg-[#704653]',
  lavender: 'bg-[#4b4d68]',
  purple: 'bg-[#59446f]',
};

const SocialCard: React.FC<SocialCardProps> = ({ config, index, theme, width, height, iconSize, textSize, animationSpeed, glowIntensity }) => {
  if (!config.isEnabled) return null;

  const isInstagram = config.platform === 'instagram';
  const isWebsite = config.platform === 'website';
  const Icon = isInstagram ? Instagram : isWebsite ? Globe : Send;

  return (
    <motion.a
      href={config.link}
      target="_blank"
      rel="noopener noreferrer"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.08, duration: animationSpeed, type: 'tween', ease: 'easeInOut' }}
      whileHover={{ scale: 1.025, boxShadow: `0 0 ${Math.round(24 * glowIntensity)}px rgba(236, 72, 153, ${0.55 * glowIntensity})`, transition: { duration: animationSpeed, ease: 'easeInOut' } }}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        flex: '0 0 auto',
        boxSizing: 'border-box',
        boxShadow: glowIntensity > 0 ? `0 0 ${Math.round(12 * glowIntensity)}px rgba(236, 72, 153, ${0.28 * glowIntensity})` : 'none',
      }}
      className={`
        block max-w-full px-2.5 py-1.5 rounded-lg shadow-md backdrop-blur-md
        ${themeClasses[theme]}
        text-white
        border cursor-pointer relative overflow-hidden
      `}
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-color-white)_0%,_transparent_70%)]" />
      <div className="relative z-10 flex h-full min-w-0 items-center gap-2">
        <div className={`shrink-0 p-1.5 rounded-full ${themeIconClasses[theme]} shadow-sm`}>
          <Icon style={{ width: iconSize, height: iconSize }} className="text-white" />
        </div>
        <div className="min-w-0">
          <h3 style={{ fontSize: textSize }} className="font-bold tracking-wide leading-tight">
            {isInstagram ? 'Instagram' : isWebsite ? 'Website' : 'Telegram'}
          </h3>
          <p style={{ fontSize: Math.max(9, textSize * 0.78) }} className="font-medium text-white/90 truncate">
            {isWebsite ? config.username : `@${config.username}`}
          </p>
        </div>
      </div>
    </motion.a>
  );
};

export default SocialCard;
