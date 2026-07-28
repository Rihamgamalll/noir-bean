"use client";

import { useEffect, useState } from "react";
import { MapPin, PackageCheck, Phone, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => setOrders(data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return <main className="min-h-screen bg-[#ead9c3] text-[#3a2115]">
    <Navbar />
    <section className="mx-auto max-w-[1200px] px-6 pb-24 pt-36">
      <p className="text-[10px] uppercase tracking-[.4em] text-[#9c6746]">Order history</p>
      <h1 className="mt-4 font-serif text-6xl md:text-7xl">My orders.</h1>
      {loading ? <div className="mt-12 rounded-[36px] bg-white/50 p-14 text-center">Loading...</div> : orders.length ?
        <div className="mt-10 grid gap-5">{orders.map((order) =>
          <article key={order.id} className="rounded-[30px] bg-white/55 p-6">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="flex-1">
                <p className="text-xs tracking-widest text-[#9c6746]">{order.orderNumber}</p>
                <h2 className="mt-2 font-serif text-3xl">{order.status}</h2>
                <p className="mt-2 text-sm opacity-70">{new Date(order.createdAt).toLocaleString()}</p>
                <div className="mt-6 grid gap-3 text-sm">
                  <div className="flex items-start gap-3"><User size={18}/><span>{order.customerName}</span></div>
                  <div className="flex items-start gap-3"><Phone size={18}/><span>{order.customerPhone}</span></div>
                  <div className="flex items-start gap-3"><MapPin size={18}/><span className="whitespace-pre-wrap">{order.address || "No address available"}</span></div>
                  {order.notes && <div className="rounded-2xl bg-white/40 p-4"><strong>Notes</strong><p className="mt-2 whitespace-pre-wrap">{order.notes}</p></div>}
                </div>
              </div>
              <strong className="font-serif text-3xl">{Number(order.total).toFixed(2)} EGP</strong>
            </div>
          </article>)}</div> :
        <div className="mt-12 rounded-[36px] bg-white/50 p-14 text-center"><PackageCheck className="mx-auto" size={36}/><p className="mt-5 text-xl">No account orders yet.</p><a href="/menu" className="mt-6 inline-block rounded-full bg-[#3a2115] px-6 py-3 text-white">Start an order</a></div>}
    </section>
    <Footer />
  </main>;
}
