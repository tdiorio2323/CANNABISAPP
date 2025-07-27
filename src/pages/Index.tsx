import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import CustomerApp from "@/components/CustomerApp";
import { AuthPage } from "@/components/AuthPage";
import { CheckoutFlow } from "@/components/CheckoutFlow";
import { SuperAdminDashboard } from "@/components/SuperAdminDashboard";
import { BrandDashboard } from "@/components/BrandDashboard";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  const [currentView, setCurrentView] = useState<'auth' | 'customer' | 'checkout' | 'admin' | 'brand' | 'orderComplete'>('auth');
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Get user role from users table
        supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setUserRole(data.role);
              handleLogin(data.role as 'customer' | 'brand' | 'admin');
            }
          });
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setUserRole(data.role);
              handleLogin(data.role as 'customer' | 'brand' | 'admin');
            }
          });
      } else if (event === 'SIGNED_OUT') {
        setCurrentView('auth');
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (role: 'customer' | 'brand' | 'admin') => {
    if (role === 'admin') {
      setCurrentView('admin');
    } else if (role === 'brand') {
      setCurrentView('brand');
    } else {
      setCurrentView('customer');
    }
  };

  const handleCheckout = (items: any[], total: number) => {
    setCartItems(items);
    setCartTotal(total);
    setCurrentView('checkout');
  };

  const handleOrderComplete = () => {
    setCurrentView('customer');
    setCartItems([]);
    setCartTotal(0);
  };

  if (currentView === 'auth') {
    return (
      <>
        <AuthPage onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  if (currentView === 'admin') {
    return (
      <>
        <SuperAdminDashboard />
        <Toaster />
      </>
    );
  }

  if (currentView === 'brand') {
    return (
      <>
        <BrandDashboard />
        <Toaster />
      </>
    );
  }

  if (currentView === 'checkout') {
    return (
      <>
        <CheckoutFlow
          cartItems={cartItems}
          total={cartTotal}
          onBack={() => setCurrentView('customer')}
          onOrderComplete={handleOrderComplete}
        />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <CustomerApp onCheckout={handleCheckout} />
      <Toaster />
    </>
  );
};

export default Index;
