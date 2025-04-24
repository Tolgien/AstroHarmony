import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Badge,
} from "@/components/ui/badge";
import { getQueryFn } from "@/lib/queryClient";

interface Appointment {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: string;
  notes: string | null;
  confirmed: boolean;
  completed: boolean;
  createdAt: string;
}

// Helper to format appointment types for display
const formatAppointmentType = (type: string): string => {
  const types: { [key: string]: string } = {
    birth_chart: "Doğum Haritası Okuması",
    transit_analysis: "Transit Analizi",
    relationship_compatibility: "İlişki Uyumu",
    career_guidance: "Kariyer Rehberliği",
    general_consultation: "Genel Danışma",
  };
  return types[type] || type;
};

interface AppointmentListProps {
  userId: number;
}

const AppointmentList = ({ userId }: AppointmentListProps) => {
  const { data: appointments, isLoading, error } = useQuery({
    queryKey: ["/api/users", userId, "appointments"],
    queryFn: getQueryFn<Appointment[]>({ on401: "throw" }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-destructive">Randevular yüklenirken bir hata oluştu.</p>
      </div>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Henüz randevunuz bulunmamaktadır.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>Randevu geçmişiniz</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Tarih</TableHead>
          <TableHead>Saat</TableHead>
          <TableHead>Tür</TableHead>
          <TableHead>Durum</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((appointment) => (
          <TableRow key={appointment.id}>
            <TableCell>
              {format(parseISO(appointment.appointmentDate), "d MMMM yyyy", { locale: tr })}
            </TableCell>
            <TableCell>{appointment.appointmentTime}</TableCell>
            <TableCell>{formatAppointmentType(appointment.appointmentType)}</TableCell>
            <TableCell>
              {appointment.completed ? (
                <Badge variant="outline" className="bg-muted text-muted-foreground">
                  Tamamlandı
                </Badge>
              ) : appointment.confirmed ? (
                <Badge variant="default" className="bg-primary">
                  Onaylandı
                </Badge>
              ) : (
                <Badge variant="outline">
                  Beklemede
                </Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AppointmentList;