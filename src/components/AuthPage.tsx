import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

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
        backgroundImage: `url('/lovable-uploads/f930301b-774c-429c-97b7-b7f1cb17f432.png')`,
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
              src="/lovable-uploads/f930301b-774c-429c-97b7-b7f1cb17f432.png"
              alt="Cabana Logo"
              className="h-64 w-auto"
            />
          </div>
          <p className="text-muted-foreground text-lg">Welcome back</p>
        </CardHeader>

        <CardContent className="space-y-6 pb-8">
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
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full h-16 relative overflow-hidden bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm"
              variant="outline"
            >
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <span className="font-bebas text-2xl tracking-[0.5em] animate-slide-right whitespace-nowrap">
                  E N T E R&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;E N T E R&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;E N T E R&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;E N T E R&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;E N T E R
                </span>
              </div>
              <span className="relative z-10 font-bebas text-2xl tracking-[0.5em] opacity-0">
                E N T E R
              </span>
            </Button>
          </form>

          {/* Social Icons */}
          <div className="flex justify-center items-center space-x-8 max-w-xs mx-auto px-4">
            <Facebook className="w-6 h-6 text-white/70 hover:text-white cursor-pointer transition-colors" />
            <Instagram className="w-6 h-6 text-white/70 hover:text-white cursor-pointer transition-colors" />
            <Twitter className="w-6 h-6 text-white/70 hover:text-white cursor-pointer transition-colors" />
            <Youtube className="w-6 h-6 text-white/70 hover:text-white cursor-pointer transition-colors" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
