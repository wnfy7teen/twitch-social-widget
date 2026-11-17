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
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: config.animationSpeed } },
    exit: { opacity: 0, y: -12, transition: { duration: config.hideDuration } },
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="flex min-h-0 w-fit max-w-full items-center justify-center bg-transparent p-1"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="relative isolate flex h-fit w-fit max-w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-[#383735] bg-[#1b1b1a] p-2 shadow-lg">
            {config.showBackgroundParticles && <BackgroundParticles key={config.mode} />}
            <h1 className="relative z-10 w-full pt-0.5 text-center text-sm font-extrabold tracking-wide text-white/90">
              {config.title}
            </h1>
            <div
              className={`relative z-10 flex w-fit max-w-full items-center justify-center gap-1.5 ${
                config.mode === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col'
              }`}
            >
              {socialMediaList.map((item) => (
                <SocialCard
                  key={`${item.config.platform}-${config.animationSpeed}`}
                  config={item.config}
                  index={item.index}
                  theme={config.theme}
                  width={config.cardWidth}
                  height={config.cardHeight}
                  iconSize={config.iconSize}
                  textSize={config.textSize}
                  animationSpeed={config.animationSpeed}
                  glowIntensity={config.glowIntensity}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Widget;
