"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Coffee,
  Heart,
  Plus,
  Search,
  Snowflake,
  Sparkles,
  X,
} from "lucide-react";

import {
  categories,
  menuItems,
  type MenuItem,
} from "@/lib/menu-data";

export default function DrinkMenu() {
  const router = useRouter();
  const [filter, setFilter] =
    useState<(typeof categories)[number]>("All");

  const [query, setQuery] = useState("");
  const [active, setActive] = useState<MenuItem | null>(null);
  const [liked, setLiked] = useState<string[]>([]);

  useEffect(() => {
    const listener = (event: Event) => {
      const custom = event as CustomEvent<{ query?: string }>;

      setQuery(custom.detail?.query ?? "");
      setFilter("All");
    };

    window.addEventListener("noir-menu-search", listener);

    return () =>
      window.removeEventListener("noir-menu-search", listener);
  }, []);

  useEffect(() => {
    if (!active) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(null);
      }
    };

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return menuItems.filter((item) => {
      const categoryMatch =
        filter === "All" ||
        item.category === filter ||
        (filter === "Iced" && item.options.includes("Iced"));

      const searchMatch =
        !normalized ||
        `${item.name} ${item.category} ${item.note}`
          .toLowerCase()
          .includes(normalized);

      return categoryMatch && searchMatch;
    });
  }, [filter, query]);

  return (
    <section
      id="menu"
      className="relative min-h-screen overflow-hidden bg-[#f3e8d8] px-5 py-24 text-[#3e2518] md:px-10 lg:px-14"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,#fffaf2_0%,#f2e4d1_42%,#d5b695_100%)]" />

      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_10%_20%,rgba(116,72,44,.16)_0_2px,transparent_3px),radial-gradient(circle_at_85%_70%,rgba(116,72,44,.12)_0_2px,transparent_3px)] [background-size:80px_80px,110px_110px]" />

      <div className="relative z-10 mx-auto max-w-[1500px]">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-[9px] uppercase tracking-[.45em] text-[#986647]">
              NØIR BEAN menu laboratory
            </p>

            <h2 className="mt-5 max-w-[760px] font-serif text-[clamp(3rem,6vw,6.8rem)] leading-[.88] tracking-[-.045em]">
              What does your moment taste like?
            </h2>

            <p className="mt-6 max-w-[590px] text-[13px] leading-6 text-[#75513b] md:text-[15px]">
              Choose a drink or a freshly baked croissant, then open
              the card to see every detail.
            </p>
          </div>

          <div className="w-full max-w-[430px] rounded-full border border-[#75492f]/14 bg-white/48 p-2 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-3 px-3">
              <Search size={17} className="text-[#8b5f43]" />

              <input
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                placeholder="Search the menu..."
                className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-[#6d4b36]/40"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="grid h-8 w-8 place-items-center rounded-full bg-[#4b2b1b] text-white"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-full border px-5 py-2.5 text-[10px] uppercase tracking-[.16em] transition ${
                filter === item
                  ? "border-[#4a2a1a] bg-[#4a2a1a] text-white"
                  : "border-[#70442d]/15 bg-white/35 text-[#66402a] hover:bg-white/70"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((item, index) => {
            const isLiked = liked.includes(item.id);

            return (
              <article
                key={item.id}
                className="group relative min-h-[390px] overflow-hidden sm:min-h-[430px] rounded-[30px] border border-white/60 bg-white/38 p-5 shadow-[0_25px_70px_rgba(77,43,24,.12)] backdrop-blur-md transition duration-500 hover:-translate-y-3 hover:shadow-[0_38px_90px_rgba(77,43,24,.2)]"
              >
                <button
                  type="button"
                  onClick={() =>
                    setLiked((current) =>
                      isLiked
                        ? current.filter((id) => id !== item.id)
                        : [...current, item.id],
                    )
                  }
                  className={`absolute right-5 top-5 z-20 grid h-10 w-10 place-items-center rounded-full border transition ${
                    isLiked
                      ? "border-[#4b2a1a] bg-[#4b2a1a] text-white"
                      : "border-[#70462f]/13 bg-white/60 text-[#5f3924]"
                  }`}
                  aria-label={`Favorite ${item.name}`}
                >
                  <Heart
                    size={16}
                    fill={isLiked ? "currentColor" : "none"}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => router.push(`/menu?item=${encodeURIComponent(item.id)}`)}
                  className="flex h-full w-full flex-col text-left"
                >
                  <div className="relative mx-auto mt-3 h-[210px] w-full sm:h-[245px]">
                    <div className="absolute bottom-3 left-1/2 h-8 w-[58%] -translate-x-1/2 rounded-full bg-[#3d2114]/20 blur-xl" />

                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 320px"
                      className="object-contain p-3 drop-shadow-[0_24px_25px_rgba(45,21,10,.24)] transition duration-700 group-hover:-translate-y-3 group-hover:scale-[1.08] group-hover:rotate-1"
                    />
                  </div>

                  <div className="mt-auto pt-5">
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <span className="text-[9px] uppercase tracking-[.24em] text-[#9a6848]">
                        {String(index + 1).padStart(2, "0")} ·{" "}
                        {item.category}
                      </span>

                      {item.type === "pastry" ? (
                        <Sparkles size={14} />
                      ) : item.options.includes("Iced") ? (
                        <Snowflake size={14} />
                      ) : (
                        <Coffee size={14} />
                      )}
                    </div>

                    <h3 className="font-serif text-[30px] leading-none">
                      {item.name}
                    </h3>

                    <p className="mt-3 min-h-10 text-[12px] leading-5 text-[#78533c]">
                      {item.note}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-[#72472f]/10 pt-4">
                      <span className="font-serif text-xl">
                        {item.basePrice} EGP
                      </span>

                      <span className="grid h-10 w-10 place-items-center rounded-full bg-[#4b2b1b] text-white transition group-hover:rotate-90 group-hover:scale-110">
                        <Plus size={17} />
                      </span>
                    </div>
                  </div>
                </button>
              </article>
            );
          })}
        </div>

        {visible.length === 0 && (
          <div className="mt-12 rounded-[30px] border border-[#75492f]/12 bg-white/38 p-12 text-center">
            <Sparkles className="mx-auto mb-4" />

            <h3 className="font-serif text-3xl">
              No item found
            </h3>

            <p className="mt-2 text-sm text-[#76513a]">
              Try another name or clear the filter.
            </p>
          </div>
        )}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[250] flex items-center justify-center bg-[#1a0e09]/76 p-4 backdrop-blur-xl"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setActive(null);
            }
          }}
        >
          <div className="relative grid max-h-[90vh] w-full max-w-[1050px] overflow-y-auto rounded-[36px] border border-white/20 bg-[#f5e7d6] shadow-[0_50px_140px_rgba(18,8,4,.55)] md:grid-cols-[.9fr_1.1fr]">
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute right-5 top-5 z-20 grid h-11 w-11 place-items-center rounded-full bg-[#4b2b1b] text-white"
              aria-label="Close item"
            >
              <X size={17} />
            </button>

            <div className="relative min-h-[300px] overflow-hidden sm:min-h-[380px] md:min-h-[420px] bg-[radial-gradient(circle_at_50%_34%,#fff7eb_0%,#ddb991_58%,#9b6645_100%)]">
              <div className="absolute inset-4 sm:inset-7">
                <Image
                  src={active.image}
                  alt={active.name}
                  fill
                  priority
                  sizes="500px"
                  className="object-contain drop-shadow-[0_34px_35px_rgba(39,17,7,.3)]"
                />
              </div>
            </div>

            <div className="p-7 text-[#472a1a] md:p-12">
              <p className="text-[9px] uppercase tracking-[.34em] text-[#986647]">
                {active.category}
                {active.options.length > 0
                  ? ` · ${active.options.join(" / ")}`
                  : " · Freshly baked"}
              </p>

              <h3 className="mt-5 font-serif text-[clamp(3rem,6vw,5.5rem)] leading-[.9]">
                {active.name}
              </h3>

              <p className="mt-6 text-[15px] leading-7 text-[#75513b]">
                {active.note}.
                {active.type === "drink"
                  ? " Prepared with NØIR house espresso."
                  : " Baked to stay crisp outside and soft inside."}
              </p>

              {active.type === "drink" && (
                <div className="mt-8 space-y-6">
                  <Option
                    title="Temperature"
                    items={active.options}
                  />

                  <Option
                    title="Size"
                    items={["Small", "Medium", "Large"]}
                  />

                  <Option
                    title="Sweetness"
                    items={["None", "Balanced", "Sweet"]}
                  />
                </div>
              )}

              <a
                href="/menu"
                className="mt-9 flex w-full items-center justify-between rounded-full bg-[#4b2b1b] px-7 py-4 text-white transition hover:scale-[1.02]"
              >
                <span>
                  {active.type === "drink"
                    ? "Customize order"
                    : "Add to order"}
                </span>

                <span>{active.basePrice} EGP</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Option({
  title,
  items,
}: {
  title: string;
  items: readonly string[];
}) {
  const [selected, setSelected] = useState(items[0] ?? "");

  if (items.length === 0) return null;

  return (
    <div>
      <p className="mb-3 text-[10px] uppercase tracking-[.2em] text-[#936246]">
        {title}
      </p>

      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setSelected(item)}
            className={`rounded-full border px-4 py-2 text-[11px] transition ${
              selected === item
                ? "border-[#4b2b1b] bg-[#4b2b1b] text-white"
                : "border-[#70442d]/15 bg-white/45"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}