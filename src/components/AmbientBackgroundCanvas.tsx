import React, { useEffect, useRef } from 'react';
import { BackgroundThemeId, BACKGROUND_THEMES } from '../types/background';

interface AmbientBackgroundCanvasProps {
  themeId: BackgroundThemeId;
  enabled: boolean;
}

export const AmbientBackgroundCanvas: React.FC<AmbientBackgroundCanvasProps> = ({ themeId, enabled }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotionQuery.matches) return;

    let animationFrameId = 0;
    let width = 0;
    let height = 0;
    let lastFrameTime = 0;
    const frameInterval = 1000 / 30;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const theme = BACKGROUND_THEMES.find((item) => item.id === themeId) ?? BACKGROUND_THEMES[0];
    const particleColor = theme.accentColor || '#f59e0b';
    const particleCount = Math.min(22, Math.max(12, Math.floor((width * height) / 95000)));

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.4 + 0.5,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18 - 0.05,
      alpha: Math.random() * 0.35 + 0.12,
      pulseSpeed: Math.random() * 0.01 + 0.004,
    }));

    let tick = 0;
    let pageVisible = document.visibilityState === 'visible';

    const shouldAnimate = () => pageVisible && !reduceMotionQuery.matches;

    const handleVisibility = () => {
      pageVisible = document.visibilityState === 'visible';
      if (shouldAnimate()) {
        lastFrameTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationFrameId);
      }
    };

    const render = (time = performance.now()) => {
      if (!shouldAnimate()) return;
      animationFrameId = requestAnimationFrame(render);
      if (time - lastFrameTime < frameInterval) return;
      lastFrameTime = time;

      ctx.clearRect(0, 0, width, height);
      tick += 1;

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;

        const alpha = particle.alpha * (0.7 + 0.3 * Math.sin(tick * particle.pulseSpeed));
        ctx.globalAlpha = alpha;
        ctx.fillStyle = particleColor;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j += 1) {
          const other = particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distanceSquared = dx * dx + dy * dy;
          if (distanceSquared < 55 * 55) {
            const distance = Math.sqrt(distanceSquared);
            ctx.globalAlpha = (1 - distance / 55) * 0.08;
            ctx.strokeStyle = particleColor;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
    };

    document.addEventListener('visibilitychange', handleVisibility);
    reduceMotionQuery.addEventListener('change', handleVisibility);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
      reduceMotionQuery.removeEventListener('change', handleVisibility);
    };
  }, [themeId, enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
      aria-hidden="true"
    />
  );
};
