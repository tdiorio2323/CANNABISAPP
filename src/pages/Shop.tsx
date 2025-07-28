import React from "react";
import { useNavigate } from "react-router-dom";
import CustomerApp from "@/components/CustomerApp";

const Shop = () => {
  const navigate = useNavigate();

  const handleCheckout = (items: any[], total: number) => {
    // Store cart data in sessionStorage for checkout page
    sessionStorage.setItem('cartItems', JSON.stringify(items));
    sessionStorage.setItem('cartTotal', total.toString());
    navigate('/checkout');
  };

  return <CustomerApp onCheckout={handleCheckout} />;
};

export default Shop;