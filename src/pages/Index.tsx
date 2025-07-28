import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import CustomerApp from "@/components/CustomerApp";
import { AuthPage } from "@/components/AuthPage";
import { CheckoutFlow } from "@/components/CheckoutFlow";
import SuperAdminDashboard from "@/components/SuperAdminDashboard";
import BrandDashboard from "@/components/BrandDashboard";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  const navigate = useNavigate();
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
      } else {
        // No session, redirect to auth
        navigate('/auth');
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
        navigate('/auth');
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = (role: 'customer' | 'brand' | 'admin') => {
    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'brand') {
      navigate('/brand');
    } else {
      navigate('/shop');
    }
  };

  const handleCheckout = (items: any[], total: number) => {
    setCartItems(items);
    setCartTotal(total);
    navigate('/checkout');
  };

  const handleOrderComplete = () => {
    navigate('/shop');
    setCartItems([]);
    setCartTotal(0);
  };

  // Default to customer app for authenticated users
  return (
    <>
      <CustomerApp onCheckout={handleCheckout} />
      <Toaster />
    </>
  );
};

export default Index;
