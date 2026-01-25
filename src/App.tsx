import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import Session from "./pages/Session";
import Scripture from "./pages/Scripture";
import Prayer from "./pages/Prayer";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
import Battles from "./pages/Battles";
import Friends from "./pages/Friends";
import NotFound from "./pages/NotFound";
import Rewards from "./pages/Rewards";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";

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
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          
          {/* Protected Routes */}
          <Route path="/home" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/session" element={<ProtectedRoute><Session /></ProtectedRoute>} />
          <Route path="/scripture" element={<ProtectedRoute><Scripture /></ProtectedRoute>} />
          <Route path="/prayer" element={<ProtectedRoute><Prayer /></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/battles" element={<ProtectedRoute><Battles /></ProtectedRoute>} />
          <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
          <Route path="/rewards" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
          <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </TooltipProvider>
    </ThemeInitializer>
  </QueryClientProvider>
);

export default App;
