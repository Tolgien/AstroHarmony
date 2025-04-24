import { useState } from "react";
import { Link, useLocation } from "wouter";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User, LogIn, Eye, EyeOff } from "lucide-react";

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Kullanıcı adı en az 3 karakter olmalıdır.",
  }),
  password: z.string().min(6, {
    message: "Şifre en az 6 karakter olmalıdır.",
  }),
});

type FormData = z.infer<typeof formSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  const loginMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return apiRequest("POST", "/api/login", data);
    },
    onSuccess: async (response) => {
      const userData = await response.json();
      toast({
        title: "Giriş başarılı!",
        description: `Hoş geldiniz, ${userData.username}!`,
      });
      
      // Redirect to home page after successful login
      setTimeout(() => setLocation("/"), 1000);
    },
    onError: (error) => {
      toast({
        title: "Giriş yapılamadı",
        description: error instanceof Error ? error.message : "Kullanıcı adı veya şifre hatalı.",
        variant: "destructive",
      });
    },
  });
  
  function onSubmit(data: FormData) {
    loginMutation.mutate(data);
  }
  
  return (
    <motion.main 
      className="pt-24 pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Card className="bg-secondary">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <User className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-2xl font-heading">Giriş Yap</CardTitle>
              <CardDescription>
                Hesabınıza giriş yaparak kişisel astroloji profilinize erişin.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kullanıcı Adı</FormLabel>
                        <FormControl>
                          <Input placeholder="kullanici_adi" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Şifre</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="••••••••" 
                              {...field} 
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-accent text-secondary hover:bg-accent/90"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      "Giriş yapılıyor..."
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        <span>Giriş Yap</span>
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-muted-foreground">
                <span className="text-accent hover:underline cursor-pointer">
                  Şifrenizi mi unuttunuz?
                </span>
              </div>
              
              <div className="text-sm text-center">
                Hesabınız yok mu?{" "}
                <Link href="/register">
                  <span className="text-accent font-medium hover:underline cursor-pointer">
                    Hemen Kaydolun
                  </span>
                </Link>
              </div>
            </CardFooter>
          </Card>
          
          <motion.div 
            className="mt-8 bg-primary/20 p-5 rounded-xl text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-heading mb-2">Hesabınızla Neler Yapabilirsiniz</h3>
            <ul className="text-sm text-muted-foreground">
              <li>• Doğum haritanızı kaydedebilir ve dilediğiniz zaman erişebilirsiniz</li>
              <li>• Günlük, haftalık ve aylık burç yorumlarınızı takip edebilirsiniz</li>
              <li>• Astroloji uzmanlarımızla özel görüşmeler ayarlayabilirsiniz</li>
              <li>• Kişiselleştirilmiş kozmik tavsiyeler alabilirsiniz</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </motion.main>
  );
};

export default Login;
