import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  ShoppingCart, 
  Star,
  Plus,
  Minus,
  Leaf,
  Filter,
  MapPin
} from "lucide-react";
import { toast } from "sonner";

interface Brand {
  id: string;
  name: string;
  logo_url: string | null;
  is_active: boolean;
}

interface Product {
  id: string;
  brand_id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  image_url: string | null;
  is_available: boolean;
  thc_percentage: number | null;
  cbd_percentage: number | null;
  strain_type: string | null;
  weight_grams: number | null;
}

export function CustomerApp() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: "all", name: "All Products", icon: "🌿" },
    { id: "flower", name: "Flower", icon: "🌸" },
    { id: "edibles", name: "Edibles", icon: "🍫" },
    { id: "pre_rolls", name: "Pre Rolls", icon: "🚬" },
    { id: "disposable_vapes", name: "Vapes", icon: "💨" },
    { id: "concentrate", name: "Concentrates", icon: "🧪" }
  ];

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      fetchProducts(selectedBrand.id);
    }
  }, [selectedBrand]);

  const fetchBrands = async () => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setBrands(data || []);
      
      // Auto-select first brand if available
      if (data && data.length > 0) {
        setSelectedBrand(data[0]);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast.error('Failed to load cannabis brands');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (brandId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('brand_id', brandId)
        .eq('is_available', true);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (productId: string) => {
    setCartItems(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
    toast.success("Added to cart!");
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => {
      const newItems = { ...prev };
      if (newItems[productId] > 1) {
        newItems[productId]--;
      } else {
        delete newItems[productId];
      }
      return newItems;
    });
  };

  const getCartTotal = () => {
    return Object.entries(cartItems).reduce((total, [productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      return total + (product ? product.price * quantity : 0);
    }, 0);
  };

  const getCartItemCount = () => {
    return Object.values(cartItems).reduce((sum, quantity) => sum + quantity, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-muted rounded-lg"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Brand selection view
  if (!selectedBrand) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-hero border-b border-border/50 p-4 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary-foreground">Cannabis Delivery</h1>
              <p className="text-sm text-primary-foreground/70">Choose your dispensary</p>
            </div>
          </div>
        </div>

        {/* Brands Grid */}
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            Available dispensaries in your area
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {brands.map((brand) => (
              <Card 
                key={brand.id}
                className="cursor-pointer hover:shadow-green transition-all duration-300 bg-gradient-card border-border/50"
                onClick={() => setSelectedBrand(brand)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <Leaf className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{brand.name}</h3>
                      <p className="text-sm text-muted-foreground">Premium Cannabis Products</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-warning fill-current" />
                          <span className="text-sm text-muted-foreground">4.8</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          25-35 min
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Product browsing view
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-hero border-b border-border/50 p-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedBrand(null)}
              className="text-primary-foreground/80 hover:text-primary-foreground"
            >
              ← Back
            </Button>
            <div>
              <h1 className="font-bold text-primary-foreground">{selectedBrand.name}</h1>
              <p className="text-xs text-primary-foreground/70">25-35 min delivery</p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="relative text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ShoppingCart className="h-5 w-5" />
            {getCartItemCount() > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
                {getCartItemCount()}
              </Badge>
            )}
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background/90 border-border/50"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="p-4 pb-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4 space-y-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="bg-gradient-card border-border/50 hover:shadow-md transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="w-20 h-20 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Leaf className="h-8 w-8 text-primary-foreground" />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {product.description || "Premium cannabis product"}
                      </p>
                      
                      {/* Product Details */}
                      <div className="flex items-center gap-2 mt-2">
                        {product.thc_percentage && (
                          <Badge variant="outline" className="text-xs">
                            {product.thc_percentage}% THC
                          </Badge>
                        )}
                        {product.strain_type && (
                          <Badge variant="secondary" className="text-xs">
                            {product.strain_type}
                          </Badge>
                        )}
                        {product.weight_grams && (
                          <Badge variant="outline" className="text-xs">
                            {product.weight_grams}g
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <span className="text-lg font-bold text-primary">
                          ${(product.price / 100).toFixed(2)}
                        </span>
                        
                        {/* Add to Cart Controls */}
                        <div className="flex items-center gap-2">
                          {cartItems[product.id] ? (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => removeFromCart(product.id)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="font-medium min-w-[2rem] text-center">
                                {cartItems[product.id]}
                              </span>
                              <Button
                                variant="default"
                                size="icon"
                                className="h-8 w-8 bg-gradient-primary hover:shadow-green"
                                onClick={() => addToCart(product.id)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => addToCart(product.id)}
                              className="bg-gradient-primary hover:shadow-green"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Leaf className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>

      {/* Floating Cart Summary */}
      {getCartItemCount() > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-20">
          <Card className="bg-gradient-primary shadow-glow border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-primary-foreground">
                <div>
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="font-semibold">{getCartItemCount()} items</span>
                  </div>
                  <p className="text-sm text-primary-foreground/80">
                    Total: ${(getCartTotal() / 100).toFixed(2)}
                  </p>
                </div>
                <Button 
                  variant="secondary"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  View Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}