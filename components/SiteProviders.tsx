"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ChatBot from "@/components/ChatBot";
import LanguageProvider from "@/components/LanguageProvider";

gsap.registerPlugin(ScrollTrigger);

export default function SiteProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    ScrollTrigger.config({
      ignoreMobileResize: true,
      limitCallbacks: true,
    });

    let timer: number | undefined;

    const refresh = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      }, 140);
    };

    const firstFrame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(refresh);
    });

    window.addEventListener("load", refresh, { once: true });
    window.addEventListener("orientationchange", refresh);
    document.fonts?.ready.then(refresh).catch(() => undefined);

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.clearTimeout(timer);
      window.removeEventListener("load", refresh);
      window.removeEventListener("orientationchange", refresh);
    };
  }, []);

  return (
    <LanguageProvider>
      {children}
      <ChatBot />
    </LanguageProvider>
  );
}
