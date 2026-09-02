import { useEffect, useRef, useState, useCallback } from "react";

export interface ScrollVelocityState {
  velocity: number;       // Raw px/ms velocity
  intensity: number;      // Normalized 0–1 (clamped)
  direction: 1 | -1;     // 1 = down, -1 = up
  progress: number;       // 0–1 page scroll progress
}

const MAX_VELOCITY = 40; // px/ms threshold for intensity = 1

export function useScrollVelocity(): ScrollVelocityState {
  const lastY = useRef(typeof window !== "undefined" ? window.scrollY : 0);
  const lastTime = useRef(performance.now());
  const rafId = useRef<number>(0);
  const decayRef = useRef<number>(0);

  const [state, setState] = useState<ScrollVelocityState>({
    velocity: 0,
    intensity: 0,
    direction: 1,
    progress: 0,
  });

  const update = useCallback(() => {
    const now = performance.now();
    const currentY = window.scrollY;
    const dt = Math.max(now - lastTime.current, 1);
    const dy = currentY - lastY.current;
    const rawVelocity = dy / dt; // px/ms

    lastY.current = currentY;
    lastTime.current = now;

    const absVel = Math.abs(rawVelocity);
    const direction = dy >= 0 ? 1 : -1;
    const intensity = Math.min(absVel / MAX_VELOCITY, 1);

    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docH > 0 ? currentY / docH : 0;

    setState(prev => {
      // Decay toward 0 when no scrolling
      const decayed = prev.intensity * 0.92;
      return {
        velocity: rawVelocity,
        intensity: Math.max(intensity, decayed),
        direction: (direction as 1 | -1),
        progress,
      };
    });

    decayRef.current = requestAnimationFrame(decay);
  }, []);

  const decay = useCallback(() => {
    setState(prev => ({
      ...prev,
      intensity: prev.intensity * 0.90,
    }));
  }, []);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(decayRef.current);
      update();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(decayRef.current);
    };
  }, [update]);

  return state;
}
