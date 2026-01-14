import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/useAuth";
import { AuthWrapper } from "@/components/auth/AuthWrapper";
import { Toaster } from "@/components/ui/toaster";
import { MobileNav } from "@/components/gym/MobileNav";
import Index from "@/pages/Index";
import Progress from "@/pages/Progress";
import Profile from "@/pages/Profile";
import Schedule from "@/pages/Schedule";
import Workouts from "@/pages/Workouts";
import NotFound from "@/pages/NotFound";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background pb-20 md:pb-0">
          <Routes>
            {/* Wrap Index with AuthWrapper to require login */}
            <Route
              path="/"
              element={
                <AuthWrapper>
                  <Index />
                </AuthWrapper>
              }
            />

            {/* Progress page also protected */}
            <Route
              path="/progress"
              element={
                <AuthWrapper>
                  <Progress />
                </AuthWrapper>
              }
            />

            {/* Profile page also protected */}
            <Route
              path="/profile"
              element={
                <AuthWrapper>
                  <Profile />
                </AuthWrapper>
              }
            />

            {/* Schedule page also protected */}
            <Route
              path="/schedule"
              element={
                <AuthWrapper>
                  <Schedule />
                </AuthWrapper>
              }
            />

            {/* Workouts page also protected */}
            <Route
              path="/workouts"
              element={
                <AuthWrapper>
                  <Workouts />
                </AuthWrapper>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <MobileNav />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
