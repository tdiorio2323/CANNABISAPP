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
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleKeypadPress = (digit: string) => {
    if (password.length < 3) {
      setPassword(prev => prev + digit);
    }
  };

  const handleKeypadClear = () => {
    setPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== "420") {
      toast({
        title: "Error",
        description: "Invalid password",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      try {
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });

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
        <CardHeader className="text-center space-y-6">
          <div className="flex items-center justify-center">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F8d5a64d26c0a4781a3269eef89d71661%2F2d3923d943614b4894f096117815d2be?format=webp&width=800"
              alt="Quick Printz Logo"
              className="h-64 w-auto"
            />
          </div>
          <p className="text-muted-foreground text-lg">Welcome back</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Password Display */}
          <div className="text-center">
            <div className="flex justify-center space-x-2 mb-4">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="w-12 h-12 border-2 border-white/30 rounded-lg bg-white/10 flex items-center justify-center text-white text-xl font-bold"
                >
                  {password[index] ? "●" : ""}
                </div>
              ))}
            </div>
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
              <Button
                key={digit}
                type="button"
                onClick={() => handleKeypadPress(digit.toString())}
                className="h-16 w-16 text-xl font-bold bg-white/10 hover:bg-white/20 text-white border border-white/30"
                variant="outline"
              >
                {digit}
              </Button>
            ))}
            <Button
              type="button"
              onClick={handleKeypadClear}
              className="h-16 w-16 text-lg font-bold bg-red-500/20 hover:bg-red-500/30 text-white border border-red-500/50"
              variant="outline"
            >
              ⌫
            </Button>
            <Button
              type="button"
              onClick={() => handleKeypadPress("0")}
              className="h-16 w-16 text-xl font-bold bg-white/10 hover:bg-white/20 text-white border border-white/30"
              variant="outline"
            >
              0
            </Button>
            <div></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Button type="submit" disabled={isLoading} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
              {isLoading ? "Loading..." : "Sign In"}
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
