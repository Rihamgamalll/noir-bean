'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

/**
 * Steam wisps rising above the coffee cup. Each wisp is a blurred vertical
 * gradient that fades in after the cup lands, then loops continuously.
 */
export default function Steam() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const wisps = gsap.utils.toArray<HTMLElement>('[data-wisp]');
      wisps.forEach((wisp, i) => {
        gsap.set(wisp, { opacity: 0, scaleY: 0.3, y: 20 });
        gsap.to(wisp, {
          opacity: 0.7,
          scaleY: 1,
          y: 0,
          duration: 1.4,
          delay: 2.4 + i * 0.3,
          ease: 'power2.out',
        });
        // continuous rising + drifting loop
        gsap.to(wisp, {
          y: -70,
          x: i % 2 === 0 ? 14 : -14,
          opacity: 0,
          duration: 3.5,
          delay: 3 + i * 0.4,
          ease: 'sine.inOut',
          repeat: -1,
          repeatDelay: 0.8,
        });
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-[14%] z-30 flex -translate-x-1/2 gap-3"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          data-wisp
          className="block h-28 w-3 origin-bottom rounded-full bg-gradient-to-t from-white/0 via-white/35 to-white/0 blur-[6px]"
          style={{ transformOrigin: 'bottom center' }}
        />
      ))}
    </div>
  );
}
