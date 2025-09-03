import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CustomerApp from "./components/CustomerApp";
import { AuthPage } from "./components/AuthPage";
import { CheckoutFlow } from "./components/CheckoutFlow";
import SuperAdminDashboard from "./components/SuperAdminDashboard";
import BrandDashboard from "./components/BrandDashboard";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Shop from "./pages/Shop";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import Brand from "./pages/Brand";
import Portal from "./pages/Portal";
import ProjectPage from "./pages/ProjectPage";
import Enter from "./pages/Enter";
import Vip from "./pages/Vip";
import ReferralRedirect from "./pages/ReferralRedirect";
import CreatorProfile from "./pages/CreatorProfile";
import DashboardWireframe from "./components/DashboardWireframe";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Enter />} />
          <Route path="/enter" element={<Enter />} />
          <Route path="/vip" element={<Vip />} />
          <Route path="/r/:code" element={<ReferralRedirect />} />
          <Route path="/creator/build" element={<DashboardWireframe />} />
          <Route path="/creator/profile" element={<CreatorProfile />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/brand" element={<Brand />} />
          <Route path="/portal" element={<Portal />} />
          <Route path="/project/:id" element={<ProjectPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
