'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const chapters = [
  {
    eyebrow: '01 · Origin',
    title: 'Coffee begins long before the cup.',
    body: 'Altitude, soil and patient hands shape every note. We select small lots for natural sweetness, clarity and a soft, lingering finish.',
    image: '/story-1.jpg',
  },
  {
    eyebrow: '02 · Roast',
    title: 'Roasted slowly, never rushed.',
    body: 'A precise roast profile develops caramel depth while preserving the character of each bean. Warm, balanced and quietly complex.',
    image: '/story-3.jpg',
  },
  {
    eyebrow: '03 · Ritual',
    title: 'Made to connect people.',
    body: 'Steam, glass, texture and aroma come together in a small everyday ceremony — one that feels as beautiful as it tastes.',
    image: '/story-4.jpg',
  },
];

export default function ScrollExperience() {
  const root = useRef<HTMLElement>(null);
  const cup = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 900px)', () => {
        const panels =
          gsap.utils.toArray<HTMLElement>('[data-chapter]');

        const storyImage =
          root.current?.querySelector<HTMLElement>('[data-story-image]');

        const stageDots =
          root.current?.querySelector<HTMLElement>('[data-stage-dots]');

        gsap.set(panels[0], {
          opacity: 1,
          y: 0,
          x: 0,
          rotation: 0,
        });

        gsap.set(panels.slice(1), {
          opacity: 0,
          y: 50,
          x: 0,
          rotation: 0,
        });

        gsap.set(cup.current, {
          xPercent: 0,
          y: 0,
          rotation: 0,
          scale: 0.95,
          opacity: 1,
        });

        if (storyImage) gsap.set(storyImage, {
          xPercent: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          opacity: 1,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=3400',
            scrub: 1,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        panels.forEach((panel, i) => {
          if (i > 0) {
            tl.to(panels[i - 1], {
              opacity: 0,
              y: -45,
              duration: 0.45,
              ease: 'power2.inOut',
            }).to(
              panel,
              {
                opacity: 1,
                y: 0,
                duration: 0.45,
                ease: 'power2.out',
              },
              '<0.12',
            );
          }

          tl.to(
            cup.current,
            {
              xPercent: i === 1 ? -20 : i === 2 ? 14 : 0,
              rotation: i === 1 ? -3 : i === 2 ? 3 : 0,
              scale: i === 2 ? 1.08 : 0.95,
              duration: 0.8,
              ease: 'power2.inOut',
            },
            '<',
          );

          tl.to(
            '[data-stage-bg]',
            {
              backgroundColor:
                i === 2
                  ? '#d9b48e'
                  : i === 1
                    ? '#7f5034'
                    : '#b7845c',
              duration: 0.8,
              ease: 'none',
            },
            '<',
          );
        });

        /*
         * Cinematic exit:
         * الصورة ثم النص ثم الكوباية.
         */

        if (storyImage) tl.to(storyImage, {
          xPercent: 135,
          y: -20,
          rotation: 12,
          scale: 0.92,
          opacity: 0,
          duration: 0.65,
          ease: 'power3.inOut',
        });

        tl.to(
          panels[panels.length - 1],
          {
            xPercent: -135,
            y: -15,
            rotation: -9,
            opacity: 0,
            duration: 0.65,
            ease: 'power3.inOut',
          },
          '-=0.35',
        );

        tl.to(
          cup.current,
          {
            xPercent: 0,
            y: 360,
            rotation: 18,
            scale: 0.72,
            opacity: 0,
            duration: 0.75,
            ease: 'power3.inOut',
          },
          '-=0.3',
        );

        if (stageDots) tl.to(
          stageDots,
          {
            opacity: 0,
            scale: 1.08,
            duration: 0.4,
            ease: 'power2.inOut',
          },
          '-=0.45',
        );

        /*
         * الخلفية تتحول لنفس لون القسم التالي،
         * ولذلك لن تظهر أي مساحة بيضاء بين القسمين.
         */

        tl.to(
          '[data-stage-bg]',
          {
            backgroundColor: '#d9b48e',
            duration: 0.4,
            ease: 'none',
          },
          '<',
        );
      });

      gsap.utils
        .toArray<HTMLElement>('[data-reveal]')
        .forEach((el) => {
          gsap.from(el, {
            y: 70,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
            },
          });
        });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      id="coffee"
      ref={root}
      className="relative bg-[#b7845c] text-[#2a160e]"
    >
      <div
        data-stage-bg
        className="absolute inset-0 bg-[#b7845c]"
      />

      <div
        data-stage-dots
        className="absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:28px_28px]"
      />

      <div className="relative mx-auto hidden min-h-screen max-w-[1450px] grid-cols-[1fr_.8fr_1fr] items-center gap-8 px-12 lg:grid">
        <div className="relative h-[580px]">
          {chapters.map((chapter) => (
            <article
              key={chapter.title}
              data-chapter
              className="absolute inset-0 flex flex-col justify-center"
            >
              <p className="text-[10px] uppercase tracking-[.4em] text-[#5c3624]">
                {chapter.eyebrow}
              </p>

              <h2 className="mt-5 font-serif text-[clamp(3.2rem,5vw,5.6rem)] leading-[.92] tracking-[-.045em]">
                {chapter.title}
              </h2>

              <p className="mt-6 max-w-md text-base leading-7 text-[#3f281d]/75">
                {chapter.body}
              </p>
            </article>
          ))}
        </div>

        <div className="relative flex h-[720px] items-center justify-center">
          <div className="absolute h-[520px] w-[520px] rounded-full border border-[#4b2b1c]/15" />

          <div
            ref={cup}
            className="relative h-[610px] w-[450px] mix-blend-multiply"
          >
            <Image
              src="/coffee-cup.png"
              alt="Coffee cup"
              fill
              sizes="33vw"
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div
          data-story-image
          className="relative h-[560px] overflow-hidden rounded-[2.4rem] border border-white/30 shadow-2xl"
        >
          <Image
            src="/story-4.jpg"
            alt="Coffee experience"
            fill
            sizes="32vw"
            className="scale-110 object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#4c2918]/45 to-transparent" />

          <span className="absolute bottom-6 left-6 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-[10px] uppercase tracking-[.3em] text-white backdrop-blur">
            Scroll story
          </span>
        </div>
      </div>

      <div className="relative space-y-6 px-5 py-20 lg:hidden">
        {chapters.map((chapter) => (
          <article
            data-reveal
            key={chapter.title}
            className="rounded-[2rem] bg-[#ead6be] p-6 shadow-xl"
          >
            <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-[1.5rem]">
              <Image
                src={chapter.image}
                alt="Coffee scene"
                fill
                sizes="90vw"
                className="object-cover"
              />
            </div>

            <p className="text-[9px] uppercase tracking-[.35em] text-[#7b4b32]">
              {chapter.eyebrow}
            </p>

            <h2 className="mt-3 font-serif text-4xl leading-none">
              {chapter.title}
            </h2>

            <p className="mt-4 text-sm leading-6 text-black/65">
              {chapter.body}
            </p>
          </article>
        ))}
      </div>

      <Transformation />
    </section>
  );
}

