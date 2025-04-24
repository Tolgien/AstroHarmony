import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ZodiacSign } from "@shared/schema";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const CompatibilitySection = () => {
  const [firstSign, setFirstSign] = useState<string>("");
  const [secondSign, setSecondSign] = useState<string>("");
  
  const { data: zodiacSigns, isLoading } = useQuery<ZodiacSign[]>({
    queryKey: ["/api/zodiac-signs"],
  });
  
  const handleCompatibilityCheck = () => {
    if (firstSign && secondSign) {
      // In a production app, this would make an API call
      // or navigate to a compatibility results page
      window.location.href = `/compatibility?first=${firstSign}&second=${secondSign}`;
    }
  };
  
  return (
    <section className="py-16 bg-primary bg-opacity-20 relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-heading font-bold relative inline-block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="relative z-10">Burç Uyumu</span>
            <span className="absolute bottom-0 left-0 w-full h-3 bg-accent bg-opacity-30 -z-10"></span>
          </motion.h2>
          <motion.p 
            className="text-lg mt-4 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Aşk, arkadaşlık ve iş hayatında burçlar arası uyumu keşfedin.
          </motion.p>
        </div>
        
        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Card className="bg-secondary shadow-xl overflow-hidden">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-foreground text-sm font-medium mb-2">İlk Burç</label>
                  <Select 
                    value={firstSign} 
                    onValueChange={setFirstSign}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-full bg-background text-foreground rounded-lg border-gray-700">
                      <SelectValue placeholder="Burç Seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {zodiacSigns?.map((sign) => (
                        <SelectItem key={sign.id} value={sign.name}>
                          {sign.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-foreground text-sm font-medium mb-2">İkinci Burç</label>
                  <Select 
                    value={secondSign} 
                    onValueChange={setSecondSign}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-full bg-background text-foreground rounded-lg border-gray-700">
                      <SelectValue placeholder="Burç Seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {zodiacSigns?.map((sign) => (
                        <SelectItem key={sign.id} value={sign.name}>
                          {sign.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-2 text-center">
                  <Button 
                    variant="default" 
                    className="bg-accent hover:bg-opacity-80 text-secondary font-medium px-6 py-3 rounded-full"
                    onClick={handleCompatibilityCheck}
                    disabled={!firstSign || !secondSign}
                  >
                    <span>Uyumu Göster</span>
                    <Heart className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Burç uyumu analizi, karakteristik özellikleriniz arasındaki uyumu gösterir. Doğum haritası analizi için doğum tarihi, saati ve yerini içeren detaylı bir analiz yaptırabilirsiniz.
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="p-8 bg-background bg-opacity-50 border-t border-gray-700">
              <div className="flex flex-col md:flex-row items-center justify-between w-full">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="w-16 h-16 rounded-full mr-4 flex items-center justify-center bg-primary">
                    <span className="text-accent text-2xl">🔭</span>
                  </div>
                  <div>
                    <h3 className="font-heading font-bold">Detaylı Doğum Haritası</h3>
                    <p className="text-sm text-muted-foreground">Hayatınızın tüm alanlarına dair derinlemesine analiz</p>
                  </div>
                </div>
                <Link href="/birth-chart">
                  <Button className="bg-primary hover:bg-opacity-80 text-foreground rounded-full">
                    <span>Hemen Başla</span>
                    <Heart className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default CompatibilitySection;
