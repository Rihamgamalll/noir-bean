"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const beans = Array.from(
  { length: 6 },
  (_, index) => `/beans/bean-${index + 1}.png`,
);

const iceCubes = Array.from(
  { length: 6 },
  (_, index) => `/alchemy/ice-${index + 1}.png`,
);

const iceFinalPositions = [
  {
    x: -520,
    y: -245,
    scale: 1.5,
    rotation: -42,
    depth: "front",
  },
  {
    x: 505,
    y: -220,
    scale: 1.75,
    rotation: 35,
    depth: "front",
  },
  {
    x: -485,
    y: 230,
    scale: 1.35,
    rotation: 28,
    depth: "back",
  },
  {
    x: 500,
    y: 235,
    scale: 1.55,
    rotation: -38,
    depth: "back",
  },
  {
    x: -170,
    y: -375,
    scale: 1.25,
    rotation: 58,
    depth: "front",
  },
  {
    x: 210,
    y: -390,
    scale: 1.4,
    rotation: -55,
    depth: "back",
  },
 ];

const mobileIceFinalPositions = [
  { x: -132, y: -275, scale: 1.22, rotation: -34, depth: "front" },
  { x: 132, y: -250, scale: 1.32, rotation: 30, depth: "front" },
  { x: -138, y: 230, scale: 1.12, rotation: 24, depth: "back" },
  { x: 138, y: 245, scale: 1.2, rotation: -30, depth: "back" },
  { x: -48, y: -365, scale: 1.05, rotation: 48, depth: "front" },
  { x: 68, y: 330, scale: 1.08, rotation: -46, depth: "back" },
];

const beanFinalPositions = [
  { x: -410, y: -110, scale: 0.85, rotation: -220 },
  { x: 420, y: -125, scale: 0.95, rotation: 240 },
  { x: -360, y: 245, scale: 0.8, rotation: 190 },
  { x: 375, y: 255, scale: 0.9, rotation: -210 },
  { x: -95, y: -340, scale: 0.75, rotation: 170 },
  { x: 130, y: 335, scale: 0.82, rotation: -190 },
];

