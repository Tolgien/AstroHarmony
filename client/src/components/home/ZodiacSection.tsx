import { useQuery } from "@tanstack/react-query";
import { ZodiacSign } from "@shared/schema";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import ZodiacCard from "@/components/zodiac/ZodiacCard";

const ZodiacSection = () => {
  const { data: zodiacSigns, isLoading, error } = useQuery<ZodiacSign[]>({
    queryKey: ["/api/zodiac-signs"],
  });
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-heading font-bold relative inline-block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="relative z-10">Burç Rehberi</span>
            <span className="absolute bottom-0 left-0 w-full h-3 bg-primary bg-opacity-30 -z-10"></span>
          </motion.h2>
          <motion.p 
            className="text-lg mt-4 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Burçların özellikleri, uyumları ve günlük yorumlarını keşfedin.
          </motion.p>
        </div>
        
        {/* Zodiac Wheel (Desktop) */}
        <div className="hidden lg:flex justify-center mb-16 relative">
          <motion.div 
            className="relative w-96 h-96"
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          >
            <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <defs>
                <linearGradient id="zodiacWheelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4A2C8F" />
                  <stop offset="100%" stopColor="#1E1D3F" />
                </linearGradient>
              </defs>
              
              {/* Outer circle */}
              <circle cx="250" cy="250" r="240" fill="none" stroke="url(#zodiacWheelGradient)" strokeWidth="2" />
              
              {/* Inner circle */}
              <circle cx="250" cy="250" r="200" fill="none" stroke="url(#zodiacWheelGradient)" strokeWidth="1" />
              
              {/* Zodiac segments - 12 segments of 30 degrees each */}
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const x1 = 250 + 200 * Math.cos(angle);
                const y1 = 250 + 200 * Math.sin(angle);
                const x2 = 250 + 240 * Math.cos(angle);
                const y2 = 250 + 240 * Math.sin(angle);
                
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#E2C17F"
                    strokeWidth="1"
                  />
                );
              })}
              
              {/* Zodiac symbols - positioned in the middle of each segment */}
              {zodiacSigns?.map((sign, i) => {
                const angle = ((i * 30 + 15) * Math.PI) / 180;
                const x = 250 + 220 * Math.cos(angle);
                const y = 250 + 220 * Math.sin(angle);
                
                return (
                  <text
                    key={i}
                    x={x}
                    y={y}
                    fill="#E2C17F"
                    fontSize="18"
                    fontFamily="serif"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {sign.symbol}
                  </text>
                );
              })}
            </svg>
          </motion.div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-secondary rounded-full w-24 h-24 flex items-center justify-center">
            <span className="text-accent text-4xl">☉</span>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-secondary bg-opacity-70 rounded-xl p-5 flex flex-col items-center text-center">
                <Skeleton className="w-16 h-16 rounded-full mb-4" />
                <Skeleton className="h-5 w-16 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            Burç bilgileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {zodiacSigns?.map((sign) => (
              <ZodiacCard key={sign.id} sign={sign} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ZodiacSection;
