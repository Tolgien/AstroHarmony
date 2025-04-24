import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StarField from "@/components/home/StarField";
import Home from "@/pages/Home";
import ZodiacSigns from "@/pages/ZodiacSigns";
import ZodiacDetail from "@/pages/ZodiacDetail";
import BirthChart from "@/pages/BirthChart";
import Compatibility from "@/pages/Compatibility";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

function Router() {
  return (
    <div className="cosmic-bg min-h-screen">
      <StarField />
      <Header />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/zodiac-signs" component={ZodiacSigns} />
        <Route path="/zodiac-signs/:name" component={ZodiacDetail} />
        <Route path="/birth-chart" component={BirthChart} />
        <Route path="/compatibility" component={Compatibility} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/contact" component={Contact} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
