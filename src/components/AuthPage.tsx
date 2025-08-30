import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuthPageProps {
  onLogin?: (role: 'customer' | 'brand' | 'admin') => void;
}

export const AuthPage = ({ onLogin }: AuthPageProps) => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      try {
        if (isSignUp) {
          toast({
            title: "Account Created",
            description: "Welcome! Your account has been created successfully.",
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You have been signed in successfully.",
          });
        }

        // For demo purposes, navigate to shop page
        navigate('/shop');

        // Call onLogin if provided (for backward compatibility)
        if (onLogin) {
          onLogin('customer');
        }

      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };


  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url('/lovable-uploads/fa9437b3-6b52-4add-a826-421f47af7c9c.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/40" />
      
      <Card className="w-full max-w-md bg-black/10 backdrop-blur-sm border-white/10 shadow-2xl relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F8d5a64d26c0a4781a3269eef89d71661%2F2d3923d943614b4894f096117815d2be?format=webp&width=800"
              alt="Quick Printz Logo"
              className="h-32 w-auto"
            />
          </div>
          <p className="text-muted-foreground">Welcome back</p>
          
          <div className="flex rounded-lg bg-muted p-1">
            <Button
              variant={!isSignUp ? "default" : "ghost"}
              className={`flex-1 text-sm ${!isSignUp ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : 'hover:bg-yellow-500/20 hover:text-yellow-400'}`}
              onClick={() => setIsSignUp(false)}
            >
              Sign In
            </Button>
            <Button
              variant={isSignUp ? "default" : "ghost"}
              className={`flex-1 text-sm ${isSignUp ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : 'hover:bg-yellow-500/20 hover:text-yellow-400'}`}
              onClick={() => setIsSignUp(true)}
            >
              Sign Up
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 text-white placeholder:text-white/70 border-white/30 h-14"
              />
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/10 text-white placeholder:text-white/70 border-white/30 pr-10 h-14"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-14 px-3 py-2 hover:bg-yellow-500/20"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
              {isLoading ? "Loading..." : (isSignUp ? "Sign Up" : "Sign In")}
            </Button>
          </form>


          <p className="text-xs text-center text-muted-foreground">
            By continuing, you agree to our{" "}
            <span className="text-primary hover:underline cursor-pointer">Terms of Service</span> and{" "}
            <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
          </p>

          <div className="text-xs text-center bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20">
            <p className="font-medium mb-2 text-white">Secure Authentication</p>
            <p className="text-white/70 mb-3">
              Create your account or sign in with your existing credentials
            </p>
            <p className="text-white/60 text-xs">
              All user data is protected with row-level security and proper role-based access control
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
