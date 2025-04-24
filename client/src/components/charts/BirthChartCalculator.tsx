import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { zodiacCalculate } from "@/lib/zodiac";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "İsim en az 2 karakter olmalıdır.",
  }),
  birthDate: z.string().min(1, {
    message: "Doğum tarihi gereklidir.",
  }),
  birthTime: z.string().min(1, {
    message: "Doğum saati gereklidir.",
  }),
  birthPlace: z.string().min(2, {
    message: "Doğum yeri en az 2 karakter olmalıdır.",
  }),
});

type FormData = z.infer<typeof formSchema>;

interface BirthChartCalculatorProps {
  userId?: number;
}

const BirthChartCalculator = ({ userId }: BirthChartCalculatorProps) => {
  const [chartCalculated, setChartCalculated] = useState(false);
  const [chartData, setChartData] = useState<any>(null);
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      birthTime: "",
      birthPlace: "",
    },
  });
  
  const birthChartMutation = useMutation({
    mutationFn: async (data: FormData & { userId?: number }) => {
      if (userId) {
        // If logged in, save to database
        return apiRequest("POST", "/api/birth-charts", {
          ...data,
          userId,
          chartData: JSON.stringify(zodiacCalculate(data)),
        });
      }
      // Otherwise just calculate and return
      return new Response(JSON.stringify({ success: true }));
    },
    onSuccess: () => {
      if (userId) {
        toast({
          title: "Doğum haritanız kaydedildi!",
          description: "Hesabınızdan erişebilirsiniz.",
        });
      }
      
      // Calculate chart data
      const calculatedData = zodiacCalculate(form.getValues());
      setChartData(calculatedData);
      setChartCalculated(true);
    },
    onError: (error) => {
      toast({
        title: "Doğum haritası hesaplanamadı",
        description: error instanceof Error ? error.message : "Bir hata oluştu, lütfen tekrar deneyin.",
        variant: "destructive",
      });
    },
  });
  
  function onSubmit(data: FormData) {
    birthChartMutation.mutate({
      ...data,
      userId,
    });
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-secondary">
          <CardHeader>
            <CardTitle className="text-xl font-heading">Doğum Haritası Hesaplayıcı</CardTitle>
            <CardDescription>
              Doğum tarihiniz, saatiniz ve yeriniz gibi bilgileri girerek ücretsiz doğum haritanızı çıkarabilirsiniz.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>İsim</FormLabel>
                      <FormControl>
                        <Input placeholder="Adınız Soyadınız" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Doğum Tarihi</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="birthTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Doğum Saati</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormDescription>
                        Saati bilmiyorsanız yaklaşık olarak girebilirsiniz. Daha doğru sonuçlar için kesin saati öğrenmenizi öneririz.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="birthPlace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Doğum Yeri</FormLabel>
                      <FormControl>
                        <Input placeholder="Şehir, Ülke" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-accent text-secondary hover:bg-accent/90"
                  disabled={birthChartMutation.isPending}
                >
                  {birthChartMutation.isPending ? "Hesaplanıyor..." : "Doğum Haritamı Hesapla"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-secondary h-full">
          <CardHeader>
            <CardTitle className="text-xl font-heading">
              {chartCalculated ? "Doğum Haritanız" : "Doğum Haritası Nedir?"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartCalculated && chartData ? (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-48 h-48 rounded-full bg-primary/30 mx-auto relative overflow-hidden">
                    <svg 
                      viewBox="0 0 200 200" 
                      className="absolute inset-0 w-full h-full"
                    >
                      {/* Chart visualization would go here in a real application */}
                      <circle cx="100" cy="100" r="80" fill="none" stroke="hsl(var(--accent))" strokeWidth="1" />
                      <circle cx="100" cy="100" r="60" fill="none" stroke="hsl(var(--accent))" strokeWidth="1" />
                      <circle cx="100" cy="100" r="40" fill="none" stroke="hsl(var(--accent))" strokeWidth="1" />
                      <path d="M100,20 L100,180" stroke="hsl(var(--accent))" strokeWidth="0.5" />
                      <path d="M20,100 L180,100" stroke="hsl(var(--accent))" strokeWidth="0.5" />
                      <path d="M30,30 L170,170" stroke="hsl(var(--accent))" strokeWidth="0.5" />
                      <path d="M30,170 L170,30" stroke="hsl(var(--accent))" strokeWidth="0.5" />
                      
                      {/* Planet symbols would be positioned based on actual calculations */}
                      <text x="120" y="40" fill="hsl(var(--accent))" fontSize="10">☉</text>
                      <text x="60" y="60" fill="hsl(var(--accent))" fontSize="10">☽</text>
                      <text x="150" y="100" fill="hsl(var(--accent))" fontSize="10">☿</text>
                      <text x="130" y="140" fill="hsl(var(--accent))" fontSize="10">♀</text>
                      <text x="40" y="120" fill="hsl(var(--accent))" fontSize="10">♂</text>
                      <text x="100" y="170" fill="hsl(var(--accent))" fontSize="10">♃</text>
                    </svg>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-heading mb-2">Ana Gezegenler</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Güneş (☉):</span>
                      <span className="text-accent">{chartData.sun}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Ay (☽):</span>
                      <span className="text-accent">{chartData.moon}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Yükselen:</span>
                      <span className="text-accent">{chartData.ascendant}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Merkür (☿):</span>
                      <span className="text-accent">{chartData.mercury}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Venüs (♀):</span>
                      <span className="text-accent">{chartData.venus}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Mars (♂):</span>
                      <span className="text-accent">{chartData.mars}</span>
                    </li>
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-heading mb-2">Evler</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Doğum haritanızdaki evler hayatınızın farklı alanlarını temsil eder:
                  </p>
                  <ul className="grid grid-cols-2 gap-2 text-sm">
                    <li><span className="text-accent">1. Ev:</span> Kimlik</li>
                    <li><span className="text-accent">2. Ev:</span> Değerler</li>
                    <li><span className="text-accent">3. Ev:</span> İletişim</li>
                    <li><span className="text-accent">4. Ev:</span> Ev/Aile</li>
                    <li><span className="text-accent">5. Ev:</span> Yaratıcılık</li>
                    <li><span className="text-accent">6. Ev:</span> Sağlık</li>
                    <li><span className="text-accent">7. Ev:</span> İlişkiler</li>
                    <li><span className="text-accent">8. Ev:</span> Dönüşüm</li>
                    <li><span className="text-accent">9. Ev:</span> Felsefe</li>
                    <li><span className="text-accent">10. Ev:</span> Kariyer</li>
                    <li><span className="text-accent">11. Ev:</span> Topluluk</li>
                    <li><span className="text-accent">12. Ev:</span> Bilinçaltı</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p>
                  Doğum haritası, doğduğunuz an gökyüzündeki gezegenlerin ve yıldızların konumunu gösteren 
                  kişisel bir astrolojik haritadır. Bu harita, karakterinizi, yeteneklerinizi, zorluklarınızı 
                  ve hayat yolculuğunuzu anlamanıza yardımcı olur.
                </p>
                <div className="grid grid-cols-2 gap-4 my-6">
                  <div className="bg-primary/20 p-4 rounded-lg text-center">
                    <div className="text-4xl text-accent mb-2">☉</div>
                    <h4 className="font-heading mb-1">Güneş</h4>
                    <p className="text-xs text-muted-foreground">Temel karakteriniz</p>
                  </div>
                  <div className="bg-primary/20 p-4 rounded-lg text-center">
                    <div className="text-4xl text-accent mb-2">☽</div>
                    <h4 className="font-heading mb-1">Ay</h4>
                    <p className="text-xs text-muted-foreground">Duygusal benliğiniz</p>
                  </div>
                  <div className="bg-primary/20 p-4 rounded-lg text-center">
                    <div className="text-4xl text-accent mb-2">⬆️</div>
                    <h4 className="font-heading mb-1">Yükselen</h4>
                    <p className="text-xs text-muted-foreground">Dış görünüşünüz</p>
                  </div>
                  <div className="bg-primary/20 p-4 rounded-lg text-center">
                    <div className="text-4xl text-accent mb-2">♀</div>
                    <h4 className="font-heading mb-1">Venüs</h4>
                    <p className="text-xs text-muted-foreground">Aşk tarzınız</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Doğum bilgilerinizi girerek hemen kişisel doğum haritanızı çıkarabilirsiniz. 
                  Haritanız, gezegenlerin burçlardaki ve evlerdeki konumlarını gösterecektir.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className={chartCalculated ? "block" : "hidden"}>
            <Button variant="outline" onClick={() => {
              setChartCalculated(false);
              setChartData(null);
              form.reset();
            }} className="w-full">
              Yeni Doğum Haritası Hesapla
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default BirthChartCalculator;
