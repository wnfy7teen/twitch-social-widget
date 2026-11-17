import React from 'react';
import { motion } from 'framer-motion';
import type { SocialMediaConfig } from '../types';
import { Instagram, Send, Globe } from 'lucide-react';

interface SocialCardProps {
  config: SocialMediaConfig;
  index: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const SocialCard: React.FC<SocialCardProps> = ({ config, index }) => {
  if (!config.isEnabled) return null;

  const isInstagram = config.platform === 'instagram';
  const isTelegram = config.platform === 'telegram';
  const isWebsite = config.platform === 'website';
  const Icon = isInstagram ? Instagram : isWebsite ? Globe : Send;

  // Dynamic gradient/color classes based on platform/config (simplified for now)
  const platformClasses = isInstagram
    ? 'bg-gradient-to-tr from-pink-500/20 to-purple-500/20 border-pink-300/50'
    : isWebsite
      ? 'bg-gradient-to-tr from-violet-500/20 to-fuchsia-500/20 border-violet-300/50'
      : 'bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 border-blue-300/50';

  return (
    <motion.a
      href={config.link}
      target="_blank"
      rel="noopener noreferrer"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.15, duration: 0.5, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(255, 105, 180, 0.8)" }} // Instagram glow style
      className={`
        block w-full max-w-[520px] h-32 p-6 rounded-2xl shadow-xl backdrop-blur-md transition-all duration-300 ease-out
        ${platformClasses}
        text-white
        hover:shadow-[0_0_35px_rgba(192,132,252,0.7)]
        border-2
        cursor-pointer
        relative overflow-hidden
      `}
    >
      {/* Subtle background effect placeholder (particles/waves would go here) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-color-white)_0%,_transparent_70%)]"></div>

      <div className="relative z-10 flex items-center space-x-4">
        <div className={`p-3.5 rounded-full ${isInstagram ? 'bg-pink-400/70' : isWebsite ? 'bg-violet-400/70' : 'bg-blue-400/70'} shadow-lg`}>
          <Icon className="w-10 h-10 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold tracking-wide leading-none">{isInstagram ? 'Instagram' : isWebsite ? 'Website' : 'Telegram'}</h3>
          <p className="text-base font-medium text-white/90">{isWebsite ? config.username : `@${config.username}`}</p>
        </div>
      </div>
    </motion.a>
  );
};

export default SocialCard;