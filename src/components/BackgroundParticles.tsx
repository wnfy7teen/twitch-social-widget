// Responsive canvas particle background.
// Re-measures its parent whenever the widget changes dimensions or orientation.
import React, { useEffect, useRef } from 'react';

const BackgroundParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let width = 0;
    let height = 0;
    const particles: { x: number; y: number; r: number; vx: number; vy: number; opacity: number }[] = [];
    const PARTICLE_COUNT = 30;

    const resize = () => {
      const nextWidth = canvas.clientWidth;
      const nextHeight = canvas.clientHeight;
      if (!nextWidth || !nextHeight) return;

      const sizeChanged = nextWidth !== width || nextHeight !== height;
      if (!sizeChanged) return;

      width = nextWidth;
      height = nextHeight;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      // Keep existing particles in proportion when the layout changes.
      particles.forEach((particle) => {
        particle.x = Math.min(width, Math.max(0, particle.x));
        particle.y = Math.min(height, Math.max(0, particle.y));
      });

      while (particles.length < PARTICLE_COUNT) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: 2 + Math.random() * 3,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          opacity: 0.2 + Math.random() * 0.3,
        });
      }
    };

    resize();

    const render = () => {
      resize();
      ctx.clearRect(0, 0, width, height);
      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${particle.opacity})`;
        ctx.fill();

        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < -particle.r) particle.x = width + particle.r;
        if (particle.x > width + particle.r) particle.x = -particle.r;
        if (particle.y < -particle.r) particle.y = height + particle.r;
        if (particle.y > height + particle.r) particle.y = -particle.r;
      });
      animationFrameId = requestAnimationFrame(render);
    };

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(resize)
      : null;
    if (canvas.parentElement) resizeObserver?.observe(canvas.parentElement);
    window.addEventListener('resize', resize);
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full pointer-events-none"
    />
  );
};

export default BackgroundParticles;
