import { motion } from "framer-motion";
import HeroSlider from "@/components/home/HeroSlider";
import BlogSection from "@/components/home/BlogSection";
import ZodiacSection from "@/components/home/ZodiacSection";
import CompatibilitySection from "@/components/home/CompatibilitySection";
import CtaSection from "@/components/home/CtaSection";

const Home = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-20"
    >
      <HeroSlider />
      <BlogSection />
      <ZodiacSection />
      <CompatibilitySection />
      <CtaSection />
    </motion.main>
  );
};

export default Home;
