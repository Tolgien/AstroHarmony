import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import AppointmentForm from "@/components/appointments/AppointmentForm";

const BookAppointment = () => {
  // Check if user is logged in
  const [userId, setUserId] = useState<number | undefined>(undefined);
  
  useEffect(() => {
    const userJson = localStorage.getItem("currentUser");
    if (userJson) {
      try {
        const userData = JSON.parse(userJson);
        setUserId(userData.id);
      } catch (e) {
        console.error("Invalid user data in localStorage");
      }
    }
  }, []);

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Astrolojik Danışmanlık</h1>
          <p className="text-muted-foreground">
            Uzman astrologlarımızdan kişisel danışmanlık alın. Doğum haritası analizi, ilişki uyumluluğu veya kariyer rehberliği için randevu oluşturun.
          </p>
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Danışmanlık Hizmetlerimiz</h2>
            
            <div className="space-y-3">
              <div>
                <h3 className="font-medium">Doğum Haritası Okuması</h3>
                <p className="text-sm text-muted-foreground">Kişisel potansiyellerinizi, yeteneklerinizi ve hayat derslerinizi keşfedin.</p>
              </div>
              
              <div>
                <h3 className="font-medium">Transit Analizi</h3>
                <p className="text-sm text-muted-foreground">Şu anki gökyüzü hareketlerinin hayatınıza etkilerini anlayın.</p>
              </div>
              
              <div>
                <h3 className="font-medium">İlişki Uyumu</h3>
                <p className="text-sm text-muted-foreground">Partnerinizle uyumunuzu ve ilişkinizin dinamiklerini keşfedin.</p>
              </div>
              
              <div>
                <h3 className="font-medium">Kariyer Rehberliği</h3>
                <p className="text-sm text-muted-foreground">Doğum haritanıza göre kariyer yolunuzu ve potansiyelinizi analiz edin.</p>
              </div>
              
              <div>
                <h3 className="font-medium">Genel Danışma</h3>
                <p className="text-sm text-muted-foreground">Hayatınızın herhangi bir alanıyla ilgili astrolojik rehberlik alın.</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-semibold">Danışmanlık Süresi</h3>
              <p className="text-sm text-muted-foreground">Tüm görüşmeler 60 dakika sürmektedir. Görüşmeler online olarak yapılır.</p>
            </div>
          </div>
          
          <div>
            <AppointmentForm userId={userId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;