import { useQuery } from "@tanstack/react-query";
import { ZodiacSign } from "@shared/schema";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface ZodiacDetailProps {
  zodiacName: string;
}

const ZodiacDetail = ({ zodiacName }: ZodiacDetailProps) => {
  const { data: sign, isLoading, error } = useQuery<ZodiacSign>({
    queryKey: [`/api/zodiac-signs/${zodiacName}`],
  });
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-secondary shadow-xl overflow-hidden">
          <CardHeader className="text-center pb-2">
            <div className="w-20 h-20 rounded-full bg-primary mx-auto flex items-center justify-center mb-4">
              <Skeleton className="w-10 h-10 rounded-full" />
            </div>
            <Skeleton className="h-10 w-40 mx-auto mb-2" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </CardHeader>
          <CardContent className="p-6">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-background rounded-lg p-4">
                  <Skeleton className="h-5 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error || !sign) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-heading font-bold text-red-500">
          Burç bilgileri yüklenemedi
        </h2>
        <p className="mt-2">
          Lütfen daha sonra tekrar deneyin veya başka bir burç seçin.
        </p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-secondary shadow-xl overflow-hidden">
          <CardHeader className="text-center pb-2">
            <div className="w-20 h-20 rounded-full bg-primary mx-auto flex items-center justify-center mb-4">
              <span className="text-accent text-4xl" dangerouslySetInnerHTML={{ __html: sign.symbol }} />
            </div>
            <CardTitle className="text-3xl font-heading">{sign.name}</CardTitle>
            <p className="text-muted-foreground">{sign.dateRange}</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-background rounded-lg p-4">
                <h3 className="text-lg font-heading font-semibold mb-2 text-accent">Element</h3>
                <p>{sign.element}</p>
              </div>
              <div className="bg-background rounded-lg p-4">
                <h3 className="text-lg font-heading font-semibold mb-2 text-accent">Gezegen</h3>
                <p>{sign.planet}</p>
              </div>
              <div className="bg-background rounded-lg p-4">
                <h3 className="text-lg font-heading font-semibold mb-2 text-accent">Uyumlu Burçlar</h3>
                <p>{sign.compatibility}</p>
              </div>
            </div>
            
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="description">Genel Özellikler</TabsTrigger>
                <TabsTrigger value="strengths">Güçlü Yönler</TabsTrigger>
                <TabsTrigger value="weaknesses">Zayıf Yönler</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4 p-4 bg-background rounded-lg">
                <p>{sign.description}</p>
              </TabsContent>
              <TabsContent value="strengths" className="mt-4 p-4 bg-background rounded-lg">
                <p>{sign.strengths}</p>
              </TabsContent>
              <TabsContent value="weaknesses" className="mt-4 p-4 bg-background rounded-lg">
                <p>{sign.weaknesses}</p>
              </TabsContent>
            </Tabs>
            
            <div className="mt-8">
              <h3 className="text-xl font-heading font-semibold mb-4 text-accent">Kişilik Özellikleri</h3>
              <p className="mb-4">{sign.traits}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ZodiacDetail;
