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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus, Eye, EyeOff } from "lucide-react";

const formSchema = z
  .object({
    username: z.string().min(3, {
      message: "Kullanıcı adı en az 3 karakter olmalıdır.",
    }),
    email: z.string().email({
      message: "Geçerli bir e-posta adresi giriniz.",
    }),
    password: z.string().min(6, {
      message: "Şifre en az 6 karakter olmalıdır.",
    }),
    confirmPassword: z.string().min(6, {
      message: "Şifre en az 6 karakter olmalıdır.",
    }),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    acceptTerms: z.boolean().refine(val => val === true, {
      message: "Kullanım koşullarını kabul etmelisiniz.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      acceptTerms: false,
    },
  });
  
  const registerMutation = useMutation({
    mutationFn: async (data: Omit<FormData, "confirmPassword" | "acceptTerms">) => {
      return apiRequest("POST", "/api/register", data);
    },
    onSuccess: () => {
      toast({
        title: "Kayıt başarılı!",
        description: "Hesabınız oluşturuldu. Şimdi giriş yapabilirsiniz.",
      });
      
      // Redirect to login page after successful registration
      setTimeout(() => setLocation("/login"), 1500);
    },
    onError: (error) => {
      toast({
        title: "Kayıt başarısız",
        description: error instanceof Error ? error.message : "Bir hata oluştu, lütfen tekrar deneyin.",
        variant: "destructive",
      });
    },
  });
  
  function onSubmit(data: FormData) {
    // Remove confirmPassword and acceptTerms from the data before submission
    const { confirmPassword, acceptTerms, ...registerData } = data;
    registerMutation.mutate(registerData);
  }
  
  return (
    <motion.main 
      className="pt-24 pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto">
          <Card className="bg-secondary">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <UserPlus className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-2xl font-heading">Hesap Oluştur</CardTitle>
              <CardDescription>
                Kişisel astroloji deneyiminize başlamak için hemen kaydolun.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adınız</FormLabel>
                          <FormControl>
                            <Input placeholder="Adınız" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Soyadınız</FormLabel>
                          <FormControl>
                            <Input placeholder="Soyadınız" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-posta Adresi</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="ornek@mail.com" {...field} />
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
                        <FormDescription>
                          En az 6 karakter uzunluğunda olmalıdır.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Şifre Tekrar</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showConfirmPassword ? "text" : "password"} 
                              placeholder="••••••••" 
                              {...field} 
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? (
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
                  
                  <FormField
                    control={form.control}
                    name="acceptTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            <span>
                              <a href="#" className="text-accent hover:underline">Kullanım koşullarını</a> ve{" "}
                              <a href="#" className="text-accent hover:underline">Gizlilik politikasını</a> okudum ve kabul ediyorum.
                            </span>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-accent text-secondary hover:bg-accent/90"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      "Kayıt yapılıyor..."
                    ) : (
                      "Hesap Oluştur"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <div className="text-sm text-center">
                Zaten bir hesabınız var mı?{" "}
                <Link href="/login">
                  <a className="text-accent font-medium hover:underline">
                    Giriş Yapın
                  </a>
                </Link>
              </div>
            </CardFooter>
          </Card>
          
          <motion.div 
            className="mt-8 bg-primary/20 p-5 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-heading mb-2 text-center">Üyelik Avantajları</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-start">
                <div className="bg-accent rounded-full p-1 mr-3 mt-1 text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <p className="text-sm">Kişisel doğum haritanıza sınırsız erişim</p>
              </div>
              <div className="flex items-start">
                <div className="bg-accent rounded-full p-1 mr-3 mt-1 text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <p className="text-sm">Günlük, haftalık ve aylık burç yorumları</p>
              </div>
              <div className="flex items-start">
                <div className="bg-accent rounded-full p-1 mr-3 mt-1 text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <p className="text-sm">Özel astrolojik tavsiyeler ve uyarılar</p>
              </div>
              <div className="flex items-start">
                <div className="bg-accent rounded-full p-1 mr-3 mt-1 text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <p className="text-sm">Üyelere özel indirimler ve etkinlikler</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.main>
  );
};

export default Register;
