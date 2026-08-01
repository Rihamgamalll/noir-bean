"use client";
import { useEffect,useRef,useState } from "react";
import { Heart,LayoutDashboard,LogIn,LogOut,Menu,Package,Search,ShoppingBag,User,UserPlus,X } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { usePathname,useRouter } from "next/navigation";

const links=[["Home","/#home"],["Our story","/#coffee-story"],["Experience","/#alchemy"],["Menu","/menu"],["Contact","/#contact"]] as const;

export default function Navbar(){
 const root=useRef<HTMLElement>(null),accountRef=useRef<HTMLDivElement>(null),searchInput=useRef<HTMLInputElement>(null);
 const pathname=usePathname(),router=useRouter();
 const [open,setOpen]=useState(false),[searchOpen,setSearchOpen]=useState(false),[accountOpen,setAccountOpen]=useState(false),[query,setQuery]=useState(""),[scrolled,setScrolled]=useState(false),[user,setUser]=useState<any>(null);
 useGSAP(()=>{gsap.from(root.current,{y:-42,opacity:0,duration:1,delay:.15,ease:"power3.out"})},{scope:root});
 useEffect(()=>{const fn=()=>setScrolled(window.scrollY>40||pathname!=="/");fn();addEventListener("scroll",fn,{passive:true});return()=>removeEventListener("scroll",fn)},[pathname]);
 useEffect(()=>{if(searchOpen)setTimeout(()=>searchInput.current?.focus(),100)},[searchOpen]);
 useEffect(()=>{const load=()=>fetch('/api/auth/me',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(d=>setUser(d?.user||null)).catch(()=>setUser(null));const timer=window.setTimeout(load,700);addEventListener('noir-auth-changed',load);return()=>{window.clearTimeout(timer);removeEventListener('noir-auth-changed',load)}},[]);
 useEffect(()=>{setAccountOpen(false);setOpen(false)},[pathname]);
 useEffect(()=>{function outside(e:MouseEvent){if(accountOpen&&!accountRef.current?.contains(e.target as Node))setAccountOpen(false)}document.addEventListener('mousedown',outside);return()=>document.removeEventListener('mousedown',outside)},[accountOpen]);
 const go=(href:string)=>{setAccountOpen(false);setOpen(false);router.push(href)};
 const submit=()=>{router.push(query.trim()?`/menu?q=${encodeURIComponent(query.trim())}`:"/menu");setSearchOpen(false)};
 async function logout(){await fetch('/api/auth/logout',{method:'POST'});setUser(null);setAccountOpen(false);router.push('/');router.refresh()}
 const light=scrolled;
 return <>
 <header ref={root} className="fixed inset-x-0 top-0 z-[150] px-2.5 pt-2.5 sm:px-4 md:px-7 md:pt-5">
  <nav className={`mx-auto flex max-w-[1500px] items-center justify-between rounded-full border px-3 py-2.5 transition-all duration-500 sm:px-4 md:px-7 ${light?"border-[#6d442c]/15 bg-[#f7eadb]/92 text-[#3a2115] shadow-[0_18px_70px_rgba(44,23,13,.16)] backdrop-blur-md md:backdrop-blur-2xl":"border-white/22 bg-[#23140e]/48 text-[#fff8ef] shadow-[0_18px_70px_rgba(27,13,8,.2)] backdrop-blur-sm md:backdrop-blur-xl"}`}>
   <a href="/#home" onClick={()=>setAccountOpen(false)} className="flex min-w-0 items-center gap-2.5 sm:gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-current/20 text-[12px]">NØ</span><span className="min-w-0"><span className="block truncate font-serif text-[17px] leading-none tracking-[.06em] sm:text-[20px]">NØIR BEAN</span><span className="mt-1 hidden text-[7px] uppercase tracking-[.42em] opacity-50 sm:block">Coffee atelier</span></span></a>
   <ul className="hidden items-center gap-7 xl:gap-10 lg:flex">{links.map(([l,h])=><li key={h}><a onClick={()=>setAccountOpen(false)} className="text-[15px] font-medium opacity-85 transition hover:opacity-100 xl:text-[16px]" href={h}>{l}</a></li>)}</ul>
   <div ref={accountRef} className="relative flex items-center gap-1.5 sm:gap-2">
    <button onClick={()=>{setSearchOpen(true);setAccountOpen(false)}} aria-label="Search" className="grid h-10 w-10 place-items-center rounded-full border border-current/15"><Search size={17}/></button>
    <a href="/favorites" onClick={()=>setAccountOpen(false)} className="hidden h-10 w-10 place-items-center rounded-full border border-current/15 sm:grid"><Heart size={17}/></a>
    <button onClick={()=>setAccountOpen(v=>!v)} aria-expanded={accountOpen} aria-label="Account menu" className="grid h-10 w-10 place-items-center rounded-full border border-current/15"><User size={17}/></button>
    <a href="/menu" onClick={()=>setAccountOpen(false)} className={`hidden items-center gap-2 rounded-full px-5 py-2.5 text-[12px] md:flex ${light?"bg-[#4b2b1b] text-white":"bg-[#ead0b2] text-[#2d190f]"}`}><ShoppingBag size={15}/>Explore menu</a>
    <button onClick={()=>{setOpen(v=>!v);setAccountOpen(false)}} className="grid h-10 w-10 place-items-center rounded-full border border-current/15 lg:hidden">{open?<X size={18}/>:<Menu size={18}/>}</button>
    {accountOpen&&<div className="absolute right-0 top-14 z-[220] w-[min(290px,calc(100vw-24px))] overflow-hidden rounded-[24px] border border-[#6d442c]/10 bg-[#fff8ef] text-[#3a2115] shadow-[0_24px_80px_rgba(28,13,7,.35)]">
      <div className="border-b border-[#6d442c]/10 p-5"><strong className="block font-serif text-2xl">{user?.name||'NØIR Guest'}</strong><p className="mt-1 truncate text-xs text-[#8a6045]">{user?.email||'Log in or create an account'}</p>{user?.role==='ADMIN'&&<span className="mt-2 inline-block rounded-full bg-[#3a2115] px-3 py-1 text-[9px] uppercase tracking-wider text-white">Owner · Admin</span>}</div>
      {user?<>
        <button onClick={()=>go('/account')} className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm transition hover:bg-[#f0ddc6]"><User size={18}/>My Account</button>
        <button onClick={()=>go('/orders')} className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm transition hover:bg-[#f0ddc6]"><Package size={18}/>My Orders</button>
        <button onClick={()=>go('/favorites')} className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm transition hover:bg-[#f0ddc6]"><Heart size={18}/>Favorites</button>
        {user.role==='ADMIN'&&<button onClick={()=>go('/admin')} className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm transition hover:bg-[#f0ddc6]"><LayoutDashboard size={18}/>Admin Dashboard</button>}
        <button onClick={logout} className="flex w-full items-center gap-3 border-t border-[#6d442c]/10 px-5 py-4 text-left text-sm text-red-800 transition hover:bg-red-50"><LogOut size={18}/>Log out</button>
      </>:<>
        <button onClick={()=>go('/login')} className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm transition hover:bg-[#f0ddc6]"><LogIn size={18}/>Log in</button>
        <button onClick={()=>go('/register')} className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm transition hover:bg-[#f0ddc6]"><UserPlus size={18}/>Create account</button>
      </>}
    </div>}
   </div>
  </nav>
  {open&&<div className="mx-auto mt-2 max-w-[1500px] rounded-[28px] bg-[#24150f]/97 p-5 text-white shadow-2xl lg:hidden">{links.map(([l,h])=><a key={h} onClick={()=>{setOpen(false);setAccountOpen(false)}} className="block border-b border-white/10 py-4 text-base" href={h}>{l}</a>)}</div>}
 </header>
 {searchOpen&&<div className="fixed inset-0 z-[210] flex items-start justify-center bg-[#1c100b]/70 px-4 pt-[14vh] backdrop-blur-sm md:backdrop-blur-xl" onMouseDown={e=>e.target===e.currentTarget&&setSearchOpen(false)}><div className="w-full max-w-[760px] rounded-[34px] bg-[#f6e9d8] p-5"><div className="flex items-center gap-3 rounded-full bg-white/70 px-5 py-3"><Search size={19}/><input ref={searchInput} value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()} placeholder="Search drinks or croissants..." className="flex-1 bg-transparent outline-none"/><button onClick={()=>setSearchOpen(false)}><X/></button></div><button onClick={submit} className="mt-4 w-full rounded-full bg-[#4a2a1a] py-3 text-white">Show results</button></div></div>}
 </>
}
