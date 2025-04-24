import { useParams } from "wouter";
import { motion } from "framer-motion";
import ZodiacDetailComponent from "@/components/zodiac/ZodiacDetail";

const ZodiacDetail = () => {
  const params = useParams();
  const zodiacName = params.name;
  
  if (!zodiacName) {
    return (
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-heading font-bold text-red-500">
            Burç bulunamadı
          </h1>
          <p className="mt-4">Lütfen geçerli bir burç adı girin.</p>
        </div>
      </main>
    );
  }
  
  return (
    <motion.main 
      className="pt-24 pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-heading font-bold text-center mb-8">
          {zodiacName.charAt(0).toUpperCase() + zodiacName.slice(1)} Burcu
        </h1>
        
        <ZodiacDetailComponent zodiacName={zodiacName} />
      </div>
    </motion.main>
  );
};

export default ZodiacDetail;
