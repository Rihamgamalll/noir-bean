"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const beanImages = [
  "/beans/bean-1.png",
  "/beans/bean-2.png",
  "/beans/bean-3.png",
  "/beans/bean-4.png",
  "/beans/bean-5.png",
  "/beans/bean-6.png",
];

const heroBeans = [
  { left: 6, top: 8, size: 78, driftX: 150, driftY: 130, rotation: 420 },
  { left: 17, top: 2, size: 70, driftX: 250, driftY: 190, rotation: -460 },
  { left: 30, top: 14, size: 88, driftX: -125, driftY: 165, rotation: 520 },
  { left: 43, top: 3, size: 74, driftX: 115, driftY: 230, rotation: -510 },
  { left: 59, top: 9, size: 84, driftX: -190, driftY: 180, rotation: 470 },
  { left: 75, top: 4, size: 72, driftX: 115, driftY: 210, rotation: -440 },
  { left: 89, top: 15, size: 90, driftX: -220, driftY: 170, rotation: 530 },
  { left: 10, top: 42, size: 80, driftX: 220, driftY: 135, rotation: -470 },
  { left: 85, top: 40, size: 84, driftX: -260, driftY: 155, rotation: 490 },
  { left: 23, top: 69, size: 76, driftX: 175, driftY: 110, rotation: -430 },
  { left: 69, top: 71, size: 86, driftX: -160, driftY: 125, rotation: 510 },
  { left: 50, top: 58, size: 72, driftX: 55, driftY: 170, rotation: -460 },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const background = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const cup = useRef<HTMLDivElement>(null);
  const cupGhost = useRef<HTMLDivElement>(null);
  const beanLayer = useRef<HTMLDivElement>(null);
  const beanRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const resetHero = () => {
      if (window.location.hash === "#home" || window.scrollY < 12) {
        // وقف أي Animation شغال على الكوباية
        gsap.killTweensOf(cup.current);
  
        // رجّع الكوباية لوضعها الأصلي
        gsap.set(cup.current, {
          clearProps: "transform",
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          opacity: 1,
        });
  
        // رجّع النص لوضعه الأصلي
        gsap.set(content.current, {
          clearProps: "transform",
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
        });
  
        // حدّث الـ ScrollTrigger بعد رجوع العناصر
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      }
    };
  
    // أول تحميل
    resetHero();
  
    // عند الرجوع للهوم
    window.addEventListener("hashchange", resetHero);
    window.addEventListener("pageshow", resetHero);
  
    return () => {
      window.removeEventListener("hashchange", resetHero);
      window.removeEventListener("pageshow", resetHero);
    };
  }, []);
  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const isMobile = window.matchMedia("(max-width: 767px)").matches;

      const beanElements = beanRefs.current.filter(
        (bean): bean is HTMLDivElement => Boolean(bean),
      );

      const compositorElements = [
        background.current,
        content.current,
        cup.current,
        cupGhost.current,
        beanLayer.current,
        ...beanElements,
      ].filter((element): element is HTMLDivElement => Boolean(element));

      gsap.set(compositorElements, {
        force3D: true,
        backfaceVisibility: "hidden",
      });

      if (reduceMotion) {
        gsap.set(beanElements, { opacity: 0.72 });
        return;
      }

      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      intro
        .from(background.current, {
          scale: isMobile ? 1.035 : 1.08,
          duration: isMobile ? 1.05 : 1.7,
        })
        .from(
          "[data-kicker]",
          { y: 20, opacity: 0, duration: 0.7 },
          0.25,
        )
        .from(
          "[data-title-line]",
          {
            y: 75,
            opacity: 0,
            filter: isMobile ? "blur(4px)" : "blur(12px)",
            stagger: isMobile ? 0.08 : 0.12,
            duration: isMobile ? 0.75 : 1,
          },
          0.4,
        )
        .from(
          "[data-description]",
          { y: 25, opacity: 0, duration: 0.8 },
          0.95,
        )
        .from(
          "[data-actions]",
          { y: 25, opacity: 0, duration: 0.8 },
          1.05,
        )
        .from(cup.current, {
          y: isMobile ? 90 : 200,
          scale: isMobile ? 0.72 : 0.88,
          opacity: 0,
          duration: isMobile ? 1.05 : 1.5,
        })
        .from(cupGhost.current, { opacity: 0, duration: 0.8 }, 1.2);

      /*
       * طبقة البن Fixed وليست داخل الهيرو، لذلك لا تختفي في الفراغ بين
       * Hero وCoffeeStory. الحركة تمتد حتى نهاية CoffeeStory.
       */
      gsap.set(beanElements, {
        opacity: 0,
        scale: 0.42,
        transformOrigin: "center center",
      });

      const beanTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          endTrigger: "#coffee-story",
          end: "bottom bottom",
          scrub: isMobile ? 0.32 : 0.16,
          refreshPriority: 30,
          invalidateOnRefresh: true,
        },
      });

      beanTimeline.to(
        beanLayer.current,
        { opacity: 1, duration: 0.08, ease: "none" },
        0,
      );

      beanElements.forEach((bean, index) => {
        const config = heroBeans[index];
        const direction = index % 2 === 0 ? 1 : -1;

        beanTimeline
          .to(
            bean,
            {
              opacity: 0.95,
              scale: 0.9 + (index % 3) * 0.13,
              x: config.driftX * 0.35,
              y: config.driftY * 0.42,
              rotation: config.rotation * 0.28,
              duration: 0.22,
              ease: "power2.out",
            },
            index * 0.008,
          )
          .to(
            bean,
            {
              x: config.driftX * direction,
              y: config.driftY + 180 + (index % 4) * 35,
              rotation: config.rotation,
              duration: 0.44,
              ease: "sine.inOut",
            },
            0.2 + index * 0.006,
          )
          .to(
            bean,
            {
              x: config.driftX * -0.45,
              y: config.driftY * 0.25 - 70,
              rotation: config.rotation * 1.45,
              duration: 0.28,
              ease: "sine.inOut",
            },
            0.64 + index * 0.004,
          )
          .to(
            bean,
            {
              opacity: 0,
              scale: 0.62,
              duration: 0.06,
              ease: "none",
            },
            0.94,
          );
      });

      const setCupY = cup.current
        ? gsap.quickSetter(cup.current, "y", "px")
        : null;

      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: isMobile ? "+=115%" : "+=145%",
        pin: true,
        pinSpacing: true,
        scrub: isMobile ? 0.32 : 0.16,
        anticipatePin: 1,
        refreshPriority: 30,
        invalidateOnRefresh: true,
      
        onUpdate: (self) => {
          setCupY?.(
            self.progress * window.innerHeight * (isMobile ? 0.56 : 0.72),
          );
        },
      
        onLeaveBack: () => {
          gsap.set(cup.current, {
            clearProps: "transform",
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
          });
        },
      });

      gsap.to(content.current, {
        y: isMobile ? -36 : -60,
        opacity: isMobile ? 0.28 : 0.15,
        filter: isMobile ? "blur(0px)" : "blur(3px)",
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=100%",
          scrub: isMobile ? 0.32 : 0.16,
          refreshPriority: 30,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: root },
  );

  return (
    <>
      {/*
       * هذه الطبقة خارج section الهيرو حتى تظل مرئية أثناء الانتقال
       * وفي المسافة البيضاء بين القسمين.
       */}
      <div
        ref={beanLayer}
        className="pointer-events-none fixed inset-0 z-[70] overflow-hidden opacity-0"
        aria-hidden
      >
        {heroBeans.map((bean, index) => (
          <div
            key={`hero-bean-${index}`}
            ref={(element) => {
              beanRefs.current[index] = element;
            }}
            className="absolute"
            style={{
              left: `${bean.left}%`,
              top: `${bean.top}%`,
              width: `${bean.size}px`,
              height: `${bean.size * 0.78}px`,
            }}
          >
            <Image
              src={beanImages[index % beanImages.length]}
              alt=""
              fill
              sizes="96px"
              className="object-contain drop-shadow-[0_9px_8px_rgba(35,16,8,.36)]"
            />
          </div>
        ))}
      </div>
  
      <section
        id="home"
        ref={root}
        className="relative min-h-[100svh] overflow-hidden bg-[#8b6047] text-white sm:min-h-[820px] md:h-[100svh] md:min-h-[680px]"
      >
        <div ref={background} className="absolute inset-0">
          <Image
            src="/Coffe.png"
            alt=""
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover object-[54%_center] sm:object-[56%_center] md:object-center"
          />
        </div>
  
        {/* طبقات إضاءة فاتحة بدون تعتيم أو blur قوي */}
        <div className="absolute inset-0 bg-white/[0.025] md:backdrop-blur-[0.25px]" />
  
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(28,14,9,.42)_0%,rgba(40,22,15,.20)_35%,rgba(255,255,255,.015)_68%,rgba(37,18,11,.025)_100%)]" />
  
        <div className="absolute left-1/2 top-[57%] h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f7dfc7]/10 blur-[110px]" />
  
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_62%,rgba(24,11,7,.10)_100%)]" />
  
        <div
          ref={content}
          className="
            relative
            z-30
            mx-auto
            flex
            min-h-[100svh]
            max-w-[1500px]
            items-start
            px-5
            pb-[330px]
            pt-28
  
            sm:px-7
            sm:pb-[400px]
  
            md:h-full
            md:items-center
            md:px-12
            md:pb-0
            md:pt-20
  
            lg:px-16
          "
        >
          <div className="max-w-[500px] lg:-translate-y-5">
            <p
              data-kicker
              className="mb-5 text-[9px] uppercase tracking-[0.4em] text-[#f2d5b7]"
            >
              Freshly brewed · crafted with care
            </p>
  
            <h1
              className="
                font-serif
                text-[clamp(2.5rem,12vw,4rem)]
                leading-[0.88]
                tracking-[-0.045em]
  
                sm:text-[clamp(3rem,8vw,4.6rem)]
                md:text-[clamp(3.4rem,5vw,5.7rem)]
              "
            >
              <span data-title-line className="block">
                Ceremonial
              </span>
  
              <span data-title-line className="block italic text-[#efc89f]">
                coffee,
              </span>
  
              <span data-title-line className="block">
                beautifully made.
              </span>
            </h1>
  
            <p
              data-description
              className="mt-6 max-w-[430px] text-[13px] leading-6 text-white/82 md:text-[15px]"
            >
              A slow ritual of aroma, texture and warmth. Carefully roasted beans
              and café-crafted drinks made to turn every pause into something
              memorable.
            </p>
  
            <div data-actions className="mt-7 flex flex-wrap gap-3">
              <a
                href="/menu"
                className="rounded-full bg-[#ecd4b9] px-7 py-3.5 text-sm font-medium text-[#342016] shadow-[0_12px_35px_rgba(35,16,8,.18)] transition duration-300 hover:-translate-y-1 hover:bg-[#f5e1ca]"
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
  
        <div
          ref={cupGhost}
          aria-hidden
          className="pointer-events-none absolute bottom-[6svh] left-1/2 z-10 h-[330px] w-[300px] -translate-x-1/2 opacity-[0.09] sm:bottom-[4vh] sm:h-[420px] sm:w-[380px] md:bottom-[5.5vh] md:h-[64vh] md:max-h-[640px] md:min-h-[480px] md:w-[520px]"
        >
          <Image
            src="/Cup.png"
            alt=""
            fill
            sizes="(max-width: 640px) 290px, (max-width: 768px) 360px, 500px"
            className="scale-[1.26] object-contain opacity-70 blur-[2px] grayscale-[20%]"
          />
        </div>
  
        <div
          ref={cup}
          className="
            absolute
            bottom-[-13svh]
            left-1/2
            z-20
            h-[330px]
            min-h-0
            w-[300px]
            -translate-x-1/2
  
            sm:bottom-[-8vh]
            sm:h-[420px]
            sm:w-[380px]
  
            md:bottom-[-9vh]
            md:h-[70vh]
            md:min-h-[560px]
            md:max-h-[760px]
            md:w-[620px]
  
            lg:bottom-[-10vh]
            lg:w-[670px]
  
            xl:w-[720px]
          "
        >
          <div className="absolute bottom-[7%] left-1/2 h-10 w-[52%] -translate-x-1/2 rounded-full bg-black/38 blur-2xl" />
  
          <Image
            src="/Cup.png"
            alt="Glass latte coffee"
            fill
            priority
            sizes="(max-width: 640px) 340px, (max-width: 768px) 400px, (max-width: 1200px) 620px, 720px"
            quality={75}
            className="
              object-contain
              scale-[1.06]
              drop-shadow-[0_18px_22px_rgba(30,12,4,.28)]
              md:drop-shadow-[0_28px_34px_rgba(30,12,4,.35)]
  
              sm:scale-[1.16]
  
              md:scale-[1.28]
  
              lg:scale-[1.33]
            "
          />
        </div>
      </section>
    </>
  );
  }