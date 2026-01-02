import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/useAuth";
import { AuthWrapper } from "@/components/auth/AuthWrapper";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Progress from "@/pages/Progress";
import NotFound from "@/pages/NotFound";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
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

            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
