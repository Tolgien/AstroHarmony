import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface Slide {
  id: number;
  bgImage: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  alignment: "left" | "right" | "center";
}

const slides: Slide[] = [
  {
    id: 1,
    bgImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    title: "Astroloji ile Kendinizi Keşfedin",
    subtitle: "Yıldızlar sizin hikayenizi anlatıyor",
    description: "Doğum haritanızın sırlarını öğrenin ve yaşamınızdaki kozmik etkileri anlayın.",
    buttonText: "Doğum Haritanızı Görün",
    buttonLink: "/birth-chart",
    alignment: "left"
  },
  {
    id: 2,
    bgImage: "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    title: "Gökyüzündeki Uyumunuz",
    subtitle: "Gezegenlerin Dili",
    description: "İlişkilerinizin kozmik harmonisini keşfedin ve yıldızların size ne söylediğini öğrenin.",
    buttonText: "Burç Uyumuna Bakın",
    buttonLink: "/compatibility",
    alignment: "right"
  },
  {
    id: 3,
    bgImage: "https://images.unsplash.com/photo-1505506874110-6a7a69069a08?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&q=80",
    title: "Burç Yorumlarınız Hazır",
    subtitle: "Günlük, Haftalık, Aylık",
    description: "Uzman astrologlarımızın detaylı yorumlarıyla geleceğinize ışık tutun.",
    buttonText: "Yorumları Okuyun",
    buttonLink: "/zodiac-signs",
    alignment: "center"
  }
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);
  
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };
  
  const activeSlide = slides[currentSlide];
  
  // Helper function for content alignment
  const getContentAlignment = (alignment: "left" | "right" | "center") => {
    switch (alignment) {
      case "left":
        return "items-start text-left";
      case "right":
        return "items-end text-right ml-auto";
      case "center":
        return "items-center text-center mx-auto";
    }
  };
  
  return (
    <section className="relative overflow-hidden" style={{ height: "80vh", minHeight: "500px" }}>
      <div className="h-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id}
            className="absolute inset-0 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center z-0" 
              style={{ backgroundImage: `url('${activeSlide.bgImage}')` }} 
            />
            <div className="absolute inset-0 bg-neutral-dark bg-opacity-60 z-10" />
            
            <div className="container mx-auto px-4 z-20">
              <motion.div 
                className={`max-w-xl ${getContentAlignment(activeSlide.alignment)}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="text-accent font-heading text-xl">{activeSlide.subtitle}</span>
                <h2 className="text-4xl md:text-5xl font-heading font-bold mt-3 mb-6">{activeSlide.title}</h2>
                <p className="text-lg mb-8">{activeSlide.description}</p>
                <Link href={activeSlide.buttonLink}>
                  <Button className="bg-accent hover:bg-opacity-80 text-secondary rounded-full px-6 py-3 text-base">
                    <span>{activeSlide.buttonText}</span>
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Slider controls */}
        <button 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 w-10 h-10 bg-primary bg-opacity-50 hover:bg-opacity-80 rounded-full flex items-center justify-center text-white transition-all"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 w-10 h-10 bg-primary bg-opacity-50 hover:bg-opacity-80 rounded-full flex items-center justify-center text-white transition-all"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
        
        {/* Slider dots */}
        <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide 
                  ? "bg-accent" 
                  : "bg-foreground opacity-50"
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
