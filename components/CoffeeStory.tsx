"use client";

import Image from "next/image";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const beanImages = [
  "/beans/bean-1.png",
  "/beans/bean-2.png",
  "/beans/bean-3.png",
  "/beans/bean-4.png",
  "/beans/bean-5.png",
  "/beans/bean-6.png",
];

const beans = [
  { x: 130, y: -210, rotation: 145, scale: 0.72, blur: 0, depth: "back" },
  { x: 215, y: -145, rotation: -165, scale: 0.9, blur: 0, depth: "front" },
  { x: 300, y: -255, rotation: 240, scale: 0.78, blur: 0.3, depth: "back" },
  { x: 385, y: -165, rotation: -220, scale: 1, blur: 0, depth: "front" },
  { x: 470, y: -275, rotation: 190, scale: 0.7, blur: 0.5, depth: "back" },
  { x: 560, y: -145, rotation: -145, scale: 0.88, blur: 0, depth: "front" },
  { x: 650, y: -225, rotation: 275, scale: 0.76, blur: 0, depth: "back" },
  { x: 735, y: -105, rotation: -245, scale: 0.95, blur: 0, depth: "front" },
  { x: 810, y: -195, rotation: 215, scale: 0.68, blur: 0.6, depth: "back" },
  { x: 890, y: -85, rotation: -175, scale: 0.86, blur: 0, depth: "front" },
  { x: 500, y: 5, rotation: 235, scale: 0.64, blur: 0, depth: "back" },
  { x: 670, y: 25, rotation: -200, scale: 0.74, blur: 0, depth: "front" },
  { x: 350, y: 50, rotation: 160, scale: 0.6, blur: 0.4, depth: "back" },
  { x: 790, y: 75, rotation: -265, scale: 0.82, blur: 0, depth: "front" },
];

const storyItems = [
  {
    type: "image",
    label: "Coffee cup",
    image: "/story-1.jpg",
    title: "The first sip",
    body: "A warm cup surrounded by roasted beans — the simplest beginning to a beautiful coffee ritual.",
  },
  {
    type: "text",
    label: "The ritual",
    title: "Slow mornings begin with coffee.",
    body: "A quiet pause, a warm cup and an aroma that makes the day feel softer. Coffee is not only a drink; it is a small daily ritual that gives the moment its own rhythm.",
  },
  {
    type: "image",
    label: "Coffee preparation",
    image: "/story-2.jpg",
    title: "Craft in every detail",
    body: "Steam, texture and careful preparation come together behind every cup.",
  },
  {
    type: "text",
    label: "The roast",
    title: "Roasted with care, brewed with soul.",
    body: "Every batch is treated gently to reveal sweetness, balance and depth. The roast is adjusted to preserve the character of the bean rather than hide it.",
  },
  {
    type: "text",
    label: "The bean",
    title: "Every bean holds a little story.",
    body: "From its origin to your cup, each bean carries its own character, shaped by the land, the harvest, the roast and the hands that prepare it.",
  },
  {
    type: "image",
    label: "Coffee atmosphere",
    image: "/story-3.jpg",
    title: "A place to slow down",
    body: "Soft light and a freshly prepared cup turn an ordinary pause into a memory.",
  },
  {
    type: "text",
    label: "The moment",
    title: "Warm, rich and beautifully made.",
    body: "Created for the moments you want to slow down and enjoy properly — with balanced flavour, comforting warmth and a finish that stays with you.",
  },
  {
    type: "image",
    label: "Coffee culture",
    image: "/story-4.jpg",
    title: "Coffee becomes a language",
    body: "A visual world of stories, humour and shared moments built around the cup.",
  },
] as const;

type StoryItem = (typeof storyItems)[number];


