import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { insertContactMessageSchema } from "@shared/schema";
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
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Send } from "lucide-react";

// Extend the schema with more detailed validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: "İsim en az 2 karakter olmalıdır.",
  }),
  email: z.string().email({
    message: "Geçerli bir e-posta adresi giriniz.",
  }),
  subject: z.string().min(3, {
    message: "Konu en az 3 karakter olmalıdır.",
  }),
  message: z.string().min(10, {
    message: "Mesajınız en az 10 karakter olmalıdır.",
  }),
});

type FormData = z.infer<typeof formSchema>;

const ContactForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    },
  });
  
  const contactMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Mesajınız gönderildi!",
        description: "En kısa sürede size geri dönüş yapacağız.",
      });
      setIsSubmitted(true);
    },
    onError: (error) => {
      toast({
        title: "Mesaj gönderilemedi",
        description: error instanceof Error ? error.message : "Bir hata oluştu, lütfen tekrar deneyin.",
        variant: "destructive",
      });
    },
  });
  
  function onSubmit(data: FormData) {
    contactMutation.mutate(data);
  }
  
  const resetForm = () => {
    form.reset();
    setIsSubmitted(false);
  };
  
  return (
    <Card className="w-full max-w-xl mx-auto bg-secondary">
      <CardHeader>
        <CardTitle className="text-2xl font-heading">Bizimle İletişime Geçin</CardTitle>
        <CardDescription>
          Sorularınız, önerileriniz veya kişisel astrolojik danışmanlık için formu doldurun.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSubmitted ? (
          <motion.div 
            className="text-center py-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-heading mb-2">Teşekkürler!</h3>
            <p className="text-muted-foreground mb-6">
              Mesajınız başarıyla iletildi. En kısa sürede size geri dönüş yapacağız.
            </p>
            <Button onClick={resetForm} variant="outline">
              Yeni Mesaj Gönder
            </Button>
          </motion.div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İsminiz</FormLabel>
                    <FormControl>
                      <Input placeholder="Adınız Soyadınız" {...field} />
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
                    <FormLabel>E-posta Adresiniz</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="ornek@mail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konu</FormLabel>
                    <FormControl>
                      <Input placeholder="Mesajınızın konusu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mesajınız</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Mesajınızı buraya yazın..." 
                        className="min-h-32 resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      En kısa sürede yanıt vermek için elimizden geleni yapacağız.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-accent text-secondary hover:bg-accent/90"
                disabled={contactMutation.isPending}
              >
                {contactMutation.isPending ? (
                  "Gönderiliyor..."
                ) : (
                  <>
                    <span>Mesajı Gönder</span>
                    <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactForm;
