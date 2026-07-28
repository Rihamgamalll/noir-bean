"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  RotateCcw,
  Send,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

import { useLanguage } from "@/components/LanguageProvider";

type Message = {
  role: "user" | "bot";
  text: string;
};

export default function ChatBot() {
  const { isArabic } = useLanguage();

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const endRef = useRef<HTMLDivElement>(null);

  const sessionId = useMemo(() => {
    if (typeof window === "undefined") return "noir-session";

    return (
      localStorage.getItem("noir-chat-session") ||
      crypto.randomUUID()
    );
  }, []);

  useEffect(() => {
    localStorage.setItem("noir-chat-session", sessionId);

    const saved = localStorage.getItem("noir-chat-messages");

    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {
        localStorage.removeItem("noir-chat-messages");
      }
    }
  }, [sessionId]);

  useEffect(() => {
    localStorage.setItem(
      "noir-chat-messages",
      JSON.stringify(messages),
    );

    endRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, busy]);

  const welcome = isArabic
    ? "أهلًا بيك في NØIR BEAN ☕ اسألني بطريقتك حتى لو في أخطاء كتابة. أقدر أرشحلك مشروب حسب مزاجك أو ميزانيتك، أشرح أنواع البن، وأحسب إجمالي طلبك."
    : "Welcome to NØIR BEAN ☕ Ask naturally—even with typos. I can recommend drinks by mood or budget, explain bean types, and calculate order totals.";

  const suggestions = isArabic
    ? [
        "أنا مصدعة أشرب إيه؟",
        "عايزة حاجة من 100 لـ 150 جنيه",
        "عايزة حاجة باردة وحلوة",
        "إيه أقوى مشروب؟",
        "أنواع البن والفرق بينهم",
        "احسب 2 لاتيه وكرواسون فستق",
      ]
    : [
        "What should I drink for a headache?",
        "Something from 100 to 150 EGP",
        "I want something cold and sweet",
        "What is the strongest drink?",
        "Explain the bean types",
        "Calculate 2 lattes and a pistachio croissant",
      ];

  async function send(text = input) {
    const clean = text.trim();

    if (!clean || busy) return;

    setMessages((current) => [
      ...current,
      { role: "user", text: clean },
    ]);

    setInput("");
    setBusy(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: clean,
          sessionId,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Chat request failed");
      }

      setMessages((current) => [
        ...current,
        {
          role: "bot",
          text:
            data.reply ||
            (isArabic
              ? "معلش، جربي تسألي بصياغة تانية."
              : "Sorry, please try asking another way."),
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "bot",
          text: isArabic
            ? "حصل خطأ بسيط. جرّبي تاني."
            : "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function clear() {
    setMessages([]);
    localStorage.removeItem("noir-chat-messages");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-[180] flex items-center gap-2 rounded-full bg-[#3b2115] px-5 py-4 text-sm text-white shadow-[0_20px_60px_rgba(30,13,6,.35)] transition hover:-translate-y-1"
      >
        <Sparkles size={17} />
        Ask NØIR
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[400] flex items-end justify-end bg-black/25 p-3 backdrop-blur-sm md:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <div className="flex h-[min(760px,90vh)] w-full max-w-[440px] flex-col overflow-hidden rounded-[32px] border border-white/35 bg-[#f6ead9] text-[#3a2115] shadow-[0_40px_130px_rgba(20,8,3,.5)]">
            <header className="flex items-center justify-between bg-[#3a2115] p-5 text-white">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10">
                  <Bot size={20} />
                </span>

                <div>
                  <strong>NØIR Assistant</strong>
                  <p className="text-[10px] text-white/55">
                    Live menu · Arabic · English
                  </p>
                </div>
              </div>

              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={clear}
                  title="Clear chat"
                  className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10"
                >
                  <Trash2 size={17} />
                </button>

                <button
                  type="button"
                  onClick={clear}
                  title="Restart chat"
                  className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10"
                >
                  <RotateCcw size={17} />
                </button>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  title="Close"
                  className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10"
                >
                  <X size={20} />
                </button>
              </div>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              <div
                dir={isArabic ? "rtl" : "ltr"}
                className="max-w-[90%] rounded-2xl bg-white/75 px-4 py-3 text-sm leading-6 shadow-sm"
              >
                {welcome}
              </div>

              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  dir={
                    /[\u0600-\u06ff]/.test(message.text)
                      ? "rtl"
                      : "ltr"
                  }
                  className={`max-w-[90%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                    message.role === "user"
                      ? "ml-auto bg-[#3a2115] text-white"
                      : "bg-white/75"
                  }`}
                >
                  {message.text}
                </div>
              ))}

              {busy && (
                <div className="max-w-[70%] animate-pulse rounded-2xl bg-white/75 px-4 py-3 text-sm">
                  {isArabic
                    ? "NØIR بيفكر…"
                    : "NØIR is thinking…"}
                </div>
              )}

              <div ref={endRef} />
            </div>

            <div className="border-t border-[#6c432d]/10 bg-[#f9f0e4]/90 px-4 py-3">
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    type="button"
                    key={suggestion}
                    onClick={() => send(suggestion)}
                    disabled={busy}
                    dir={
                      /[\u0600-\u06ff]/.test(suggestion)
                        ? "rtl"
                        : "ltr"
                    }
                    className="max-w-full whitespace-normal rounded-full border border-[#6c432d]/15 bg-white/70 px-3 py-2 text-left text-[10px] leading-4 transition hover:-translate-y-0.5 hover:bg-white disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 border-t border-[#6c432d]/10 bg-[#f6ead9] p-4">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    send();
                  }
                }}
                dir={isArabic ? "rtl" : "ltr"}
                placeholder={
                  isArabic
                    ? "اكتب سؤالك بطريقتك..."
                    : "Ask anything..."
                }
                className="min-w-0 flex-1 rounded-full bg-white/80 px-4 py-3 text-sm outline-none ring-[#8b5a3c]/20 transition focus:ring-4"
              />

              <button
                type="button"
                onClick={() => send()}
                disabled={busy || !input.trim()}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#3a2115] text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={17} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
