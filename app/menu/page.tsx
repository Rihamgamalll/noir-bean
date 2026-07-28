import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MenuExperience from "@/components/MenuExperience";

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-[#ead9c3]">
      <Navbar />
      <MenuExperience />
      <Footer />
    </main>
  );
}
