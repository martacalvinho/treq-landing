
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import About from "./pages/About";
import AuthPage from "./components/auth/AuthPage";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import Dashboard from "./components/dashboard/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Materials from "./pages/Materials";
import Manufacturers from "./pages/Manufacturers";
import Clients from "./pages/Clients";
import Alerts from "./pages/Alerts";
import Studios from "./pages/Studios";
import Users from "./pages/Users";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            } />
            <Route path="/projects" element={
              <DashboardLayout>
                <Projects />
              </DashboardLayout>
            } />
            <Route path="/projects/:id" element={
              <DashboardLayout>
                <ProjectDetails />
              </DashboardLayout>
            } />
            <Route path="/materials" element={
              <DashboardLayout>
                <Materials />
              </DashboardLayout>
            } />
            <Route path="/manufacturers" element={
              <DashboardLayout>
                <Manufacturers />
              </DashboardLayout>
            } />
            <Route path="/clients" element={
              <DashboardLayout>
                <Clients />
              </DashboardLayout>
            } />
            <Route path="/clients/:id" element={
              <DashboardLayout>
                <ClientDetails />
              </DashboardLayout>
            } />
            <Route path="/alerts" element={
              <DashboardLayout>
                <Alerts />
              </DashboardLayout>
            } />
            <Route path="/studios" element={
              <DashboardLayout>
                <Studios />
              </DashboardLayout>
            } />
            <Route path="/users" element={
              <DashboardLayout>
                <Users />
              </DashboardLayout>
            } />
            <Route path="/onboarding" element={
              <DashboardLayout>
                <Onboarding />
              </DashboardLayout>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
