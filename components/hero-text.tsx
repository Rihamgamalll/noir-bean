'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const background = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const cupStage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

      if (prefersReducedMotion) return;

      /*
       * دخول الهيدر فقط.
       * لا توجد حركة مستمرة للمج حتى لا يتغير مكانه.
       */
      const intro = gsap.timeline({
        defaults: {
          ease: 'power3.out',
        },
      });

      intro
        .from(background.current, {
          scale: 1.08,
          opacity: 0,
          duration: 1.7,
        })
        .from(
          '[data-kicker]',
          {
            y: 18,
            opacity: 0,
            duration: 0.7,
          },
          0.25,
        )
        .from(
          '[data-title-line]',
          {
            y: 70,
            opacity: 0,
            filter: 'blur(12px)',
            stagger: 0.12,
            duration: 1,
          },
          0.38,
        )
        .from(
          '[data-description]',
          {
            y: 24,
            opacity: 0,
            duration: 0.8,
          },
          0.9,
        )
        .from(
          '[data-actions]',
          {
            y: 24,
            opacity: 0,
            duration: 0.8,
          },
          1,
        )
        .from(
          cupStage.current,
          {
            y: 90,
            opacity: 0,
            scale: 0.92,
            duration: 1.45,
          },
          0.48,
        );

      /*
       * نثبت الهيدر لفترة قصيرة.
       * المج والظل يظلان ثابتين تمامًا.
       * الخلفية والنص فقط يتحركان بشكل خفيف.
       */
      const heroScroll = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=95%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      heroScroll
        .to(
          content.current,
          {
            y: -55,
            opacity: 0.12,
            filter: 'blur(3px)',
            ease: 'none',
            duration: 1,
          },
          0,
        )
        .to(
          background.current,
          {
            scale: 1.04,
            yPercent: -3,
            ease: 'none',
            duration: 1,
          },
          0,
        );

      /*
       * Refresh بعد تحميل الصور حتى يحسب ScrollTrigger
       * المقاسات والمواقع بصورة صحيحة.
       */
      const refreshScrollTrigger = () => {
        ScrollTrigger.refresh();
      };

      window.addEventListener('load', refreshScrollTrigger);

      return () => {
        window.removeEventListener('load', refreshScrollTrigger);
      };
    },
    {
      scope: root,
    },
  );

  return (
    <section
      id="home"
      ref={root}
      className="relative h-[100svh] min-h-[720px] overflow-hidden bg-[#7d563f] text-white"
    >
      {/* صورة المقهى */}
      <div
        ref={background}
        className="absolute -inset-5 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/Coffe.png')",
        }}
      />

      {/* تلوين دافئ قريب من الفيديو */}
      <div className="absolute inset-0 bg-[#795038]/10 backdrop-blur-[0.7px]" />

      {/* تغميق ناحية النص فقط */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(24,12,8,.76)_0%,rgba(39,21,14,.47)_32%,rgba(75,47,31,.10)_58%,rgba(31,15,9,.04)_100%)]" />

      {/* إضاءة كريمية خلف المج */}
      <div className="absolute left-1/2 top-[57%] h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f4d8b8]/12 blur-[115px]" />

      {/* Vignette خفيف */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_56%,rgba(22,10,6,.24)_100%)]" />

      {/* النص */}
      <div
        ref={content}
        className="relative z-30 mx-auto flex h-full max-w-[1500px] items-center px-7 pt-16 md:px-12 lg:px-16"
      >
        <div className="max-w-[510px] -translate-y-7">
          <p
            data-kicker
            className="mb-5 text-[9px] uppercase tracking-[0.4em] text-[#f2d4b4]"
          >
            Freshly brewed · crafted with care
          </p>

          <h1 className="font-serif text-[clamp(3rem,5vw,5.7rem)] leading-[0.9] tracking-[-0.045em]">
            <span data-title-line className="block">
              Ceremonial
            </span>

            <span
              data-title-line
              className="block italic text-[#efc89f]"
            >
              coffee,
            </span>

            <span data-title-line className="block">
              beautifully made.
            </span>
          </h1>

          <p
            data-description
            className="mt-6 max-w-[420px] text-[13px] leading-6 text-white/82 md:text-[15px]"
          >
            A slow ritual of aroma, texture and warmth. Carefully roasted beans
            and café-crafted drinks made to turn every pause into something
            memorable.
          </p>

          <div data-actions className="mt-7 flex flex-wrap gap-3">
            <a
              href="#coffee-story"
              className="rounded-full bg-[#ecd4b9] px-7 py-3.5 text-sm font-medium text-[#342016] shadow-[0_12px_35px_rgba(35,16,8,.18)] transition duration-300 hover:-translate-y-1 hover:bg-[#f7e4cf]"
            >
              Taste the menu
            </a>

            <a
              href="#coffee-story"
              className="rounded-full border border-white/40 bg-black/5 px-7 py-3.5 text-sm text-white/95 backdrop-blur-md transition duration-300 hover:bg-white/10"
            >
              Our story
            </a>
          </div>
        </div>
      </div>

      {/*
       * المج والظل داخل Stage واحد.
       * لذلك يظلان ثابتين معًا ولا ينفصل الظل عن المج.
       */}
      <div
        ref={cupStage}
        className="pointer-events-none absolute bottom-[-100px] left-1/2 z-20 h-[500vh] min-h-[6000px] max-h-[6000px] w-[6000px] -translate-x-1/2"
      >
        {/* ظل واسع ناعم على الترابيزة */}
        <div className="absolute bottom-[1.8%] left-1/2 h-10 w-[62%] -translate-x-1/2 rounded-[50%] bg-black/20 blur-2xl" />

        {/* Contact shadow أسفل قاعدة المج مباشرة */}
        <div className="absolute bottom-[4.2%] left-1/2 h-[18px] w-[38%] -translate-x-1/2 rounded-[50%] bg-black/55 blur-[8px]" />

        {/* انعكاس خفيف على سطح الترابيزة */}
        <div className="absolute bottom-[1%] left-1/2 h-16 w-[34%] -translate-x-1/2 rounded-[50%] bg-[#f2d2ad]/10 blur-xl" />

        <div className="relative h-full w-full">
          <Image
            src="/Cup.png"
            alt="Glass latte coffee"
            fill
            priority
            sizes="(max-width: 768px) 80vw, 40vw"
            className="origin-bottom scale-[1.56] translate-y-[12%] object-contain object-bottom drop-shadow-[0_24px_24px_rgba(35,15,7,.28)]"
          />
        </div>
      </div>

      {/* نقاط صغيرة مثل المرجع */}
      <div className="absolute bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-white" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/45" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/45" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/45" />
      </div>
    </section>
  );
}