"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ClosingScene() {
  const section = useRef<HTMLElement | null>(null);
  const cup = useRef<HTMLDivElement | null>(null);
  const copy = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        copy.current,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section.current,
            start: "top 72%",
          },
        },
      );

      gsap.fromTo(
        cup.current,
        { y: 120, opacity: 0, scale: 0.82 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section.current,
            start: "top 68%",
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={section}
      className="relative min-h-[88vh] overflow-hidden bg-[#2a160f] text-[#f9ecdc]"
    >
      <div className="absolute inset-0">
        <picture className="block h-full w-full">
          <source
            media="(max-width: 767px)"
            srcSet="/Bean cafe mobile.png"
          />
          <img
            src="/bean-cafe.png"
            alt=""
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover object-center"
          />
        </picture>
      </div>

      <div className="absolute inset-0 bg-[#1e0e08]/72" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_44%,rgba(196,137,91,.32),transparent_34%),linear-gradient(90deg,rgba(19,8,4,.88),rgba(31,13,7,.38))]" />
      <div className="absolute inset-0 opacity-[0.14] [background-image:radial-gradient(rgba(255,255,255,.55)_0.6px,transparent_0.6px)] [background-size:6px_6px]" />

      <div className="relative mx-auto grid min-h-[88vh] max-w-[1450px] items-center gap-12 px-7 py-20 md:grid-cols-2 md:px-12 lg:px-16">
        <div ref={copy} className="z-10 max-w-[620px]">
          <p className="text-[9px] uppercase tracking-[.44em] text-[#c9946e]">
            One last pour
          </p>

          <h2 className="mt-7 font-serif text-[clamp(3.4rem,7vw,7.4rem)] leading-[.86] tracking-[-.045em]">
            Every cup
            <br />
            has a story.
          </h2>

          <p className="mt-8 max-w-[430px] text-sm leading-7 text-white/58">
            Choose the one that feels like yours, then make it part of the
            ritual.
          </p>

          <a
            href="#menu"
            className="mt-9 inline-flex rounded-full border border-white/24 bg-white/8 px-7 py-3.5 text-xs uppercase tracking-[.18em] transition duration-300 hover:-translate-y-1 hover:bg-white/15"
          >
            Explore the menu
          </a>
        </div>

        <div
          ref={cup}
          className="pointer-events-none relative mx-auto h-[360px] w-full max-w-[560px] sm:h-[440px] md:h-[540px]"
        >
          <div className="absolute bottom-[9%] left-1/2 h-10 w-[55%] -translate-x-1/2 rounded-full bg-black/35 blur-2xl" />

          <Image
            src="/Cup.png"
            alt="NØIR BEAN coffee"
            fill
            sizes="560px"
            className="object-contain object-bottom drop-shadow-[0_35px_34px_rgba(0,0,0,.35)]"
          />
        </div>
      </div>
    </section>
  );
}
