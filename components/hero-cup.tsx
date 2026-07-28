'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

/**
 * Glass coffee cup rendered as SVG with a rise-from-bottom entry animation
 * and slow-breathing scale, surrounded by concentric decorative rings.
 */
export default function HeroCup() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cup = root.current?.querySelector('[data-cup]');
      const rings = root.current?.querySelector('[data-rings]');

      if (cup) {
        gsap.set(cup, { y: 140, opacity: 0 });
        gsap.to(cup, {
          y: 0,
          opacity: 1,
          duration: 1.6,
          delay: 1.2,
          ease: 'power3.out',
        });
        gsap.to(cup, {
          y: -10,
          duration: 4,
          delay: 2.8,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      }

      if (rings) {
        gsap.set(rings, { opacity: 0, scale: 0.8 });
        gsap.to(rings, {
          opacity: 1,
          scale: 1,
          duration: 1.8,
          delay: 1.4,
          ease: 'power2.out',
        });
        gsap.to(rings, {
          rotate: 360,
          duration: 80,
          delay: 2,
          ease: 'none',
          repeat: -1,
        });
      }
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="relative flex h-full w-full items-center justify-center"
    >
      {/* Concentric decorative rings behind the cup */}
      <div
        data-rings
        aria-hidden
        className="absolute inset-0 flex items-center justify-center"
      >
        <svg
          width="560"
          height="560"
          viewBox="0 0 560 560"
          fill="none"
          className="max-w-[120%] opacity-60"
        >
          <circle
            cx="280"
            cy="280"
            r="120"
            stroke="#D8A778"
            strokeWidth="0.5"
            opacity="0.35"
          />
          <circle
            cx="280"
            cy="280"
            r="170"
            stroke="#D8A778"
            strokeWidth="0.5"
            opacity="0.28"
          />
          <circle
            cx="280"
            cy="280"
            r="220"
            stroke="#8D4F27"
            strokeWidth="0.5"
            opacity="0.22"
          />
          <circle
            cx="280"
            cy="280"
            r="270"
            stroke="#D8A778"
            strokeWidth="0.5"
            opacity="0.14"
            strokeDasharray="2 8"
          />
          {/* Dashed tick ring */}
          <circle
            cx="280"
            cy="280"
            r="200"
            stroke="#D8A778"
            strokeWidth="0.75"
            opacity="0.3"
            strokeDasharray="1 14"
          />
        </svg>
      </div>

      {/* The glass cup */}
      <div data-cup className="relative z-10 w-[300px] sm:w-[340px] md:w-[380px]">
        <svg
          viewBox="0 0 300 420"
          fill="none"
          className="w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
        >
          <defs>
            <linearGradient id="glassBody" x1="60" y1="0" x2="240" y2="420" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1A110D" />
              <stop offset="0.5" stopColor="#241710" />
              <stop offset="1" stopColor="#120B08" />
            </linearGradient>
            <linearGradient id="glassRim" x1="80" y1="40" x2="220" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#D8A778" />
              <stop offset="0.5" stopColor="#F2E7DC" />
              <stop offset="1" stopColor="#D8A778" />
            </linearGradient>
            <linearGradient id="coffeeSurface" x1="100" y1="70" x2="200" y2="110" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8D4F27" />
              <stop offset="0.6" stopColor="#6B3818" />
              <stop offset="1" stopColor="#3E2010" />
            </linearGradient>
            <radialGradient id="crema" cx="150" cy="90" r="55" gradientUnits="userSpaceOnUse">
              <stop stopColor="#D8A778" stopOpacity="0.9" />
              <stop offset="0.7" stopColor="#B07A4A" stopOpacity="0.5" />
              <stop offset="1" stopColor="#8D4F27" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="highlight" x1="80" y1="120" x2="100" y2="360" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" stopOpacity="0.18" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Cup body — glass tumbler */}
          <path
            d="M88 70 L92 388 Q92 408 112 408 L188 408 Q208 408 208 388 L212 70 Z"
            fill="url(#glassBody)"
            stroke="rgba(216,167,120,0.25)"
            strokeWidth="1"
          />

          {/* Glass left highlight */}
          <path
            d="M98 90 L101 360"
            stroke="url(#highlight)"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Coffee surface */}
          <ellipse cx="150" cy="78" rx="62" ry="12" fill="url(#coffeeSurface)" />
          {/* Crema ring */}
          <ellipse cx="150" cy="78" rx="62" ry="12" fill="url(#crema)" />
          {/* Rim */}
          <ellipse
            cx="150"
            cy="72"
            rx="63"
            ry="10"
            fill="none"
            stroke="url(#glassRim)"
            strokeWidth="2"
          />

          {/* Saucer */}
          <ellipse cx="150" cy="408" rx="96" ry="14" fill="#120B08" opacity="0.9" />
          <ellipse
            cx="150"
            cy="404"
            rx="96"
            ry="14"
            fill="none"
            stroke="rgba(216,167,120,0.3)"
            strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  );
}
