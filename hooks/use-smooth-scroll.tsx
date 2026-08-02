'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Wires Lenis smooth scrolling into the GSAP ticker and ScrollTrigger,
 * so scroll-driven animations stay perfectly in sync with inertia scrolling.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;

    const lenis = new Lenis({
      // Keep the already-good mobile feel unchanged; make desktop react faster.
      lerp: isDesktop ? 0.22 : 0.1,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1,
      wheelMultiplier: 1,
      autoRaf: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(500, 16);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);
}

/**
 * SmoothScrollProvider initializes Lenis for the whole page.
 * Drop it once near the root of the app.
 */
export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useSmoothScroll();
  return <>{children}</>;
}
