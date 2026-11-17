import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SocialCard from './SocialCard';
import BackgroundParticles from './BackgroundParticles';
import { type WidgetConfig } from '../types';

const Widget: React.FC<{ config: WidgetConfig }> = ({ config }) => {
  const socialMediaList = [
    { config: config.instagram, index: 0 },
    { config: config.telegram, index: 1 },
    { config: config.website, index: 2 },
  ];

  // Visibility / auto-hide cycle
  const [visible, setVisible] = useState(!config.autoHide);

  useEffect(() => {
    if (!config.autoHide) {
      setVisible(true);
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const cycle = (isVisible: boolean) => {
      if (cancelled) return;
      setVisible(isVisible);
      const durationMs = (isVisible ? config.showDuration : config.hideDuration) * 1000;
      timer = setTimeout(() => cycle(!isVisible), Math.max(500, durationMs));
    };

    timer = setTimeout(() => cycle(true), Math.max(0, config.autoHideDelay) * 1000);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [config.autoHide, config.autoHideDelay, config.showDuration, config.hideDuration]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: config.animationSpeed } },
    exit: { opacity: 0, y: -20, transition: { duration: config.hideDuration } },
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="flex min-h-screen w-full items-center justify-center bg-transparent p-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="relative flex h-full w-full max-w-[1400px] flex-col items-center justify-center space-y-6 p-4 pl-8 pr-8">
            {/* Optional particle background */}
            {config.showBackgroundParticles && <BackgroundParticles />}
            {/* Header – customizable through settings */}
            <h1 className="text-3xl text-white/90 font-extrabold text-center tracking-wider pt-10 w-full">
              {config.title}
            </h1>
            <div
              className={`flex w-full items-center justify-center gap-5 ${
                config.mode === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col'
              }`}
            >
              {socialMediaList.map((item) => (
                <SocialCard key={item.config.platform} config={item.config} index={item.index} />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Widget;