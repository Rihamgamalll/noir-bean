import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CoffeeStory from "@/components/CoffeeStory";
import CoffeeAlchemy from "@/components/CoffeeAlchemy";
import DrinkMenu from "@/components/DrinkMenu";
import ClosingScene from "@/components/ClosingScene";
import Footer from "@/components/Footer";

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
