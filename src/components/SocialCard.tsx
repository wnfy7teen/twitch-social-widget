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
}

const cardVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const themeClasses: Record<ThemeName, string> = {
  default: 'bg-slate-700/65 border-slate-300/40',
  pink: 'bg-gradient-to-tr from-pink-500/25 to-fuchsia-500/25 border-pink-300/50',
  lavender: 'bg-gradient-to-tr from-indigo-400/25 to-violet-400/25 border-violet-200/50',
  purple: 'bg-gradient-to-tr from-violet-600/30 to-purple-900/35 border-purple-300/50',
};

const themeIconClasses: Record<ThemeName, string> = {
  default: 'bg-slate-500/80',
  pink: 'bg-pink-400/80',
  lavender: 'bg-indigo-400/80',
  purple: 'bg-violet-500/80',
};

const SocialCard: React.FC<SocialCardProps> = ({ config, index, theme, width, height, iconSize, textSize }) => {
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
      transition={{ delay: index * 0.08, duration: 0.3, type: 'spring', stiffness: 140 }}
      whileHover={{ scale: 1.025, boxShadow: '0 0 14px rgba(192, 132, 252, 0.35)' }}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        flex: '0 0 auto',
        boxSizing: 'border-box',
      }}
      className={`
        block max-w-full px-2.5 py-1.5 rounded-lg shadow-md backdrop-blur-md transition-all duration-300 ease-out
        ${themeClasses[theme]}
        text-white hover:shadow-[0_0_14px_rgba(192,132,252,0.35)]
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
