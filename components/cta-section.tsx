'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowRight, Coffee } from 'lucide-react';

gsap.registerPlugin(useGSAP);

/**
 * Premium CTA buttons that animate upward into place on load.
 */
export default function CTASection() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const btns = gsap.utils.toArray<HTMLElement>('[data-cta]');
      gsap.set(btns, { y: 40, opacity: 0 });
      gsap.to(btns, {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        delay: 2,
        ease: 'power3.out',
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative z-20 mt-12 flex flex-wrap items-center gap-4">
      <a
        data-cta
        href="#order"
        className="group inline-flex items-center gap-2.5 rounded-full bg-coffee-primary px-7 py-4 text-sm font-medium tracking-wide text-coffee-bg transition-all duration-300 hover:bg-coffee-cream hover:shadow-[0_0_40px_rgba(216,167,120,0.35)]"
      >
        Order the Reserve
        <ArrowRight
          size={16}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </a>

      <a
        data-cta
        href="#origins"
        className="group inline-flex items-center gap-2.5 rounded-full border border-white/15 px-7 py-4 text-sm font-light tracking-wide text-white/80 transition-all duration-300 hover:border-coffee-primary/50 hover:text-white"
      >
        <Coffee size={16} className="text-coffee-primary" />
        Explore Origins
      </a>
    </div>
  );
}