export default function CoffeeAlchemy() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const cupRef = useRef<HTMLDivElement | null>(null);
  const milkRef = useRef<HTMLDivElement | null>(null);
  const coffeeRef = useRef<HTMLDivElement | null>(null);

  const titleRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);

  const iceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const beanRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const cup = cupRef.current;
      const milk = milkRef.current;
      const coffee = coffeeRef.current;
      const title = titleRef.current;
      const glow = glowRef.current;
      const shadow = shadowRef.current;

      const isMobile = window.matchMedia("(max-width: 767px)").matches;

      const ice = iceRefs.current.filter(
        (element): element is HTMLDivElement => Boolean(element),
      );

      const beanElements = beanRefs.current.filter(
        (element): element is HTMLDivElement => Boolean(element),
      );

      const compositorElements = [
        cup,
        milk,
        coffee,
        title,
        glow,
        shadow,
        ...ice,
        ...beanElements,
      ].filter((element): element is HTMLDivElement => Boolean(element));

      gsap.set(compositorElements, {
        force3D: true,
        backfaceVisibility: "hidden",
        willChange: "transform, opacity",
      });

      gsap.set(cup, {
        y: 210,
        scale: 0.9,
        rotation: -3,
        opacity: 0.42,
        transformOrigin: "center bottom",
      });

      /*
       * الاتنين بيبدأوا قدام الكوباية.
       * بعد ما يعملوا نصف اللفة، بننقلهم خلفها.
       */
      gsap.set(milk, {
        x: -430,
        y: 130,
        scale: 0.68,
        rotation: -24,
        opacity: 0.38,
        zIndex: 70,
        transformOrigin: "center center",
      });

      gsap.set(coffee, {
        x: 430,
        y: 110,
        scale: 0.68,
        rotation: 25,
        opacity: 0.38,
        zIndex: 68,
        transformOrigin: "center center",
      });

      gsap.set(title, {
        y: 28,
        opacity: 0.45,
      });

      gsap.set(glow, {
        scale: 0.72,
        opacity: 0.48,
      });

      gsap.set(shadow, {
        scaleX: 0.62,
        opacity: 0.38,
      });

      gsap.set(ice, {
        x: 0,
        y: isMobile ? -360 : -500,
        scale: 0.35,
        rotation: 0,
        opacity: 0.12,
      });

      gsap.set(beanElements, {
        x: 0,
        y: 0,
        scale: 0.3,
        rotation: 0,
        opacity: 0.12,
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () =>
            `+=${
              isMobile
                ? Math.max(Math.round(window.innerHeight * 4.8), 3600)
                : 3000
            }`,
          scrub: isMobile ? 0.32 : 0.16,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          refreshPriority: 10,
          invalidateOnRefresh: true,
        },
      });

      /* ظهور الخلفية والكوباية */

      timeline
        .to(
          glow,
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          0,
        )
        .to(
          shadow,
          {
            scaleX: 1,
            opacity: 0.75,
            duration: 0.9,
            ease: "power2.out",
          },
          0.05,
        )
        .to(
          cup,
          {
            y: 0,
            scale: 1,
            rotation: 0,
            opacity: 1,
            duration: 1.15,
            ease: "power3.out",
          },
          0.05,
        )
        .to(
          title,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
          },
          0.3,
        );

      /*
       * اللبن يبدأ من اليسار.
       * يمر أمام الجزء السفلي.
       * يصعد ناحية اليمين.
       */

      timeline
        .to(
          milk,
          {
            x: -285,
            y: 110,
            scale: 0.82,
            rotation: -18,
            opacity: 1,
            duration: 0.65,
            ease: "power3.out",
          },
          0.45,
        )
        .to(
          milk,
          {
            x: 10,
            y: 165,
            scale: 1.1,
            rotation: 4,
            duration: 0.65,
            ease: "sine.inOut",
          },
          1.05,
        )
        .to(
          milk,
          {
            x: 340,
            y: 40,
            scale: 1.02,
            rotation: 25,
            duration: 0.65,
            ease: "sine.inOut",
          },
          1.65,
        );

      /*
       * القهوة تبدأ من اليمين.
       * تلف بالعكس أمام الكوباية.
       */

      timeline
        .to(
          coffee,
          {
            x: 300,
            y: 70,
            scale: 0.82,
            rotation: 20,
            opacity: 1,
            duration: 0.65,
            ease: "power3.out",
          },
          0.55,
        )
        .to(
          coffee,
          {
            x: -5,
            y: 135,
            scale: 1.08,
            rotation: -3,
            duration: 0.65,
            ease: "sine.inOut",
          },
          1.15,
        )
        .to(
          coffee,
          {
            x: -345,
            y: 10,
            scale: 1,
            rotation: -26,
            duration: 0.65,
            ease: "sine.inOut",
          },
          1.75,
        );

      /*
       * عند وصول الـSplashes للجوانب،
       * تتحول من أمام الكوباية إلى خلفها.
       */

      timeline
        .set(milk, { zIndex: 24 }, 2.28)
        .set(coffee, { zIndex: 22 }, 2.38);

      /*
       * استكمال الدوران خلف الكوباية.
       */

      timeline
        .to(
          milk,
          {
            x: 160,
            y: -185,
            scale: 0.88,
            rotation: 52,
            duration: 0.7,
            ease: "sine.inOut",
          },
          2.3,
        )
        .to(
          milk,
          {
            x: -125,
            y: -205,
            scale: 0.95,
            rotation: 82,
            duration: 0.72,
            ease: "sine.inOut",
          },
          2.95,
        )
        .to(
          milk,
          {
            x: -35,
            y: -20,
            scale: 1.02,
            rotation: 95,
            duration: 0.65,
            ease: "power2.out",
          },
          3.6,
        );

      timeline
        .to(
          coffee,
          {
            x: -170,
            y: -205,
            scale: 0.9,
            rotation: -55,
            duration: 0.7,
            ease: "sine.inOut",
          },
          2.4,
        )
        .to(
          coffee,
          {
            x: 125,
            y: -220,
            scale: 0.97,
            rotation: -82,
            duration: 0.72,
            ease: "sine.inOut",
          },
          3.05,
        )
        .to(
          coffee,
          {
            x: 35,
            y: 15,
            scale: 1.05,
            rotation: -96,
            duration: 0.65,
            ease: "power2.out",
          },
          3.7,
        );

      /*
       * مكعبات التلج ضخمة وتنزل بسرعات مختلفة.
       */

      ice.forEach((element, index) => {
        const target = (isMobile ? mobileIceFinalPositions : iceFinalPositions)[index];

        timeline
          .set(
            element,
            {
              zIndex: target.depth === "front" ? 82 : 26,
            },
            1.2 + index * 0.08,
          )
          .to(
            element,
            {
              x: target.x,
              y: target.y,
              scale: target.scale,
              rotation: target.rotation,
              opacity: 1,
              duration: 1.15 + index * 0.09,
              ease: "back.out(1.3)",
            },
            1.25 + index * 0.12,
          )
          .to(
            element,
            {
              x: `+=${index % 2 === 0 ? 35 : -38}`,
              y: `+=${index % 3 === 0 ? -28 : 32}`,
              rotation: `+=${index % 2 === 0 ? 42 : -45}`,
              duration: 1,
              ease: "sine.inOut",
            },
            3.45 + index * 0.025,
          );
      });

      /*
       * البن يملأ الفراغات بدون إضافة حبات جديدة.
       */

      beanElements.forEach((element, index) => {
        const target = beanFinalPositions[index];

        timeline
          .set(
            element,
            {
              zIndex: index % 2 === 0 ? 28 : 78,
            },
            1.45 + index * 0.06,
          )
          .to(
            element,
            {
              x: target.x,
              y: target.y,
              scale: target.scale,
              rotation: target.rotation,
              opacity: 1,
              duration: 0.9,
              ease: "power3.out",
            },
            1.5 + index * 0.1,
          )
          .to(
            element,
            {
              x: `+=${index % 2 === 0 ? 24 : -22}`,
              y: `+=${index % 3 === 0 ? -20 : 18}`,
              rotation: `+=${index % 2 === 0 ? 110 : -110}`,
              duration: 1,
              ease: "sine.inOut",
            },
            3.55,
          );
      });

      /*
       * حركة بسيطة للكوباية بعد اكتمال المشهد.
       */

      timeline
        .to(
          cup,
          {
            y: -24,
            scale: 1.035,
            rotation: 1,
            duration: 0.8,
            ease: "sine.inOut",
          },
          3.65,
        )
        .to(
          shadow,
          {
            scaleX: 0.9,
            opacity: 0.5,
            duration: 0.8,
            ease: "sine.inOut",
          },
          3.65,
        );

      /*
       * خروج المشهد للانتقال إلى المنيو.
       */

      timeline
        .to(
          title,
          {
            y: -80,
            opacity: 0,
            duration: 0.55,
            ease: "power2.in",
          },
          4.55,
        )
        .to(
          milk,
          {
            scale: 1.35,
            opacity: 0,
            duration: 0.65,
            ease: "power2.in",
          },
          4.58,
        )
        .to(
          coffee,
          {
            scale: 1.35,
            opacity: 0,
            duration: 0.65,
            ease: "power2.in",
          },
          4.58,
        )
        .to(
          cup,
          {
            y: -180,
            scale: 0.75,
            opacity: 0,
            duration: 0.8,
            ease: "power3.in",
          },
          4.65,
        );

      ice.forEach((element, index) => {
        timeline.to(
          element,
          {
            x: `+=${index % 2 === 0 ? -350 : 350}`,
            y: `+=${index % 3 === 0 ? 300 : -280}`,
            scale: 0.4,
            opacity: 0,
            rotation: `+=${index % 2 === 0 ? -190 : 190}`,
            duration: 0.7,
            ease: "power2.in",
          },
          4.6 + index * 0.025,
        );
      });

      beanElements.forEach((element, index) => {
        timeline.to(
          element,
          {
            x: `+=${index % 2 === 0 ? -260 : 260}`,
            y: `+=${index % 3 === 0 ? -180 : 180}`,
            opacity: 0,
            scale: 0.25,
            duration: 0.65,
            ease: "power2.in",
          },
          4.65 + index * 0.02,
        );
      });
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section
      id="alchemy"
      ref={sectionRef}
      className="relative h-screen min-h-[720px] overflow-hidden bg-[#a86f49] text-white"
    >
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/bean-cafe.png')" }} />
      <div className="absolute inset-0 bg-[#5b2e1d]/42" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(236,201,164,.36)_0%,rgba(90,44,26,.26)_42%,rgba(35,15,8,.66)_100%)]" />

      <div className="absolute inset-0 opacity-[.14] [background-image:radial-gradient(rgba(255,255,255,.5)_0.7px,transparent_0.7px)] [background-size:7px_7px]" />

      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-b from-transparent to-[#30160c]/40" />

      <div
        ref={glowRef}
        className="pointer-events-none absolute left-1/2 top-[48%] h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffe7c8]/35 blur-[115px]"
      />

      <div
        ref={titleRef}
        className="absolute left-[5%] top-[12%] z-[90] max-w-[350px] md:left-[7%] md:top-[20%]"
      >
        <p className="text-[9px] uppercase tracking-[.44em] text-[#ffe0bd]">
          Milk · espresso · motion
        </p>

        <h2 className="mt-4 font-serif text-[clamp(3.4rem,6.5vw,7.2rem)] leading-[.84] tracking-[-.05em]">
          Liquid
          <br />
          alchemy.
        </h2>

        <p className="mt-6 max-w-[310px] text-[13px] leading-6 text-white/70">
          Espresso and milk orbit the cup before folding behind it in one
          continuous movement.
        </p>
      </div>

      {/* Milk splash */}

      <div
        ref={milkRef}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[920px] w-[1380px] max-w-[125vw] -translate-x-1/2 -translate-y-1/2"
      >
        <Image
          src="/alchemy/milk-splash.png"
          alt=""
          fill
          priority
          sizes="1380px"
          className="object-contain drop-shadow-[0_35px_38px_rgba(54,26,12,.25)]"
        />
      </div>

      {/* Coffee splash */}

      <div
        ref={coffeeRef}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[900px] w-[1360px] max-w-[124vw] -translate-x-1/2 -translate-y-1/2"
      >
        <Image
          src="/alchemy/coffee-splash.png"
          alt=""
          fill
          priority
          sizes="1360px"
          className="object-contain drop-shadow-[0_35px_42px_rgba(38,15,5,.45)]"
        />
      </div>

      {/* Ice cubes */}

      <div className="pointer-events-none absolute left-1/2 top-1/2 z-[30]">
        {iceCubes.map((src, index) => (
          <div
            key={src}
            ref={(element) => {
              iceRefs.current[index] = element;
            }}
            className="
              absolute
              h-[205px]
              w-[205px]
              -translate-x-1/2
              -translate-y-1/2
              md:h-[220px]
              md:w-[220px]
              xl:h-[260px]
              xl:w-[260px]
            "
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="260px"
              className="object-contain drop-shadow-[0_35px_35px_rgba(39,20,12,.3)]"
            />
          </div>
        ))}
      </div>

      {/* Beans */}

      <div className="pointer-events-none absolute left-1/2 top-1/2 z-[35]">
        {beans.map((src, index) => (
          <div
            key={src}
            ref={(element) => {
              beanRefs.current[index] = element;
            }}
            className="absolute h-[62px] w-[50px] -translate-x-1/2 -translate-y-1/2 md:h-[82px] md:w-[66px]"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="82px"
              className="object-contain drop-shadow-[0_15px_13px_rgba(35,15,6,.5)]"
            />
          </div>
        ))}
      </div>

      {/* Cup shadow */}

      <div
        ref={shadowRef}
        className="pointer-events-none absolute bottom-[6%] left-1/2 z-[40] h-[58px] w-[470px] -translate-x-1/2 rounded-full bg-[#281107]/45 blur-2xl"
      />

      {/* Cup */}

      <div
        ref={cupRef}
        className="
         pointer-events-none
         absolute
         bottom-[-3%]
         left-1/2
         z-[50]
         h-[110vh]
         w-[980px]
         max-w-none
        -translate-x-1/2
         xl:w-[1100px]
       "
      >
        <Image
          src="/Cup.png"
          alt="NØIR BEAN coffee"
          fill
          priority
          sizes="760px"
          className="object-contain object-bottom drop-shadow-[0_45px_50px_rgba(38,16,7,.42)]"
        />
      </div>

      <div className="absolute bottom-7 left-1/2 z-[100] -translate-x-1/2 whitespace-nowrap text-[8px] uppercase tracking-[.42em] text-white/50">
        Scroll through the transformation
      </div>
    </section>
  );
}
