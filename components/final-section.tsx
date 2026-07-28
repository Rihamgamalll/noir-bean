'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function FinalSection() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    gsap.from('[data-final]', { y: 90, opacity: 0, stagger: .15, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: root.current, start: 'top 70%' } });
  }, { scope: root });
  return (
    <section id="contact" ref={root} className="relative overflow-hidden bg-[#2a1811] px-6 py-28 text-white lg:px-12">
      <div className="absolute inset-0 hero-cafe-bg opacity-25" />
      <div className="absolute inset-0 bg-[#21120d]/80" />
      <div className="relative z-10 mx-auto max-w-[1350px] overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#3b241a]/75 p-8 shadow-2xl backdrop-blur-xl md:p-14 lg:grid lg:grid-cols-[1fr_.85fr] lg:items-center">
        <div data-final>
          <p className="text-[10px] uppercase tracking-[.4em] text-[#e5bd98]">Your next coffee is waiting</p>
          <h2 className="mt-4 max-w-2xl font-serif text-[clamp(3.5rem,6vw,6.8rem)] leading-[.9] tracking-[-.05em]">Come for the coffee. Stay for the feeling.</h2>
          <p className="mt-6 max-w-lg text-white/60">A cinematic coffee experience, crafted with warmth, detail and a little everyday magic.</p>
          <div className="mt-8 flex flex-wrap gap-3"><a className="rounded-full bg-[#ead1b5] px-7 py-3.5 text-sm text-[#2a180f]" href="mailto:hello@coffee.example">Book a table</a><a className="rounded-full border border-white/20 px-7 py-3.5 text-sm" href="#home">Back to top</a></div>
        </div>
        <div data-final className="relative mt-10 aspect-[4/3] overflow-hidden rounded-[2rem] lg:mt-0">
          <Image src="/story-2.jpg" alt="Coffee shop ritual" fill sizes="(max-width: 900px) 90vw, 40vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
        </div>
      </div>
      <footer className="relative z-10 mx-auto mt-12 flex max-w-[1350px] flex-col gap-4 border-t border-white/10 pt-7 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between"><span>Coffee Roastery © 2026</span><span>Slowly roasted · beautifully served</span></footer>
    </section>
  );
}
