"use client";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { menuItems } from "@/lib/menu-data";
import { Heart, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
export default function FavoritesPage(){
 const [ids,setIds]=useState<string[]>([]);
 useEffect(()=>setIds(JSON.parse(localStorage.getItem('noir-favorites')||'[]')),[]);
 const remove=(id:string)=>{const next=ids.filter(x=>x!==id);setIds(next);localStorage.setItem('noir-favorites',JSON.stringify(next));};
 const items=menuItems.filter(x=>ids.includes(x.id));
 return <main className="min-h-screen bg-[#ead9c3] text-[#3a2115]"><Navbar/><section className="mx-auto max-w-[1450px] px-6 pb-24 pt-36"><p className="text-[10px] uppercase tracking-[.4em] text-[#9c6746]">Saved rituals</p><h1 className="mt-4 font-serif text-6xl md:text-8xl">Favorites.</h1>{items.length===0?<div className="mt-12 rounded-[36px] bg-white/45 p-16 text-center"><Heart className="mx-auto"/><p className="mt-4 text-xl">No favorites yet.</p><a href="/menu" className="mt-6 inline-block rounded-full bg-[#3a2115] px-6 py-3 text-white">Explore menu</a></div>:<div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{items.map(item=><article key={item.id} className="rounded-[32px] bg-white/55 p-5 shadow-xl"><div className="relative aspect-square overflow-hidden rounded-[26px] bg-[#dfc09c]"><Image src={item.image} alt={item.name} fill className="object-contain p-4"/></div><div className="mt-5 flex items-start justify-between"><div><h2 className="font-serif text-3xl">{item.name}</h2><p className="mt-2 text-sm text-[#765039]">{item.note}</p></div><button onClick={()=>remove(item.id)} className="text-red-700"><Heart fill="currentColor"/></button></div><a href={`/menu?q=${encodeURIComponent(item.name)}`} className="mt-5 flex items-center justify-center gap-2 rounded-full bg-[#3a2115] px-5 py-3 text-white"><ShoppingBag size={16}/>Customize</a></article>)}</div>}</section><Footer/></main>
}
