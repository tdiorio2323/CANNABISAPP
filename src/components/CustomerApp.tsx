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

interface CustomerAppProps {
  onCheckout?: (items: any[], total: number) => void;
}

export function CustomerApp({ onCheckout }: CustomerAppProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("flower");
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const productsPerPage = 6;

  const categories = [
    { id: "all", name: "All Products", icon: "🌿" },
    { id: "flower", name: "Flower", icon: "🌸" },
    { id: "edibles", name: "Edibles", icon: "🍫" },
    { id: "pre_rolls", name: "Pre Rolls", icon: "🚬" },
    { id: "disposable_vapes", name: "Vapes", icon: "💨" },
    { id: "concentrate", name: "Concentrates", icon: "🧪" }
  ];

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      fetchProducts(1);
    }
  }, [selectedCategory, searchQuery, selectedBrand]);
  const initializeApp = async () => {
    try {
      // Get the single brand for this app instance
      const { data: brandsData, error: brandsError } = await supabase
        .from('brands')
        .select('*')
        .eq('is_active', true)
        .limit(1);

      if (brandsError) throw brandsError;
      
      if (brandsData && brandsData.length > 0) {
        const brand = brandsData[0];
        setBrands([brand]);
        setSelectedBrand(brand);
        // Products will be fetched by useEffect
      }
    } catch (error) {
      console.error('Error initializing app:', error);
      toast.error('Failed to load store');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (page: number, append: boolean = false) => {
    if (!selectedBrand) return;
    
    try {
      if (!append) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('brand_id', selectedBrand.id)
        .eq('is_available', true);

      // Apply category filter
      if (selectedCategory !== "all") {
        query = query.eq('category', selectedCategory);
      }

      // Apply search filter
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      // Apply pagination
      const from = (page - 1) * productsPerPage;
      const to = from + productsPerPage - 1;
      query = query.range(from, to);

      const { data: productsData, error: productsError, count } = await query;

      if (productsError) throw productsError;

      const totalCount = count || 0;
      const calculatedTotalPages = Math.ceil(totalCount / productsPerPage);
      
      setTotalPages(calculatedTotalPages);
      setCurrentPage(page);

      if (append && productsData) {
        setProducts(prev => [...prev, ...productsData]);
      } else {
        setProducts(productsData || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchProducts(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handlePrevPage = () => {
    if (currentPage > 1) {
      fetchProducts(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      fetchProducts(currentPage + 1, true);
    }
  };
  // Product browsing view
  return (
    <div 
      className="min-h-screen pb-20 bg-cover bg-center bg-no-repeat" 
      style={{ backgroundImage: 'url(/lovable-uploads/100c1251-d4f7-413c-a115-dbbfa5066289.png)' }}
    >
      {/* Header */}
      <div className="sticky top-0 bg-black border-b border-white/10 p-4 z-10">
        {/* Social Media Link */}
        <div className="text-center mb-4">
          <a 
            href="https://www.instagram.com/cabana/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white text-sm font-medium hover:text-primary transition-colors"
          >
            FOLLOW @CABANA
          </a>
        </div>
        
        {/* Slurpiez Logo */}
        <div className="text-center mb-4">
          <img 
            src="/lovable-uploads/100c1251-d4f7-413c-a115-dbbfa5066289.png" 
            alt="Cabana Logo" 
            className="h-32 mx-auto"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="font-bold text-white text-lg">25-35 MIN DELIVERY</h1>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="relative text-white hover:bg-white/10"
            onClick={() => {
              if (onCheckout && getCartItemCount() > 0) {
                const cartItemsArray = Object.entries(cartItems).map(([productId, quantity]) => {
                  const product = products.find(p => p.id === productId);
                  return product ? { ...product, quantity } : null;
                }).filter(Boolean);
                onCheckout(cartItemsArray, getCartTotal());
              }
            }}
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/90 border-gray-300 text-black placeholder:text-gray-500 rounded-lg"
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
              className={`whitespace-nowrap ${
                selectedCategory === category.id 
                  ? "bg-green-500 text-white border-green-500 hover:bg-green-600" 
                  : "bg-white/90 text-black border-gray-300 hover:bg-gray-100"
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Feed Section */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-white mb-3">Latest Updates</h2>
        <div className="h-32 overflow-y-auto">
          <Card className="bg-white/95 border-gray-200 hover:shadow-md transition-all duration-300 rounded-xl">
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Leaf className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-black text-sm">@cabana</h3>
                    <span className="text-xs text-gray-500">2h ago</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">
                    🔥 New arrivals just dropped! Check out our premium indica strains perfect for weekend relaxation. Limited stock available! 
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <button className="hover:text-red-500 transition-colors">❤️ 42</button>
                    <button className="hover:text-blue-500 transition-colors">💬 8</button>
                    <button className="hover:text-green-500 transition-colors">🔄 12</button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pagination Info */}
      <div className="px-4 mb-2">
        <div className="flex items-center justify-between text-white text-sm">
          <span>
            Page {currentPage} of {totalPages} ({products.length} products)
          </span>
          <span>
            {selectedCategory !== "all" && `Category: ${selectedCategory}`}
            {searchQuery && ` | Search: "${searchQuery}"`}
          </span>
        </div>
      </div>
      {/* Products Grid */}
      <div className="p-4 space-y-4">
        {products.map((product) => (
          <Card key={product.id} className="bg-white/95 border-gray-200 hover:shadow-md transition-all duration-300 rounded-xl">
            <CardContent className="p-4">
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center ${product.image_url ? 'hidden' : ''}`}>
                    <Leaf className="h-8 w-8 text-white" />
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-black truncate">{product.name.toUpperCase()}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {product.description || "Classic indica strain with earthy flavors"}
                      </p>
                      
                      {/* Product Details */}
                      <div className="flex items-center gap-2 mt-2">
                        {product.thc_percentage && (
                          <Badge variant="outline" className="text-xs bg-gray-100 text-black border-gray-300">
                            {product.thc_percentage}% THC
                          </Badge>
                        )}
                        {product.strain_type && (
                          <Badge variant="secondary" className="text-xs bg-black text-white">
                            {product.strain_type}
                          </Badge>
                        )}
                        {product.weight_grams && (
                          <Badge variant="outline" className="text-xs bg-gray-100 text-black border-gray-300">
                            {product.weight_grams}g
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <span className="text-lg font-bold text-green-600">
                          ${(product.price / 100).toFixed(2)}
                        </span>
                        
                        {/* Add to Cart Controls */}
                        <div className="flex items-center gap-2">
                          {cartItems[product.id] ? (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 border-gray-300 text-black hover:bg-gray-100"
                                onClick={() => removeFromCart(product.id)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="font-medium min-w-[2rem] text-center text-black">
                                {cartItems[product.id]}
                              </span>
                              <Button
                                variant="default"
                                size="icon"
                                className="h-8 w-8 bg-green-500 hover:bg-green-600 text-white"
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
                              className="bg-green-500 hover:bg-green-600 text-white rounded-full"
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

        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <Leaf className="h-12 w-12 text-white/60 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No products found</h3>
            <p className="text-white/80">
              Try adjusting your search or category filter
              <br />
              <span className="text-xs">
                Category: {selectedCategory} | Page: {currentPage}/{totalPages} | Brand: {selectedBrand?.name}
              </span>
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col gap-4 mt-6">
            {/* Load More Button */}
            <div className="text-center">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={currentPage >= totalPages || loadingMore}
                className="bg-white/90 text-black border-gray-300 hover:bg-gray-100"
              >
                {loadingMore ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                    Loading...
                  </>
                ) : (
                  `Load More Products (${Math.min(productsPerPage, (totalPages - currentPage) * productsPerPage)} remaining)`
                )}
              </Button>
            </div>

            {/* Page Navigation */}
            <div className="flex items-center justify-between bg-white/90 rounded-lg p-4">
              <Button
                variant="outline"
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                className="flex items-center gap-2"
              >
                <span>←</span>
                Previous
              </Button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
              
              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className="flex items-center gap-2"
              >
                Next
                <span>→</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Cart Summary */}
      {getCartItemCount() > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-20">
          <Card className="bg-primary border-primary/20 shadow-lg">
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
                  onClick={() => {
                    if (onCheckout) {
                      const cartItemsArray = Object.entries(cartItems).map(([productId, quantity]) => {
                        const product = products.find(p => p.id === productId);
                        return product ? { ...product, quantity } : null;
                      }).filter(Boolean);
                      onCheckout(cartItemsArray, getCartTotal());
                    }
                  }}
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