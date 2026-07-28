"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Check,
  Coffee,
  Heart,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";

import {
  categories,
  menuItems,
  type Drink,
} from "@/lib/menu-data";

type CartItem = {
  key: string;
  drink: Drink;
  quantity: number;
  size: "Small" | "Medium" | "Large";
  temperature: "Hot" | "Iced";
  sugar: "No sugar" | "Light" | "Regular" | "Extra";
  beanType: "House Blend" | "Brazilian" | "Colombian" | "Ethiopian" | "Decaf";
  unitPrice: number;
};

const sizeDelta = {
  Small: 0,
  Medium: 20,
  Large: 35,
} as const;

const whatsappNumber = "201013290912";

export default function MenuExperience() {
  const searchParams = useSearchParams();
  const [category, setCategory] =
    useState<(typeof categories)[number]>("All");

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Drink | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [size, setSize] =
    useState<CartItem["size"]>("Medium");

  const [temperature, setTemperature] =
    useState<CartItem["temperature"]>("Hot");

  const [sugar, setSugar] =
    useState<CartItem["sugar"]>("Regular");

  const [beanType, setBeanType] =
    useState<CartItem["beanType"]>("House Blend");
  const [favorites, setFavorites] = useState<string[]>([]);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setFavorites(JSON.parse(localStorage.getItem("noir-favorites") || "[]"));
  }, []);

  useEffect(() => {
    const requestedItem = searchParams.get("item");
    if (!requestedItem) return;

    const match = menuItems.find((item) => item.id === requestedItem);
    if (match) openDrink(match);
  }, [searchParams]);

  function toggleFavorite(id: string) {
    setFavorites((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem("noir-favorites", JSON.stringify(next));
      return next;
    });
  }

  const filtered = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();

    return menuItems.filter((drink) => {
      const matchesCategory =
        category === "All" || drink.category === category;

      const matchesSearch =
        !cleanQuery ||
        `${drink.name} ${drink.note} ${drink.category}`
          .toLowerCase()
          .includes(cleanQuery);

      return matchesCategory && matchesSearch;
    });
  }, [category, query]);

  const total = cart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  const count = cart.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  function openDrink(drink: Drink) {
    setSelected(drink);
    setSize(drink.type === "pastry" ? "Small" : "Medium");
    setSugar("Regular");
    setBeanType("House Blend");
    setTemperature(drink.options.includes("Hot") ? "Hot" : "Iced");
  }

  function addToCart() {
    if (!selected) return;

    const unitPrice = selected.basePrice + (selected.type === "pastry" ? 0 : sizeDelta[size]);

    const key = [
      selected.id,
      selected.type === "pastry" ? "pastry" : size,
      selected.type === "pastry" ? "fresh" : temperature,
      selected.type === "pastry" ? "standard" : sugar,
      selected.type === "pastry" ? "none" : beanType,
    ].join("-");

    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.key === key,
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.key === key
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      return [
        ...currentCart,
        {
          key,
          drink: selected,
          quantity: 1,
          size: selected.type === "pastry" ? "Small" : size,
          temperature: selected.type === "pastry" ? "Hot" : temperature,
          sugar: selected.type === "pastry" ? "No sugar" : sugar,
          beanType: selected.type === "pastry" ? "House Blend" : beanType,
          unitPrice,
        },
      ];
    });

    setSelected(null);
    setCartOpen(true);
  }

  function updateQuantity(key: string, delta: number) {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.key === key
          ? {
              ...item,
              quantity: Math.max(
                1,
                item.quantity + delta,
              ),
            }
          : item,
      ),
    );
  }

  function removeFromCart(key: string) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.key !== key),
    );
  }

  async function confirmOrder() {
    if (
      !customerName.trim() ||
      !customerPhone.trim() ||
      !address.trim() ||
      cart.length === 0
    ) {
      return;
    }

    setSending(true);
    setSuccess("");

    const payload = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      address: address.trim(),
      notes: notes.trim(),
      total,
      items: cart.map((item) => ({
        id: item.drink.id,
        name: item.drink.name,
        quantity: item.quantity,
        size: item.size,
        temperature: item.temperature,
        sugar: item.sugar,
        beanType: item.beanType,
        unitPrice: item.unitPrice,
      })),
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Order failed");
      }

      const lines = cart
        .map(
          (item) =>
            `â€¢ ${item.quantity}أ— ${item.drink.name}` +
            ` â€” ${item.size}, ${item.temperature}, ${item.sugar}, ${item.beanType}` +
            ` â€” ${item.unitPrice * item.quantity} EGP`,
        )
        .join("\n");

      const message =
        `New NأکIR BEAN order âک•\n` +
        `Order: ${data.order.id}\n` +
        `Customer: ${customerName}\n` +
        `Phone: ${customerPhone}\n` +
        `Address: ${address}\n\n` +
        `${lines}\n\n` +
        `Total: ${total} EGP` +
        `${notes.trim() ? `\nNotes: ${notes.trim()}` : ""}`;

      window.open(
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
          message,
        )}`,
        "_blank",
        "noopener,noreferrer",
      );

      setSuccess(
        `Order ${data.order.id} saved successfully.`,
      );

      setCart([]);
      setCustomerName("");
      setCustomerPhone("");
      setAddress("");
      setNotes("");
    } catch (error) {
      setSuccess(
        error instanceof Error
          ? error.message
          : "Could not place the order.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="relative min-h-screen overflow-hidden pb-24 pt-32 text-[#3b2115]">
      {/* Background */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_12%,rgba(255,255,255,.85),transparent_32%),linear-gradient(135deg,#f3e6d4,#d9ba94)]" />

      <div className="absolute inset-0 opacity-[.12] [background-image:radial-gradient(#5c321f_0.7px,transparent_0.7px)] [background-size:7px_7px]" />

      <div className="relative mx-auto max-w-[1500px] px-5 md:px-10">
        {/* Heading */}

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-[.45em] text-[#9c6746]">
              NأکIR BEAN آ· ORDER STUDIO
            </p>

            <h1 className="mt-4 max-w-[850px] font-serif text-[clamp(3.5rem,7vw,7.5rem)] leading-[.86] tracking-[-.05em]">
              Choose your ritual.
            </h1>

            <p className="mt-6 max-w-[600px] text-sm leading-7 text-[#6d4933]">
              Choose your drink, customize it, then
              complete the order directly through WhatsApp.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="flex items-center gap-3 self-start rounded-full bg-[#3d2114] px-6 py-4 text-sm text-white shadow-[0_20px_55px_rgba(48,25,13,.25)] transition duration-300 hover:-translate-y-1"
          >
            <ShoppingBag size={18} />

            <span>Cart</span>

            <span className="grid h-7 min-w-7 place-items-center rounded-full bg-[#e4b98d] px-2 text-xs text-[#32190e]">
              {count}
            </span>
          </button>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[230px_1fr]">
          {/* Filters */}

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[30px] border border-white/60 bg-white/30 p-4 shadow-[0_24px_70px_rgba(65,34,19,.12)] backdrop-blur-xl">
              <div className="flex items-center gap-3 rounded-full border border-[#6c422c]/12 bg-white/55 px-4 py-3">
                <Search
                  size={16}
                  className="text-[#906044]"
                />

                <input
                  value={query}
                  onChange={(event) =>
                    setQuery(event.target.value)
                  }
                  placeholder="Search drinks & croissants"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#6e4a36]/40"
                />
              </div>

              <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
                {categories.map((item, index) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setCategory(item)}
                    className={`flex min-w-max items-center justify-between rounded-2xl px-4 py-4 text-left text-sm transition ${
                      category === item
                        ? "bg-[#442719] text-white shadow-lg"
                        : "text-[#69452f] hover:bg-white/60"
                    }`}
                  >
                    <span>{item}</span>

                    <span className="ml-8 text-[10px] opacity-45">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Menu cards */}

          <div>
            {filtered.length === 0 ? (
              <div className="rounded-[36px] border border-white/60 bg-white/35 p-14 text-center backdrop-blur-xl">
                <Coffee
                  size={35}
                  className="mx-auto text-[#8d5d40]"
                />

                <p className="mt-5 font-serif text-3xl">
                  No menu items found
                </p>

                <p className="mt-3 text-sm text-[#765039]">
                  Try a different name or category.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((drink, index) => (
                  <div
                    role="button"
                    tabIndex={0}
                    key={drink.id}
                    onClick={() => openDrink(drink)}
                    onKeyDown={(event) => event.key === "Enter" && openDrink(drink)}
                    className="group relative min-h-[520px] overflow-hidden rounded-[38px] border border-white/70 bg-[#f7ead8]/85 p-5 text-left shadow-[0_25px_70px_rgba(72,40,22,.13)] backdrop-blur-xl transition duration-500 hover:-translate-y-3 hover:shadow-[0_42px_100px_rgba(72,40,22,.22)]"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(255,255,255,.9),transparent_35%)]" />

                    <div className="relative flex h-full flex-col">
                      {/* Card header */}

                      <div className="flex items-start justify-between px-1">
                        <div>
                          <span className="text-[9px] uppercase tracking-[.3em] text-[#a46c48]">
                            {drink.category}
                          </span>

                          <p className="mt-2 text-[10px] text-[#775039]/60">
                            NأکIR{" "}
                            {String(index + 1).padStart(2, "0")}
                          </p>
                        </div>

                        <button
                          type="button"
                          aria-label={`Toggle ${drink.name} favorite`}
                          onClick={(event) => { event.stopPropagation(); toggleFavorite(drink.id); }}        
                          className={`grid h-11 w-11 place-items-center rounded-full border transition duration-300 ${favorites.includes(drink.id) ? "border-[#8d4b37]/30 bg-[#8d4b37] text-white" : "border-[#74482f]/12 bg-white/60"}`}
                        >
                          <Heart size={18} fill={favorites.includes(drink.id) ? "currentColor" : "none"} />  
                        </button>
                      </div>

                      {/* Exact square image */}

                      <div className="relative my-5 aspect-square w-full overflow-hidden rounded-[30px] border border-white/70 bg-[#ead5b9] shadow-[inset_0_1px_0_rgba(255,255,255,.85),0_22px_48px_rgba(70,37,19,.12)] transition duration-500 group-hover:-translate-y-2">
                        <Image
                          src={drink.image}
                          alt={drink.name}
                          fill
                          sizes="(max-width: 640px) 90vw, (max-width: 1280px) 45vw, 320px"
                          className="object-cover"
                        />
                      </div>

                      {/* Information */}

                      <div className="mt-auto px-1">
                        <div className="flex items-end justify-between gap-3">
                          <h2 className="font-serif text-[31px] leading-none">
                            {drink.name}
                          </h2>

                          <span className="shrink-0 rounded-full border border-[#6d4029]/10 bg-white/55 px-3 py-1.5 text-[9px] uppercase tracking-[.12em] text-[#81563b]">
                            {drink.options.join(" / ")}
                          </span>
                        </div>

                        <p className="mt-3 text-xs leading-5 text-[#775039]">
                          {drink.note}
                        </p>

                        <div className="mt-5 flex items-center justify-between border-t border-[#74482f]/10 pt-4">
                          <span className="text-sm font-medium">
                            From {drink.basePrice} EGP
                          </span>

                          <span className="text-xs text-[#9a6747] transition duration-300 group-hover:translate-x-1">
                            Customize â†—
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customize modal */}

      {selected && (
        <div
          className="fixed inset-0 z-[300] grid place-items-center overflow-y-auto bg-[#180c07]/72 p-4 backdrop-blur-xl"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) {
              setSelected(null);
            }
          }}
        >
          <div className="my-auto w-full max-w-[1000px] overflow-hidden rounded-[40px] border border-white/25 bg-[#f4e5d0] shadow-[0_50px_140px_rgba(15,6,3,.55)]">
            <div className="grid md:grid-cols-[1fr_1.08fr]">
              {/* Full square drink picture */}

              <div className="relative flex min-h-[430px] items-center justify-center bg-[#ddb992] p-7 md:min-h-[620px]">
                <div className="absolute left-6 top-6 z-20 rounded-full border border-white/70 bg-white/55 px-4 py-2 text-[9px] uppercase tracking-[.24em] text-[#805238] backdrop-blur-md">
                  {selected.category}
                </div>

                <div className="relative aspect-square w-full max-w-[500px] overflow-hidden rounded-[38px] border border-white/75 bg-[#ead5b9] shadow-[0_32px_80px_rgba(55,27,14,.2)]">
                  <Image
                    src={selected.image}
                    alt={selected.name}
                    fill
                    sizes="500px"
                    priority
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Options */}

              <div className="p-6 md:p-10">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-[9px] uppercase tracking-[.34em] text-[#a46b47]">
                      Build your drink
                    </p>

                    <h2 className="mt-3 font-serif text-[48px] leading-none md:text-[58px]">
                      {selected.name}
                    </h2>

                    <p className="mt-5 text-sm leading-6 text-[#775039]">
                      {selected.note}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#3d2114] text-white transition duration-300 hover:rotate-90"
                  >
                    <X size={19} />
                  </button>
                </div>

                <div className="mt-10 grid gap-5 sm:grid-cols-2">
                  <OptionGroup
                    label="Size"
                    value={size}
                    options={["Small", "Medium", "Large"]}
                    onChange={(value) =>
                      setSize(value as CartItem["size"])
                    }
                  />

                  <OptionGroup
                    label="Temperature"
                    value={temperature}
                    options={selected.options}
                    onChange={(value) =>
                      setTemperature(
                        value as CartItem["temperature"],
                      )
                    }
                  />

                  <OptionGroup
                    label="Sugar"
                    value={sugar}
                    options={[
                      "No sugar",
                      "Light",
                      "Regular",
                      "Extra",
                    ]}
                    onChange={(value) =>
                      setSugar(value as CartItem["sugar"])
                    }
                  />

                  {selected.type === "drink" && (
                    <OptionGroup
                      label="Coffee beans"
                      value={beanType}
                      options={["House Blend", "Brazilian", "Colombian", "Ethiopian", "Decaf"]}
                      onChange={(value) => setBeanType(value as CartItem["beanType"])}
                    />
                  )}
                </div>

                <button
                  type="button"
                  onClick={addToCart}
                  className="mt-10 flex w-full items-center justify-between rounded-full bg-[#3d2114] px-7 py-5 text-white shadow-[0_20px_50px_rgba(55,27,14,.2)] transition duration-300 hover:-translate-y-1"
                >
                  <span>Add to order</span>

                  <span>
                    {selected.basePrice + sizeDelta[size]} EGP
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart drawer */}

      {cartOpen && (
        <div
          className="fixed inset-0 z-[320] bg-[#160b06]/55 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) {
              setCartOpen(false);
            }
          }}
        >
          <aside className="absolute right-0 top-0 h-full w-full max-w-[540px] overflow-y-auto bg-[#f3e4cf] p-5 shadow-[-30px_0_100px_rgba(20,8,3,.35)] md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-[.34em] text-[#a46b47]">
                  Your ritual
                </p>

                <h2 className="mt-2 font-serif text-4xl">
                  Order basket
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="grid h-11 w-11 place-items-center rounded-full bg-[#3d2114] text-white transition hover:rotate-90"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-8 space-y-4">
              {cart.length === 0 && (
                <div className="rounded-[28px] border border-[#6b422c]/10 bg-white/40 p-8 text-center text-sm text-[#765039]">
                  Your basket is waiting for coffee.
                </div>
              )}

              {cart.map((item) => (
                <div
                  key={item.key}
                  className="rounded-[28px] border border-white/60 bg-white/50 p-4"
                >
                  <div className="flex gap-4">
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-[22px] border border-white/70 bg-[#ead5b9]">
                      <Image
                        src={item.drink.image}
                        alt={item.drink.name}
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-serif text-2xl">
                            {item.drink.name}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-[#765039]">
                            {item.size} آ· {item.temperature} آ·{" "}
                            {item.sugar} آ· {item.beanType}
                          </p>
                        </div>

                        <button
                          type="button"
                          aria-label={`Remove ${item.drink.name}`}
                          onClick={() =>
                            removeFromCart(item.key)
                          }
                          className="text-[#765039] transition hover:text-red-700"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-full bg-[#3d2114] p-1 text-white">   
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.key, -1)
                            }
                            className="grid h-8 w-8 place-items-center"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="w-5 text-center text-sm">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.key, 1)
                            }
                            className="grid h-8 w-8 place-items-center"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <span className="text-sm font-medium">
                          {item.unitPrice * item.quantity} EGP
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <div className="mt-8 space-y-4">
                <input
                  value={customerName}
                  onChange={(event) =>
                    setCustomerName(event.target.value)
                  }
                  placeholder="Your name"
                  className="w-full rounded-2xl border border-[#6b422c]/12 bg-white/60 px-4 py-4 outline-none"
                />

                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(event) =>
                    setCustomerPhone(event.target.value)
                  }
                  placeholder="Phone number"
                  className="w-full rounded-2xl border border-[#6b422c]/12 bg-white/60 px-4 py-4 outline-none"
                />

                <textarea
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="Delivery address"
                  required
                  className="min-h-24 w-full resize-none rounded-2xl border border-[#6b422c]/12 bg-white/60 px-4 py-4 outline-none"
                />

                <textarea
                  value={notes}
                  onChange={(event) =>
                    setNotes(event.target.value)
                  }
                  placeholder="Order notes"
                  className="min-h-24 w-full resize-none rounded-2xl border border-[#6b422c]/12 bg-white/60 px-4 py-4 outline-none"
                />

                <div className="flex items-center justify-between border-t border-[#6b422c]/12 pt-5">        
                  <span>Total</span>

                  <strong className="font-serif text-3xl">
                    {total} EGP
                  </strong>
                </div>

                <button
                  type="button"
                  disabled={
                    sending ||
                    !customerName.trim() ||
                    !customerPhone.trim() ||
                    !address.trim()
                  }
                  onClick={confirmOrder}
                  className="flex w-full items-center justify-center gap-3 rounded-full bg-[#3d2114] px-6 py-4 text-white transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {sending ? (
                    "Saving order..."
                  ) : (
                    <>
                      <Check size={17} />
                      Confirm via WhatsApp
                    </>
                  )}
                </button>

                {success && (
                  <p className="rounded-2xl bg-white/60 p-4 text-sm text-[#60402d]">
                    {success}
                  </p>
                )}
              </div>
            )}
          </aside>
        </div>
      )}
    </section>
  );
}

type OptionGroupProps = {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
};

function OptionGroup({
  label,
  value,
  options,
  onChange,
}: OptionGroupProps) {
  return (
    <div>
      <p className="mb-3 text-[9px] uppercase tracking-[.28em] text-[#9c6746]">
        {label}
      </p>

      <div className="space-y-2">
        {options.map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => onChange(option)}
            className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition ${ 
              value === option
                ? "bg-[#3d2114] text-white shadow-md"
                : "bg-white/60 text-[#5e3a27] hover:bg-white"
            }`}
          >
            <span>{option}</span>

            {value === option && <Check size={14} />}
          </button>
        ))}
      </div>
    </div>
  );
}
