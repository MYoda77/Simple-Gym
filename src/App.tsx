import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
import Schedule from "./pages/Schedule";
import Workouts from "./pages/Workouts";
import { AuthWrapper } from "./components/auth/AuthWrapper";
import { AuthProvider } from "./lib/useAuth";
import { MobileNav } from "./components/gym/MobileNav";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AuthWrapper>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/workouts" element={<Workouts />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <MobileNav />
          </AuthWrapper>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