function Transformation() {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 900px)', () => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section.current,
            start: 'top bottom',
            end: 'top 25%',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .from('[data-splash]', {
            scale: 0.2,
            opacity: 0,
            rotation: -18,
            duration: 0.8,
            ease: 'power3.out',
          })
          .from(
            '[data-transform-copy]',
            {
              x: -100,
              opacity: 0,
              duration: 0.7,
              ease: 'power3.out',
            },
            '<0.1',
          )
          .from(
            '[data-transform-cup]',
            {
              scale: 0.65,
              rotation: -7,
              y: 150,
              opacity: 0,
              duration: 0.9,
              ease: 'power3.out',
            },
            '<',
          )
          .from(
            '[data-ice]',
            {
              y: -180,
              rotation: -80,
              opacity: 0,
              stagger: 0.08,
              duration: 0.7,
              ease: 'power2.out',
            },
            '<0.1',
          );
      });

      mm.add('(max-width: 899px)', () => {
        gsap.from('[data-transform-copy]', {
          y: 70,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section.current,
            start: 'top 80%',
          },
        });

        gsap.from('[data-transform-cup]', {
          y: 100,
          scale: 0.85,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '[data-transform-cup]',
            start: 'top 85%',
          },
        });
      });

      return () => mm.revert();
    },
    { scope: section },
  );

  const icePositions = [
    ['12%', '24%'],
    ['80%', '18%'],
    ['17%', '74%'],
    ['84%', '70%'],
    ['65%', '12%'],
  ];

  return (
    <section
      ref={section}
      className="relative min-h-[110vh] overflow-hidden bg-[#d9b48e] px-6 py-24 text-[#2c180f] lg:px-12"
    >
      <div
        data-splash
        className="absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-[45%_55%_58%_42%/55%_40%_60%_45%] bg-[#f4e1cb]/55 blur-[1px]"
      />

      {icePositions.map(([left, top], index) => (
        <div
          data-ice
          key={index}
          style={{ left, top }}
          className="absolute h-16 w-16 rotate-12 rounded-2xl border border-white/65 bg-white/25 shadow-[inset_0_0_18px_rgba(255,255,255,.7),0_20px_30px_rgba(69,36,20,.15)] backdrop-blur-sm"
        />
      ))}

      <div className="relative z-10 mx-auto grid min-h-[90vh] max-w-[1350px] items-center gap-10 lg:grid-cols-2">
        <div data-transform-copy>
          <p className="text-[10px] uppercase tracking-[.4em] text-[#70452e]">
            From warm ritual to cold obsession
          </p>

          <h2 className="mt-5 max-w-xl font-serif text-[clamp(4rem,7vw,7.8rem)] leading-[.84] tracking-[-.055em]">
            Luxuriously{' '}
            <em className="text-[#8b5436]">refreshing.</em>
          </h2>

          <p className="mt-7 max-w-md text-base leading-7 text-black/60">
            Velvety espresso, cold milk and crystalline ice — layered into
            a drink that feels light, dramatic and completely
            irresistible.
          </p>

          <a
            href="#contact"
            className="mt-8 inline-block rounded-full bg-[#3a2117] px-7 py-3.5 text-sm text-white transition hover:scale-105"
          >
            Explore iced coffee
          </a>
        </div>

        <div
          data-transform-cup
          className="relative mx-auto h-[650px] w-[500px] max-w-full"
        >
          <div className="absolute bottom-[12%] left-1/2 h-20 w-[70%] -translate-x-1/2 rounded-full bg-[#5e3b28]/20 blur-2xl" />

          <Image
            src="/coffee-cup.png"
            alt="Iced latte presentation"
            fill
            sizes="(max-width: 900px) 90vw, 45vw"
            className="object-contain drop-shadow-[0_45px_60px_rgba(78,43,25,.25)]"
          />
        </div>
      </div>
    </section>
  );
}