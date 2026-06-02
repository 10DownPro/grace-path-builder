import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Session from "./pages/Session";
import Scripture from "./pages/Scripture";
import Prayer from "./pages/Prayer";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
// Battles + Friends pages removed — redirected to Home / Community

import NotFound from "./pages/NotFound";
import Rewards from "./pages/Rewards";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Waitlist from "./pages/Waitlist";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Community from "./pages/Community";
import Help from "./pages/Help";
import Bible from "./pages/Bible";
import Install from "./pages/Install";
import Tracks from "./pages/Tracks";

const queryClient = new QueryClient();

// Theme initialization component
function ThemeInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Load saved theme preference
    const savedDarkMode = localStorage.getItem('darkMode');
    const isDark = savedDarkMode === null || savedDarkMode === 'true'; // Default to dark
    
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
          {/* Public Routes */}
          <Route path="/" element={<Waitlist />} />
          <Route path="/waitlist" element={<Waitlist />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          
          {/* Protected Routes */}
          <Route path="/home" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/session" element={<ProtectedRoute><Session /></ProtectedRoute>} />
          <Route path="/scripture" element={<ProtectedRoute><Scripture /></ProtectedRoute>} />
          <Route path="/prayer" element={<ProtectedRoute><Prayer /></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          {/* Deprecated routes — redirect to current homes */}
          <Route path="/battles" element={<Navigate to="/home" replace />} />
          <Route path="/friends" element={<Navigate to="/community" replace />} />
          <Route path="/rewards" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
          <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
          <Route path="/bible" element={<ProtectedRoute><Bible /></ProtectedRoute>} />
          <Route path="/install" element={<Install />} />
          <Route path="/tracks" element={<ProtectedRoute><Tracks /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </TooltipProvider>
    </ThemeInitializer>
  </QueryClientProvider>
);

export default App;
