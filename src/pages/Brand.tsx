import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import BrandDashboard from "@/components/BrandDashboard";

const Brand = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // For now, allow access without role checking  
    // Will be enhanced when proper auth is implemented
  }, [navigate]);

  return <BrandDashboard />;
};

export default Brand;