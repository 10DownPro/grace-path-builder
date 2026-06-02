import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import Auth from "./pages/Auth";
import Index from "./pages/Index";
import Session from "./pages/Session";
import Scripture from "./pages/Scripture";
import Prayer from "./pages/Prayer";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Waitlist from "./pages/Waitlist";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Community from "./pages/Community";
import Help from "./pages/Help";
import Install from "./pages/Install";
import Tracks from "./pages/Tracks";
import Bible from "./pages/Bible";

const queryClient = new QueryClient();

function ThemeInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    const isDark = savedDarkMode === null || savedDarkMode === 'true';
    if (isDark) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, []);
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeInitializer>
      <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Waitlist />} />
          <Route path="/waitlist" element={<Waitlist />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/install" element={<Install />} />

          {/* Core protected experience */}
          <Route path="/home" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/journey" element={<ProtectedRoute><Tracks /></ProtectedRoute>} />
          <Route path="/scripture" element={<ProtectedRoute><Scripture /></ProtectedRoute>} />
          <Route path="/bible" element={<ProtectedRoute><Bible /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Supporting flows */}
          <Route path="/session" element={<ProtectedRoute><Session /></ProtectedRoute>} />
          <Route path="/prayer" element={<ProtectedRoute><Prayer /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />

          {/* Deprecated → redirects */}
          <Route path="/dashboard" element={<Navigate to="/home" replace />} />
          <Route path="/progress" element={<Navigate to="/profile" replace />} />
          <Route path="/rewards" element={<Navigate to="/profile" replace />} />
          <Route path="/battles" element={<Navigate to="/community" replace />} />
          <Route path="/friends" element={<Navigate to="/community" replace />} />
          <Route path="/feed" element={<Navigate to="/community" replace />} />
          <Route path="/circles" element={<Navigate to="/community" replace />} />
          <Route path="/bible" element={<Navigate to="/scripture" replace />} />
          <Route path="/tracks" element={<Navigate to="/journey" replace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </TooltipProvider>
    </ThemeInitializer>
  </QueryClientProvider>
);

export default App;
