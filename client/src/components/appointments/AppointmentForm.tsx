import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  userId: z.number().optional(),
  fullName: z.string().min(2, {
    message: "İsim ve soyisim en az 2 karakter olmalıdır",
  }),
  email: z.string().email({
    message: "Geçerli bir e-posta adresi giriniz",
  }),
  phone: z.string().min(10, {
    message: "Telefon numarası en az 10 karakter olmalıdır",
  }),
  appointmentDate: z.date({
    required_error: "Randevu tarihi seçmeniz gerekmektedir",
  }),
  appointmentTime: z.string({
    required_error: "Randevu saati seçmeniz gerekmektedir",
  }),
  appointmentType: z.string({
    required_error: "Randevu türü seçmeniz gerekmektedir",
  }),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface AppointmentFormProps {
  userId?: number;
}

const AppointmentForm = ({ userId }: AppointmentFormProps) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const timeslots = [
    "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  ];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: userId,
      fullName: "",
      email: "",
      phone: "",
      notes: "",
    },
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return apiRequest<{ message: string; appointmentId: number }>("/api/appointments", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Randevu Talebi Gönderildi",
        description: "Randevu talebiniz başarıyla alındı. En kısa sürede size dönüş yapılacaktır.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "appointments"] });
      
      // Kullanıcı oturum açmışsa, randevularını göster
      if (userId) {
        navigate("/appointments");
      } else {
        // Form temizlenir
        form.reset();
      }
    },
    onError: (error) => {
      console.error("Appointment creation error:", error);
      toast({
        title: "Hata",
        description: "Randevu oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: FormData) {
    createAppointmentMutation.mutate(data);
  }

  return (
    <div className="space-y-6 bg-card p-6 rounded-lg shadow-md">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Randevu Oluştur</h2>
        <p className="text-muted-foreground">
          Astrolojik danışmanlık için randevu talep edin. En kısa sürede talebiniz değerlendirilecektir.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ad Soyad</FormLabel>
                <FormControl>
                  <Input placeholder="Ad Soyad" {...field} />
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
                <FormLabel>E-posta</FormLabel>
                <FormControl>
                  <Input placeholder="ornek@email.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefon</FormLabel>
                <FormControl>
                  <Input placeholder="0500 000 00 00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="appointmentDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Randevu Tarihi</FormLabel>
                  <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: tr })
                          ) : (
                            <span>Tarih seçin</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setIsDatePickerOpen(false);
                        }}
                        disabled={(date) => {
                          // Disable past dates and weekends
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return (
                            date < today ||
                            date.getDay() === 0 ||
                            date.getDay() === 6
                          );
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="appointmentTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Randevu Saati</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Saat seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeslots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="appointmentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Randevu Türü</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Randevu türü seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="birth_chart">Doğum Haritası Okuması</SelectItem>
                    <SelectItem value="transit_analysis">Transit Analizi</SelectItem>
                    <SelectItem value="relationship_compatibility">İlişki Uyumu</SelectItem>
                    <SelectItem value="career_guidance">Kariyer Rehberliği</SelectItem>
                    <SelectItem value="general_consultation">Genel Danışma</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notlar (İsteğe Bağlı)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Randevunuz hakkında eklemek istediğiniz bilgiler..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Danışmanımızın bilmesi gereken özel durumlar varsa belirtebilirsiniz.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full"
            disabled={createAppointmentMutation.isPending}
          >
            {createAppointmentMutation.isPending 
              ? "Gönderiliyor..." 
              : "Randevu Talebi Gönder"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AppointmentForm;