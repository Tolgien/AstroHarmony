import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ZodiacSign } from "@shared/schema";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CompatibilityChecker = () => {
  const [firstSign, setFirstSign] = useState<string>("");
  const [secondSign, setSecondSign] = useState<string>("");
  const [compatibilityChecked, setCompatibilityChecked] = useState(false);
  const { toast } = useToast();

  const { data: zodiacSigns, isLoading } = useQuery<ZodiacSign[]>({
    queryKey: ["/api/zodiac-signs"],
  });

  // Get the selected sign details
  const getSignDetails = (name: string) => {
    return zodiacSigns?.find(sign => sign.name === name);
  };

  const firstSignDetails = getSignDetails(firstSign);
  const secondSignDetails = getSignDetails(secondSign);

  // Calculate compatibility score based on various factors
  const calculateCompatibility = () => {
    if (!firstSignDetails || !secondSignDetails) return null;

    // In a real application, this would be a more complex algorithm
    // For now, we'll use a simple rule-based system
    
    // 1. Element compatibility
    let elementScore = 0;
    if (firstSignDetails.element === secondSignDetails.element) {
      // Same element - high compatibility
      elementScore = 90;
    } else {
      // Check complementary elements
      const complementary: Record<string, string[]> = {
        "Ateş": ["Hava"],
        "Hava": ["Ateş"],
        "Toprak": ["Su"],
        "Su": ["Toprak"]
      };
      
      if (complementary[firstSignDetails.element]?.includes(secondSignDetails.element)) {
        elementScore = 80;
      } else {
        // Challenging elements
        elementScore = 50;
      }
    }
    
    // 2. Check if they're in complementary compatibility list
    let compatibilityScore = 0;
    if (firstSignDetails.compatibility.includes(secondSignDetails.name)) {
      compatibilityScore = 90;
    } else if (secondSignDetails.compatibility.includes(firstSignDetails.name)) {
      compatibilityScore = 90;
    } else {
      compatibilityScore = 60;
    }
    
    // 3. Calculate relationship aspects
    const romanticScore = (elementScore + compatibilityScore) / 2;
    const friendshipScore = Math.min(90, elementScore + 10); // Friendship is easier
    const workScore = (elementScore * 0.5) + (Math.random() * 30 + 50); // Work has more variables
    
    // Overall score is weighted average
    const overallScore = Math.round((romanticScore * 0.4) + (friendshipScore * 0.3) + (workScore * 0.3));
    
    return {
      overall: overallScore,
      romantic: Math.round(romanticScore),
      friendship: Math.round(friendshipScore),
      work: Math.round(workScore),
      description: getCompatibilityDescription(overallScore)
    };
  };
  
  const getCompatibilityDescription = (score: number) => {
    if (score >= 85) {
      return "Mükemmel bir uyum! Bu iki burç birbirini tamamlayan ve güçlendiren özelliklere sahip. İlişkide karşılıklı anlayış ve destek ön planda olacaktır.";
    } else if (score >= 70) {
      return "İyi bir uyum. Aranızdaki farklılıklar ilişkinizi zenginleştirebilir. Birbirinizden öğreneceğiniz çok şey var.";
    } else if (score >= 50) {
      return "Orta düzeyde uyum. Bazı zorluklarla karşılaşabilirsiniz, ancak iletişim ve anlayışla bunların üstesinden gelebilirsiniz.";
    } else {
      return "Zorlayıcı bir uyum. Bu ilişki her iki taraf için de büyüme fırsatları sunabilir, ancak sabır ve karşılıklı anlayış gerektirecektir.";
    }
  };
  
  const compatibilityResult = firstSign && secondSign ? calculateCompatibility() : null;
  
  const handleCompatibilityCheck = () => {
    if (firstSign && secondSign) {
      setCompatibilityChecked(true);
      toast({
        title: "Burç uyumu hesaplandı!",
        description: `${firstSign} ve ${secondSign} uyumu incelendi.`,
      });
    } else {
      toast({
        title: "Lütfen iki burç seçin",
        description: "Uyum hesaplaması için iki burç seçmelisiniz.",
        variant: "destructive",
      });
    }
  };
  
  const resetCompatibility = () => {
    setFirstSign("");
    setSecondSign("");
    setCompatibilityChecked(false);
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-500";
    if (score >= 70) return "text-blue-500";
    if (score >= 50) return "text-amber-500";
    return "text-red-500";
  };
  
  const getProgressColor = (score: number) => {
    if (score >= 85) return "bg-green-500";
    if (score >= 70) return "bg-blue-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-red-500";
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-secondary shadow-xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-heading">Burç Uyumu Hesaplayıcı</CardTitle>
            <CardDescription>
              İki burcun romantik ilişki, arkadaşlık ve iş ilişkisindeki uyumunu öğrenin.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {compatibilityChecked && compatibilityResult ? (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 py-4">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-2 mx-auto">
                      <span className="text-accent text-4xl" dangerouslySetInnerHTML={{ __html: firstSignDetails?.symbol || "" }} />
                    </div>
                    <h3 className="font-heading">{firstSign}</h3>
                    <p className="text-xs text-muted-foreground">{firstSignDetails?.element}</p>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <Heart className="w-10 h-10 text-accent animate-pulse" />
                  </div>
                  
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-2 mx-auto">
                      <span className="text-accent text-4xl" dangerouslySetInnerHTML={{ __html: secondSignDetails?.symbol || "" }} />
                    </div>
                    <h3 className="font-heading">{secondSign}</h3>
                    <p className="text-xs text-muted-foreground">{secondSignDetails?.element}</p>
                  </div>
                </div>
                
                <div className="text-center my-6">
                  <h3 className="text-xl font-heading mb-3">Genel Uyum Puanınız</h3>
                  <div className={`text-5xl font-bold ${getScoreColor(compatibilityResult.overall)}`}>
                    {compatibilityResult.overall}%
                  </div>
                  <div className="flex items-center mt-2 justify-center">
                    <Sparkles className="w-4 h-4 text-accent mr-2" />
                    <p className="text-sm">{compatibilityResult.description}</p>
                  </div>
                </div>
                
                <Tabs defaultValue="romantic">
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="romantic">Romantik</TabsTrigger>
                    <TabsTrigger value="friendship">Arkadaşlık</TabsTrigger>
                    <TabsTrigger value="work">İş</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="romantic" className="pt-4">
                    <div className="mb-2 flex justify-between">
                      <span>Romantik Uyum</span>
                      <span className={getScoreColor(compatibilityResult.romantic)}>{compatibilityResult.romantic}%</span>
                    </div>
                    <Progress value={compatibilityResult.romantic} className="h-2" indicatorClassName={getProgressColor(compatibilityResult.romantic)} />
                    <p className="mt-4 text-sm">
                      Romantik ilişkide iki burcun birbirine çekim gücü, duygusal bağlantısı ve uzun vadeli uyumu hakkında fikir verir.
                    </p>
                  </TabsContent>
                  
                  <TabsContent value="friendship" className="pt-4">
                    <div className="mb-2 flex justify-between">
                      <span>Arkadaşlık Uyumu</span>
                      <span className={getScoreColor(compatibilityResult.friendship)}>{compatibilityResult.friendship}%</span>
                    </div>
                    <Progress value={compatibilityResult.friendship} className="h-2" indicatorClassName={getProgressColor(compatibilityResult.friendship)} />
                    <p className="mt-4 text-sm">
                      Arkadaşlık ilişkisinde iki burcun ortak ilgi alanları, iletişimi ve eğlence anlayışı hakkında fikir verir.
                    </p>
                  </TabsContent>
                  
                  <TabsContent value="work" className="pt-4">
                    <div className="mb-2 flex justify-between">
                      <span>İş Uyumu</span>
                      <span className={getScoreColor(compatibilityResult.work)}>{compatibilityResult.work}%</span>
                    </div>
                    <Progress value={compatibilityResult.work} className="h-2" indicatorClassName={getProgressColor(compatibilityResult.work)} />
                    <p className="mt-4 text-sm">
                      İş ilişkisinde iki burcun çalışma tarzları, iletişim becerileri ve ortak hedeflere ulaşma potansiyelleri hakkında fikir verir.
                    </p>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
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
                      {isLoading ? (
                        <div className="p-2">
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      ) : (
                        zodiacSigns?.map((sign) => (
                          <SelectItem key={sign.id} value={sign.name}>
                            <span dangerouslySetInnerHTML={{ __html: sign.symbol }} className="mr-2"></span>
                            {sign.name}
                          </SelectItem>
                        ))
                      )}
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
                      {isLoading ? (
                        <div className="p-2">
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      ) : (
                        zodiacSigns?.map((sign) => (
                          <SelectItem key={sign.id} value={sign.name}>
                            <span dangerouslySetInnerHTML={{ __html: sign.symbol }} className="mr-2"></span>
                            {sign.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-2 text-center mt-4">
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
            )}
          </CardContent>
          
          <CardFooter className={compatibilityChecked ? "flex justify-center pt-0" : "hidden"}>
            <Button 
              variant="outline" 
              className="text-accent border-accent hover:bg-accent hover:text-secondary"
              onClick={resetCompatibility}
            >
              <X className="mr-2 h-4 w-4" />
              <span>Yeni Uyum Hesapla</span>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default CompatibilityChecker;
