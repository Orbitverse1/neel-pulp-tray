import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FactoryJourney from "@/components/FactoryJourney";
import EggFill from "@/components/EggFill";
import Products from "@/components/Products";
import FactorySection from "@/components/FactorySection";
import Sustainability from "@/components/Sustainability";
import Enquiry from "@/components/Enquiry";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";

export default function Page() {
  return (
    <SmoothScroll>
      <Cursor />
      <Navbar />
      <main id="main">
        <Hero />
        <FactoryJourney />
        <EggFill />
        <Products />
        <FactorySection />
        <Sustainability />
        <Enquiry />
      </main>
      <Footer />
    </SmoothScroll>
  );
}