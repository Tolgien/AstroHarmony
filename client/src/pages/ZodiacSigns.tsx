import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ZodiacSign } from "@shared/schema";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ZodiacCard from "@/components/zodiac/ZodiacCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ZodiacSigns = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [elementFilter, setElementFilter] = useState("all");
  
  const { data: zodiacSigns, isLoading, error } = useQuery<ZodiacSign[]>({
    queryKey: ["/api/zodiac-signs"],
  });
  
  // Filter zodiac signs based on search term and element filter
  const filteredSigns = zodiacSigns?.filter(sign => {
    const matchesSearch = sign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesElement = elementFilter === "all" ? true : sign.element === elementFilter;
    return matchesSearch && matchesElement;
  });
  
  // Get unique elements for filter dropdown
  const uniqueElements = zodiacSigns 
    ? Array.from(new Set(zodiacSigns.map(sign => sign.element)))
    : [];
  
  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Burç Rehberi</h1>
          <p className="text-lg max-w-2xl mx-auto">
            12 burç hakkında detaylı bilgiler, özellikleri ve astrolojik analizler. Kendi burcunuzu 
            veya merak ettiğiniz burçları keşfedin.
          </p>
        </motion.div>
        
        <motion.div 
          className="max-w-2xl mx-auto mb-10 flex flex-col md:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Burç ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={elementFilter} onValueChange={setElementFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Element" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Elementler</SelectItem>
              {uniqueElements.map((element) => (
                <SelectItem key={element} value={element}>{element}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
        
        <div className="py-8">
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
            <div className="text-center text-red-500 my-8">
              <p>Burç bilgileri yüklenirken bir hata oluştu.</p>
              <p className="text-sm mt-2">Lütfen daha sonra tekrar deneyin.</p>
            </div>
          ) : (
            <>
              {filteredSigns && filteredSigns.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, staggerChildren: 0.05 }}
                >
                  {filteredSigns.map((sign) => (
                    <ZodiacCard key={sign.id} sign={sign} />
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">
                    Aramanıza uygun burç bulunamadı.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
        
        <motion.div 
          className="mt-16 bg-secondary rounded-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-heading font-bold mb-4">Burçlar Hakkında</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="mb-4">
                Astrolojide, 12 burç Zodyak kuşağını oluşturur ve her biri yaklaşık 30 derecelik bir bölümü kapsar. 
                Her burç, belirli kişilik özellikleri, davranış kalıpları ve yaşam tarzları ile ilişkilendirilir.
              </p>
              <p>
                Burçlar dört elemente ayrılır: Ateş (Koç, Aslan, Yay), Toprak (Boğa, Başak, Oğlak), 
                Hava (İkizler, Terazi, Kova) ve Su (Yengeç, Akrep, Balık). Bu elementler, burçların 
                temel enerji ve mizaç niteliklerini belirler.
              </p>
            </div>
            <div>
              <p className="mb-4">
                Ayrıca burçlar üç niteliğe göre de gruplanır: Kardinal (Koç, Yengeç, Terazi, Oğlak), 
                Sabit (Boğa, Aslan, Akrep, Kova) ve Değişken (İkizler, Başak, Yay, Balık). Bu nitelikler, 
                burçların hayatla nasıl etkileşime girdiğini ve değişimle nasıl başa çıktığını gösterir.
              </p>
              <p>
                Doğum haritanızda Güneş burcunuzun yanı sıra, Ay burcunuz, Yükselen burcunuz ve diğer 
                gezegenlerin burçları da karakterinizin farklı yönlerini temsil eder. Bu nedenle, 
                sadece Güneş burcunuza odaklanmak yerine, tüm doğum haritanızı incelemek daha 
                kapsamlı bir astrolojik anlayış sağlar.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default ZodiacSigns;
