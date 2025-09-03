import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SuperAdminDashboard from "@/components/SuperAdminDashboard";

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // For now, allow access without role checking
    // Will be enhanced when proper auth is implemented
  }, [navigate]);

  return <SuperAdminDashboard />;
};

export default Admin;