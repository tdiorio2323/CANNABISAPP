import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthPage } from "@/components/AuthPage";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Get user role and redirect accordingly
        supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              if (data.role === 'admin') {
                navigate('/admin');
              } else if (data.role === 'brand') {
                navigate('/brand');
              } else {
                navigate('/shop');
              }
            }
          });
      }
    });
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

  return <AuthPage onLogin={handleLogin} />;
};

export default Auth;