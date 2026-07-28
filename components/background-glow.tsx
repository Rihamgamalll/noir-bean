'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

/**
 * Full-screen radial glow that fades in on load and slowly drifts.
 */
export default function BackgroundGlow() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();
      tl.from(root.current, {
        opacity: 0,
        duration: 2.2,
        ease: 'power2.out',
      });
      tl.to(
        root.current,
        {
          scale: 1.08,
          duration: 14,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        },
        '>-0.5',
      );
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* Primary warm radial glow centered behind the cup */}
      <div className="absolute left-1/2 top-1/2 h-[120vh] w-[120vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-coffee-radial" />

      {/* Secondary accent bloom, lower-left */}
      <div className="absolute bottom-[-20%] left-[-10%] h-[60vh] w-[60vh] rounded-full bg-[radial-gradient(circle,rgba(141,79,39,0.12)_0%,rgba(11,7,6,0)_70%)]" />

      {/* Subtle vignette to deepen edges */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(11,7,6,0.85)_100%)]" />
    </div>
  );
}
