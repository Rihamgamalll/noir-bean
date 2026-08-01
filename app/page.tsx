import dynamic from "next/dynamic";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

const CoffeeStory = dynamic(() => import("@/components/CoffeeStory"));
const CoffeeAlchemy = dynamic(() => import("@/components/CoffeeAlchemy"));
const DrinkMenu = dynamic(() => import("@/components/DrinkMenu"));
const ClosingScene = dynamic(() => import("@/components/ClosingScene"));
const Footer = dynamic(() => import("@/components/Footer"));

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <CoffeeStory />
      <CoffeeAlchemy />
      <DrinkMenu />
      <ClosingScene />
      <Footer />
    </main>
  );
}