const transitionBeans = [
  { left: 8, top: 18, size: 76, x: 120, y: 130, rotation: 220 },
  { left: 20, top: 38, size: 66, x: 190, y: 90, rotation: -180 },
  { left: 34, top: 14, size: 82, x: 80, y: 170, rotation: 260 },
  { left: 48, top: 34, size: 70, x: -40, y: 120, rotation: -230 },
  { left: 62, top: 12, size: 78, x: -100, y: 160, rotation: 210 },
  { left: 76, top: 36, size: 68, x: -170, y: 100, rotation: -190 },
  { left: 90, top: 17, size: 84, x: -130, y: 150, rotation: 245 },
  { left: 55, top: 63, size: 64, x: -30, y: 80, rotation: -210 },
];

export default function CoffeeStory() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cupRef = useRef<HTMLDivElement | null>(null);
  const sackRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const beanRefs = useRef<(HTMLDivElement | null)[]>([]);
  const transitionBeanRefs = useRef<(HTMLDivElement | null)[]>([]);
  const storyCardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const modalBackdropRef = useRef<HTMLDivElement | null>(null);
  const modalPanelRef = useRef<HTMLDivElement | null>(null);
  const modalContentRef = useRef<HTMLDivElement | null>(null);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeItem: StoryItem | null =
    activeIndex === null ? null : storyItems[activeIndex];

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const cup = cupRef.current;
      const sack = sackRef.current;
      const content = contentRef.current;

      const beanElements = beanRefs.current.filter(
        (bean): bean is HTMLDivElement => Boolean(bean),
      );

      const transitionBeanElements = transitionBeanRefs.current.filter(
        (bean): bean is HTMLDivElement => Boolean(bean),
      );

      const storyCardElements = storyCardRefs.current.filter(
        (card): card is HTMLButtonElement => Boolean(card),
      );

      const compositorElements = [
        cup,
        sack,
        content,
        ...beanElements,
        ...transitionBeanElements,
        ...storyCardElements,
      ].filter((element): element is HTMLDivElement => Boolean(element));

      gsap.set(compositorElements, {
        force3D: true,
        backfaceVisibility: "hidden",
      });

      gsap.set(cup, {
        y: -520,
        scale: 0.8,
        opacity: 0,
        transformOrigin: "center bottom",
      });

      gsap.set(sack, {
        x: -260,
        y: 60,
        rotation: -18,
        opacity: 0,
        transformOrigin: "left bottom",
      });

      gsap.set(content, {
        y: 100,
        opacity: 0,
      });

      gsap.set(beanElements, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 0.15,
        opacity: 0,
        transformOrigin: "center center",
      });

      // حبات انتقالية تظهر في المساحة بين الهيرو وبداية ظهور المج
      gsap.set(transitionBeanElements, {
        opacity: 0,
        scale: 0.45,
        rotation: 0,
        transformOrigin: "center center",
      });

      const isMobile = window.matchMedia("(max-width: 767px)").matches;

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () =>
            `+=${
              isMobile
                ? Math.max(Math.round(window.innerHeight * 4.15), 3000)
                : 2350
            }`,
          scrub: isMobile ? 0.32 : 0.18,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          refreshPriority: 20,
          invalidateOnRefresh: true,
        },
      });

      // تظهر في المساحة الفارغة أولًا، ثم تختفي قبل اكتمال ظهور المج.
      transitionBeanElements.forEach((element, index) => {
        const bean = transitionBeans[index];

        timeline
          .to(
            element,
            {
              opacity: 0.95,
              scale: 0.9 + (index % 3) * 0.12,
              x: bean.x * 0.35,
              y: bean.y * 0.25,
              rotation: bean.rotation * 0.35,
              duration: 0.18,
              ease: "power2.out",
            },
            index * 0.018,
          )
          .to(
            element,
            {
              x: bean.x,
              y: bean.y,
              rotation: bean.rotation,
              duration: 0.36,
              ease: "sine.inOut",
            },
            0.12 + index * 0.012,
          )
          .to(
            element,
            {
              opacity: 0,
              scale: 0.55,
              y: `+=${70 + (index % 3) * 18}`,
              duration: 0.22,
              ease: "power2.in",
            },
            0.46 + index * 0.006,
          );
      });

      timeline.to(
        cup,
        {
          y: 0,
          scale: 1.04,
          opacity: 1,
          duration: 1.45,
          ease: "power2.out",
        },
        0.42,
      );

      beans.slice(0, 5).forEach((bean, index) => {
        const element = beanElements[index];
        if (!element) return;

        timeline.to(
          element,
          {
            x: bean.x * 0.45,
            y: bean.y * 0.45,
            rotation: bean.rotation * 0.4,
            scale: bean.scale * 0.72,
            opacity: 0.88,
            filter: `blur(${bean.blur}px)`,
            duration: 0.8,
            ease: "power2.out",
          },
          0.4 + index * 0.06,
        );
      });

      timeline.to(
        content,
        {
          y: 0,
          opacity: 1,
          duration: 1.15,
          ease: "power2.out",
        },
        0.72,
      );

      timeline.to(
        sack,
        {
          x: 0,
          y: 0,
          rotation: -5,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        },
        0.82,
      );

      timeline.to(
        sack,
        {
          rotation: 2,
          y: -10,
          duration: 0.28,
          yoyo: true,
          repeat: 1,
          ease: "sine.inOut",
        },
        1.42,
      );

      beans.forEach((bean, index) => {
        const element = beanElements[index];
        if (!element) return;

        timeline.to(
          element,
          {
            x: bean.x,
            y: bean.y,
            rotation: bean.rotation,
            scale: bean.scale,
            opacity: 1,
            filter: `blur(${bean.blur}px)`,
            duration: 1.15,
            ease: "power3.out",
          },
          1.48 + index * 0.055,
        );
      });

      beanElements.forEach((element, index) => {
        timeline.to(
          element,
          {
            x: `+=${index % 2 === 0 ? 24 : -20}`,
            y: `+=${index % 3 === 0 ? -18 : 14}`,
            rotation: `+=${index % 2 === 0 ? 65 : -60}`,
            duration: 0.75,
            ease: "sine.inOut",
          },
          2.55,
        );
      });

      timeline.to(
        cup,
        {
          y: -22,
          scale: 1,
          duration: 0.85,
          ease: "power2.inOut",
        },
        2.8,
      );

      beanElements.forEach((element, index) => {
        const finalX = 120 + index * 68;
        const finalY = 215 + (index % 4) * 11;

        timeline.to(
          element,
          {
            x: finalX,
            y: finalY,
            rotation: `+=${130 + index * 21}`,
            scale: 0.55 + (index % 3) * 0.08,
            filter: "blur(0px)",
            duration: 0.95,
            ease: "power2.in",
          },
          3.3 + index * 0.026,
        );

        timeline.to(
          element,
          {
            y: `-=${index % 2 === 0 ? 8 : 5}`,
            duration: 0.14,
            yoyo: true,
            repeat: 1,
            ease: "power1.out",
          },
          4.18 + index * 0.026,
        );
      });

      timeline.to(
        cup,
        {
          y: -35,
          scale: 0.97,
          duration: 0.8,
          ease: "power2.inOut",
        },
        4.05,
      );


      /*
       * الانتقال إلى CoffeeAlchemy:
       * الكروت تتنطر بالتبادل يمين وشمال،
       * الشوال يخرج شمال،
       * المج يخرج يمين وفوق،
       * وحبات البن تتفرق في الاتجاهين.
       */
      /*
       * الخروج السينمائي:
       * كل كارت يأخذ دفعة صغيرة ثم يطير خارج الشاشة وهو واضح بالكامل.
       * لا يوجد Fade أثناء الطيران؛ العنصر يظل opacity: 1 حتى يخرج من الإطار.
       */
      storyCardElements.forEach((card, index) => {
        const direction = index % 2 === 0 ? -1 : 1;
        const launchTime = 5.02 + index * 0.1;

        timeline
          .to(
            card,
            {
              scale: 1.1,
              y: index < 4 ? -10 : 10,
              rotation: direction * 3,
              opacity: 1,
              filter: "blur(0px)",
              duration: 0.12,
              ease: "power2.out",
            },
            launchTime,
          )
          .to(
            card,
            {
              x: `${direction * (140 + index * 9)}vw`,
              y: index < 4 ? -220 - index * 22 : 220 + index * 18,
              rotation: direction * (34 + index * 8),
              scale: 1.08,
              opacity: 1,
              filter: "blur(0px)",
              duration: 0.8,
              ease: "expo.inOut",
            },
            launchTime + 0.1,
          );
      });

      /* الشوال يخرج شمال وهو ظاهر ويدور بوضوح. */
      timeline
        .to(
          sack,
          {
            scale: 1.08,
            rotation: -12,
            opacity: 1,
            duration: 0.14,
            ease: "power2.out",
          },
          5.14,
        )
        .to(
          sack,
          {
            x: "-145vw",
            y: 150,
            rotation: -72,
            scale: 1.12,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.95,
            ease: "expo.inOut",
          },
          5.24,
        );

      /* حبات البن تتفرق بالتبادل وهي محتفظة بلونها ووضوحها. */
      beanElements.forEach((element, index) => {
        const direction = index % 2 === 0 ? -1 : 1;
        const launchTime = 5.12 + index * 0.035;

        timeline
          .to(
            element,
            {
              scale: 1.08 + (index % 3) * 0.08,
              opacity: 1,
              filter: "blur(0px)",
              duration: 0.1,
              ease: "power2.out",
            },
            launchTime,
          )
          .to(
            element,
            {
              x: `+=${direction * (window.innerWidth * 0.92 + index * 42)}`,
              y: `+=${index % 3 === 0 ? -330 : 270 + index * 12}`,
              rotation: `+=${direction * (520 + index * 42)}`,
              scale: 0.92 + (index % 3) * 0.1,
              opacity: 1,
              filter: "blur(0px)",
              duration: 0.82,
              ease: "expo.inOut",
            },
            launchTime + 0.08,
          );
      });

      /* الكوباية آخر عنصر: تكبر لحظة ثم تنطلق يمينًا أمام الكاميرا. */
      timeline
        .to(
          cup,
          {
            y: -55,
            scale: 1.12,
            rotation: -3,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.16,
            ease: "power2.out",
          },
          5.76,
        )
        .to(
          cup,
          {
            x: "112vw",
            y: -230,
            rotation: 28,
            scale: 1.3,
            opacity: 1,
            filter: "blur(1px)",
            duration: 0.98,
            ease: "expo.inOut",
          },
          5.88,
        );

      /* الخلفية تقرّب قليلًا لتدعم الإحساس بالحركة بدون تفتيح العناصر. */
      timeline.to(
        sectionRef.current,
        {
          backgroundColor: "#a86f49",
          scale: 1.025,
          duration: 0.85,
          ease: "power2.inOut",
        },
        5.35,
      );
    }, sectionRef);

    return () => context.revert();
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;

    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };

    window.addEventListener("keydown", onKeyDown);

    const animation = gsap.timeline();

    animation
      .fromTo(
        modalBackdropRef.current,
        { opacity: 0, backdropFilter: "blur(0px)" },
        {
          opacity: 1,
          backdropFilter: "blur(18px)",
          duration: 0.34,
          ease: "power2.out",
        },
      )
      .fromTo(
        modalPanelRef.current,
        {
          y: 70,
          scale: 0.72,
          rotateX: 12,
          opacity: 0,
          filter: "blur(12px)",
        },
        {
          y: 0,
          scale: 1,
          rotateX: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.68,
          ease: "expo.out",
        },
        0.08,
      )
      .fromTo(
        modalContentRef.current?.children ?? [],
        { y: 22, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.07,
          duration: 0.5,
          ease: "power3.out",
        },
        0.28,
      );

    return () => {
      animation.kill();
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = oldOverflow;
    };
  }, [activeIndex]);

  function openModal(index: number) {
    setActiveIndex(index);
  }

  function closeModal() {
    if (activeIndex === null) return;

    gsap.timeline({
      onComplete: () => setActiveIndex(null),
    })
      .to(modalPanelRef.current, {
        y: 35,
        scale: 0.9,
        opacity: 0,
        filter: "blur(8px)",
        duration: 0.28,
        ease: "power2.in",
      })
      .to(
        modalBackdropRef.current,
        {
          opacity: 0,
          duration: 0.22,
          ease: "power2.in",
        },
        0.08,
      );
  }

  const modal =
    activeItem && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={modalBackdropRef}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-[#1d0e08]/72 p-4 md:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={activeItem.title}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeModal();
            }}
          >
            {/* إضاءة درامية خلف النافذة */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[75vmin] w-[75vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f4c891]/18 blur-[100px]" />

            {/* حبات صغيرة طافية داخل الـlightbox */}
            {[0, 1, 2, 3, 4, 5].map((beanIndex) => (
              <div
                key={`modal-bean-${beanIndex}`}
                className="pointer-events-none absolute h-[54px] w-[42px] animate-pulse md:h-[74px] md:w-[58px]"
                style={{
                  left: `${8 + beanIndex * 16}%`,
                  top: beanIndex % 2 === 0 ? "8%" : "82%",
                  transform: `rotate(${beanIndex * 37 - 55}deg)`,
                  animationDelay: `${beanIndex * 120}ms`,
                }}
              >
                <Image
                  src={beanImages[beanIndex % beanImages.length]}
                  alt=""
                  fill
                  sizes="74px"
                  className="object-contain opacity-55 drop-shadow-[0_8px_7px_rgba(0,0,0,.38)]"
                />
              </div>
            ))}

            <div
              ref={modalPanelRef}
              className="relative max-h-[90vh] w-full max-w-[1080px] overflow-hidden rounded-[30px] border border-white/25 bg-[#f5ead9]/96 shadow-[0_45px_140px_rgba(0,0,0,.55)] [transform-style:preserve-3d]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(255,255,255,.72),transparent_38%),linear-gradient(135deg,rgba(255,255,255,.22),transparent_55%)]" />

              <button
                type="button"
                onClick={closeModal}
                className="absolute right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-[#69442e]/20 bg-white/65 text-2xl text-[#54321f] shadow-lg backdrop-blur-md transition duration-300 hover:rotate-90 hover:scale-110 hover:bg-white"
                aria-label="Close preview"
              >
                ×
              </button>

              <div
                ref={modalContentRef}
                className={`relative z-10 grid max-h-[90vh] overflow-y-auto ${
                  activeItem.type === "image"
                    ? "md:grid-cols-[1.35fr_.65fr]"
                    : "md:grid-cols-[.72fr_1.28fr]"
                }`}
              >
                {activeItem.type === "image" ? (
                  <div className="relative min-h-[46vh] overflow-hidden md:min-h-[78vh]">
                    <Image
                      src={activeItem.image}
                      alt={activeItem.label}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 70vw"
                      className="object-cover object-center"
                    />
                    <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/15" />
                  </div>
                ) : (
                  <div className="relative hidden min-h-[72vh] overflow-hidden md:block">
                    <Image
                      src="/header.png"
                      alt=""
                      fill
                      sizes="40vw"
                      className="object-cover opacity-55"
                    />
                    <div className="absolute inset-0 bg-[#7a4b2c]/35" />
                    <div className="absolute inset-0 flex items-center justify-center p-10">
                      <span
                        className="max-w-[330px] rotate-[-5deg] text-center text-[42px] leading-[1.08] text-white drop-shadow-xl"
                        style={{
                          fontFamily: "'Segoe Print', 'Comic Sans MS', cursive",
                        }}
                      >
                        {activeItem.title}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex min-h-[360px] flex-col justify-center p-7 text-[#54331f] sm:p-10 md:p-14">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#a26a45]">
                    {activeItem.label}
                  </span>

                  <h3
                    className="mt-6 text-[clamp(2rem,4.2vw,4.8rem)] leading-[1.02]"
                    style={{
                      fontFamily: "'Segoe Print', 'Comic Sans MS', cursive",
                    }}
                  >
                    {activeItem.title}
                  </h3>

                  <p className="mt-7 max-w-[620px] text-[15px] leading-7 text-[#765039] md:text-[18px] md:leading-8">
                    {activeItem.body}
                  </p>

                </div>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <section
        id="coffee-story"
        ref={sectionRef}
        className="relative h-[100svh] min-h-[640px] overflow-hidden bg-[#e9d8bd] md:h-screen md:min-h-0"
      >
        <div className="absolute inset-0">
          <picture className="block h-full w-full">
            <source
              media="(max-width: 767px)"
              srcSet="/Bean cafe mobile.png"
            />
            <img
              src="/header.png"
              alt=""
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover object-center"
            />
          </picture>
        </div>

        <div className="absolute inset-0 bg-[#f1e4ce]/66" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,248,236,.08)_0%,rgba(91,57,33,.2)_100%)]" />
        <div className="absolute left-1/2 top-[50%] h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fff3df]/44 blur-[115px]" />

        {/* حبات انتقالية تظهر في الفراغ ثم تختفي مع دخول المج */}
        <div className="pointer-events-none absolute inset-0 z-[35] overflow-hidden">
          {transitionBeans.map((bean, index) => (
            <div
              key={`transition-bean-${index}`}
              ref={(element) => {
                transitionBeanRefs.current[index] = element;
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
                sizes="90px"
                className="object-contain drop-shadow-[0_10px_8px_rgba(42,20,9,.3)]"
              />
            </div>
          ))}
        </div>

        {/*
         * 8 عناصر: 4 صور + 4 نصوص.
         * كل عنصر Button قابل للضغط ويفتح Lightbox كامل.
         */}
        <div
          ref={contentRef}
          className="absolute inset-0 z-20 mx-auto flex w-full max-w-[1600px] items-center px-3 py-5 sm:px-4 sm:py-6 md:px-10 md:py-8 lg:px-14"
        >
          <div className="grid h-full max-h-[calc(100svh-40px)] w-full grid-cols-2 grid-rows-4 gap-2 sm:gap-3 md:h-auto md:max-h-none md:grid-cols-4 md:grid-rows-2 md:gap-6">
            {storyItems.map((item, index) => (
              <button
                key={`story-item-${index}`}
                ref={(element) => {
                  storyCardRefs.current[index] = element;
                }}
                type="button"
                onClick={() => openModal(index)}
                className={`group relative h-full min-h-0 overflow-hidden rounded-[14px] border border-white/55 text-left shadow-[0_12px_28px_rgba(65,37,20,.14)] outline-none transition duration-500 hover:-translate-y-2 hover:scale-[1.025] hover:shadow-[0_34px_75px_rgba(65,37,20,.26)] focus-visible:ring-4 focus-visible:ring-[#a96c45]/35 md:min-h-[260px] md:rounded-[18px] md:shadow-[0_22px_55px_rgba(65,37,20,.16)] ${
                  item.type === "image"
                    ? "bg-transparent"
                    : "bg-[#f7ead8]/84 p-3 text-[#5f3b27] backdrop-blur-[3px] sm:p-4 md:p-7 md:backdrop-blur-[5px]"
                }`}
                aria-label={`Open ${item.title}`}
              >
                {item.type === "image" ? (
                  <>
                    <div className="relative h-full w-full overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.label}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-white/5 opacity-70 transition group-hover:opacity-90" />
                    </div>

                    <div className="absolute bottom-2 left-2 right-2 hidden translate-y-3 items-end justify-between opacity-0 transition duration-400 group-hover:translate-y-0 group-hover:opacity-100 md:flex md:bottom-5 md:left-5 md:right-5">
                      <span className="text-[10px] uppercase tracking-[0.22em] text-white">
                        Open full image
                      </span>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-lg text-[#573421] shadow-lg">
                        ↗
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full flex-col justify-between">
                    <span className="text-[7px] uppercase tracking-[0.18em] text-[#a16c49] sm:text-[8px] sm:tracking-[0.22em] md:text-[9px] md:tracking-[0.28em]">
                      {item.label}
                    </span>

                    <h3
                      className="text-[15px] leading-[1.08] sm:text-[17px] md:text-[clamp(20px,2vw,32px)]"
                      style={{
                        fontFamily: "'Segoe Print', 'Comic Sans MS', cursive",
                      }}
                    >
                      {item.title}
                    </h3>

                    <div>
                      <p className="line-clamp-1 text-[9px] leading-4 text-[#805a40] sm:text-[10px] md:line-clamp-2 md:text-[13px] md:leading-5">
                        {item.body}
                      </p>

                      <div className="mt-2 flex items-center justify-between border-t border-[#8b5e40]/12 pt-2 md:mt-4 md:pt-3">
                        <span className="text-[7px] uppercase tracking-[0.12em] text-[#9a6a4b] sm:text-[8px] md:text-[9px] md:tracking-[0.2em]">
                          Read full story
                        </span>
                        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#85583b]/15 bg-white/45 text-sm text-[#664029] transition duration-400 group-hover:rotate-45 group-hover:scale-110 group-hover:bg-white md:h-8 md:w-8 md:text-base">
                          +
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pointer-events-none absolute inset-0 rounded-[18px] ring-1 ring-inset ring-white/25 transition duration-500 group-hover:ring-white/70" />
              </button>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 z-10 h-[18%] w-full bg-gradient-to-b from-[#b98d5a]/16 to-[#765033]/38" />

        <div
          ref={sackRef}
          className="pointer-events-none absolute bottom-[1%] left-[-3%] z-30 h-[360px] w-[350px] md:left-[1%] md:h-[455px] md:w-[445px]"
        >
          <Image
            src="/sack.png"
            alt="Coffee bean sack"
            fill
            sizes="445px"
            className="object-contain object-bottom"
          />
        </div>

        <div className="pointer-events-none absolute bottom-[20%] left-[12%] z-40">
          {beans.map((bean, index) => (
            <div
              key={`bean-${index}`}
              ref={(element) => {
                beanRefs.current[index] = element;
              }}
              className={`absolute ${
                bean.depth === "front" ? "z-20" : "z-0"
              } h-[72px] w-[56px] md:h-[96px] md:w-[76px]`}
            >
              <Image
                src={beanImages[index % beanImages.length]}
                alt=""
                fill
                sizes="96px"
                className="object-contain drop-shadow-[0_5px_4px_rgba(34,17,8,.3)]"
              />
            </div>
          ))}
        </div>

        <div
          ref={cupRef}
          className="pointer-events-none absolute bottom-[4%] left-1/2 z-50 h-[690px] w-[590px] -translate-x-1/2 md:h-[810px] md:w-[690px]"
        >
          <div className="absolute bottom-[4%] left-1/2 h-[28px] w-[45%] -translate-x-1/2 rounded-full bg-black/28 blur-xl" />

          <Image
            src="/Cup.png"
            alt="Hot coffee cup"
            fill
            priority
            sizes="690px"
            className="object-contain object-bottom drop-shadow-[0_26px_25px_rgba(48,25,12,.27)]"
          />
        </div>
      </section>

      {modal}
    </>
  );
}