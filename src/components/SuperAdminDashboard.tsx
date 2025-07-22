import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Leaf, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Plus,
  MoreHorizontal,
  Eye,
  Settings,
  Crown
} from "lucide-react";
import { toast } from "sonner";

interface Brand {
  id: string;
  name: string;
  logo_url: string | null;
  is_active: boolean;
}

interface Subscription {
  id: string;
  brand_id: string;
  tier: string;
  is_active: boolean;
  monthly_price: number;
  current_period_end: string | null;
  brand: {
    name: string;
  };
}

export function SuperAdminDashboard() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBrands: 0,
    activeBrands: 0,
    totalRevenue: 0,
    monthlyRecurring: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch brands
      const { data: brandsData, error: brandsError } = await supabase
        .from('brands')
        .select('id, name, logo_url, is_active')
        .limit(5);

      if (brandsError) throw brandsError;

      // Fetch subscriptions with brand info
      const { data: subscriptionsData, error: subscriptionsError } = await supabase
        .from('subscriptions')
        .select(`
          *,
          brand:brands(name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (subscriptionsError) throw subscriptionsError;

      setBrands(brandsData || []);
      setSubscriptions(subscriptionsData || []);

      // Calculate stats
      const totalBrands = brandsData?.length || 0;
      const activeBrands = brandsData?.filter(b => b.is_active).length || 0;
      const activeSubscriptions = subscriptionsData?.filter(s => s.is_active) || [];
      const monthlyRecurring = activeSubscriptions.reduce((sum, sub) => sum + (sub.monthly_price / 100), 0);

      setStats({
        totalBrands,
        activeBrands,
        totalRevenue: monthlyRecurring * 12, // Estimated annual
        monthlyRecurring
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleAddNewBrand = () => {
    toast.success("Add New Brand functionality coming soon!");
  };

  const handlePlatformSettings = () => {
    toast.success("Platform Settings functionality coming soon!");
  };

  const handleViewAnalytics = () => {
    toast.success("View Analytics functionality coming soon!");
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Crown className="h-8 w-8 text-primary" />
            Super Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your cannabis platform and brand subscriptions
          </p>
        </div>
        <Button 
          className="bg-gradient-primary hover:shadow-green transition-all duration-300"
          onClick={handleAddNewBrand}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Brand
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-card border-border/50 hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Brands</CardTitle>
            <Leaf className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalBrands}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeBrands} active brands
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50 hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Brands</CardTitle>
            <Users className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.activeBrands}</div>
            <p className="text-xs text-muted-foreground">
              Paying customers
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50 hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {formatCurrency(stats.monthlyRecurring)}
            </div>
            <p className="text-xs text-muted-foreground">
              Recurring monthly revenue
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50 hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Projection</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Estimated annual revenue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Brands and Subscriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Brands */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              Recent Cannabis Brands
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {brands.map((brand) => (
                <div 
                  key={brand.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <Leaf className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{brand.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Cannabis Brand
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={brand.is_active ? "default" : "secondary"}>
                      {brand.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Subscriptions */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-warning" />
              Recent Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subscriptions.map((subscription) => (
                <div 
                  key={subscription.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{subscription.brand.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(subscription.monthly_price / 100)}/month
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={subscription.is_active ? "default" : "secondary"}>
                      {subscription.tier}
                    </Badge>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 hover:shadow-green transition-all duration-300 text-white font-bold bg-secondary/80 border-primary/20"
              onClick={handleAddNewBrand}
            >
              <Plus className="h-6 w-6" />
              Add New Brand
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 hover:shadow-green transition-all duration-300 text-white font-bold bg-secondary/80 border-primary/20"
              onClick={handlePlatformSettings}
            >
              <Settings className="h-6 w-6" />
              Platform Settings
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 hover:shadow-green transition-all duration-300 text-white font-bold bg-secondary/80 border-primary/20"
              onClick={handleViewAnalytics}
            >
              <TrendingUp className="h-6 w-6" />
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}