import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhyChooseTradeHub from "@/components/WhyChooseTradeHub";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <WhyChooseTradeHub />
      <HowItWorks />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
