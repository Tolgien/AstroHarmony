import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getQueryFn } from "@/lib/queryClient";
import { useLocation } from "wouter";
import AppointmentForm from "@/components/appointments/AppointmentForm";
import AppointmentList from "@/components/appointments/AppointmentList";

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

const Appointments = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("list");
  
  // Get current user from local storage
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const userJson = localStorage.getItem("currentUser");
    if (userJson) {
      try {
        const userData = JSON.parse(userJson);
        setUser(userData);
      } catch (e) {
        console.error("Invalid user data in localStorage");
        // If user data is invalid, clear it and navigate to login
        localStorage.removeItem("currentUser");
        navigate("/login");
      }
    } else {
      // If user is not logged in, navigate to login
      navigate("/login");
    }
  }, [navigate]);

  // Verify user session with API
  const { data: userData, isLoading, error } = useQuery({
    queryKey: ["/api/users/me"],
    queryFn: getQueryFn<User>({ on401: "returnNull" }),
    enabled: !!user, // Only run query if we have a user from localStorage
  });

  // If API says user is not valid, log out
  useEffect(() => {
    if (!isLoading && !userData && error) {
      localStorage.removeItem("currentUser");
      navigate("/login");
    }
  }, [userData, isLoading, error, navigate]);

  // Show loading state while checking authentication
  if (isLoading || !user) {
    return (
      <div className="container mx-auto py-10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Randevularım</h1>
          <p className="text-muted-foreground">
            Tüm randevularınızı görüntüleyin ve yeni randevu oluşturun
          </p>
        </div>

        <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="list">Randevularım</TabsTrigger>
            <TabsTrigger value="new">Yeni Randevu</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="space-y-4 mt-6">
            <AppointmentList userId={user.id} />
          </TabsContent>
          <TabsContent value="new" className="space-y-4 mt-6">
            <AppointmentForm userId={user.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Appointments;