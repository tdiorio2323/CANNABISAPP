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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage onLogin={() => {}} />} />
          <Route path="/shop" element={<CustomerApp />} />
          <Route path="/checkout" element={<CheckoutFlow cartItems={[]} total={0} onBack={() => {}} onOrderComplete={() => {}} />} />
          <Route path="/admin" element={<SuperAdminDashboard />} />
          <Route path="/brand" element={<BrandDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
