import { Link } from "wouter";
import { motion } from "framer-motion";
import { Calendar, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const CtaSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')" }}
        />
        <div className="absolute inset-0 bg-secondary bg-opacity-80" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-accent font-heading text-xl">Kişisel Astroloji Danışmanlığı</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mt-4 mb-6">Uzman Astrologlarımızla Bire Bir Görüşün</h2>
          <p className="text-lg mb-8">
            Doğum haritanızı derinlemesine analiz edip, hayatınızın önemli kararlarında size rehberlik eden uzman astrologlarımızla tanışın.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                className="bg-accent hover:bg-opacity-80 text-secondary font-medium px-6 py-6 h-auto rounded-full text-base w-full sm:w-auto"
              >
                <span>Randevu Al</span>
                <Calendar className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                className="border-accent text-accent hover:bg-accent hover:text-secondary font-medium px-6 py-6 h-auto rounded-full text-base w-full sm:w-auto"
              >
                <span>Daha Fazla Bilgi</span>
                <Info className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
