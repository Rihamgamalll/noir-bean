'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

type Bean = {
  id: number;
  left: string;
  top: string;
  size: number;
  delay: number;
  duration: number;
  rotate: number;
};

const BEANS: Bean[] = [
  { id: 1, left: '8%', top: '22%', size: 26, delay: 0, duration: 8, rotate: 25 },
  { id: 2, left: '16%', top: '68%', size: 18, delay: 1.5, duration: 9, rotate: -15 },
  { id: 3, left: '82%', top: '18%', size: 22, delay: 0.8, duration: 7.5, rotate: 40 },
  { id: 4, left: '88%', top: '74%', size: 16, delay: 2.2, duration: 10, rotate: -30 },
  { id: 5, left: '30%', top: '85%', size: 14, delay: 1.1, duration: 8.5, rotate: 60 },
  { id: 6, left: '70%', top: '88%', size: 20, delay: 0.4, duration: 9.5, rotate: -20 },
];

/**
 * Floating coffee beans scattered across the hero. Each bean uses a GSAP
 * yoyo loop with a per-bean phase so the motion never looks synchronized.
 */
export default function FloatingBeans() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const beans = gsap.utils.toArray<HTMLElement>('[data-bean]');
      beans.forEach((bean, i) => {
        gsap.set(bean, { opacity: 0, y: 30 });
        gsap.to(bean, {
          opacity: 0.5,
          y: -24,
          duration: 2,
          delay: 1 + i * 0.25,
          ease: 'power2.out',
        });
        gsap.to(bean, {
          y: '+=48',
          duration: BEANS[i].duration,
          delay: BEANS[i].delay,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
        gsap.to(bean, {
          rotation: BEANS[i].rotate + 20,
          duration: BEANS[i].duration * 1.3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
    >
      {BEANS.map((bean) => (
        <div
          key={bean.id}
          data-bean
          className="absolute"
          style={{ left: bean.left, top: bean.top }}
        >
          <svg
            width={bean.size}
            height={bean.size * 1.3}
            viewBox="0 0 24 32"
            fill="none"
            style={{ transform: `rotate(${bean.rotate}deg)` }}
          >
            <ellipse
              cx="12"
              cy="16"
              rx="8"
              ry="13"
              fill="#8D4F27"
              opacity="0.85"
            />
            <path
              d="M12 3 C 9 10, 9 22, 12 29"
              stroke="#0B0706"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
