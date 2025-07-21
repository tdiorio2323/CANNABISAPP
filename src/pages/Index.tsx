import React, { useState } from "react";
import { CustomerApp } from "@/components/CustomerApp";
import { AuthPage } from "@/components/AuthPage";
import { CheckoutFlow } from "@/components/CheckoutFlow";
import { SuperAdminDashboard } from "@/components/SuperAdminDashboard";
import { BrandDashboard } from "@/components/BrandDashboard";

const Index = () => {
  const [currentView, setCurrentView] = useState<'auth' | 'customer' | 'checkout' | 'admin' | 'brand' | 'orderComplete'>('auth');
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

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
      <div>
        <h1>Debug: Auth Page Loading</h1>
        <AuthPage onLogin={handleLogin} />
      </div>
    );
  }

  if (currentView === 'admin') {
    return <SuperAdminDashboard />;
  }

  if (currentView === 'brand') {
    return <BrandDashboard />;
  }

  if (currentView === 'checkout') {
    return (
      <CheckoutFlow
        cartItems={cartItems}
        total={cartTotal}
        onBack={() => setCurrentView('customer')}
        onOrderComplete={handleOrderComplete}
      />
    );
  }

  return <CustomerApp onCheckout={handleCheckout} />;
};

export default Index;
