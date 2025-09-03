import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Share2, Lock, Star, Users, Gift } from 'lucide-react';
import { toast } from 'sonner';

const Vip = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [referralCode] = useState(() => Math.random().toString(36).substring(7).toUpperCase());
  const referringUser = searchParams.get('r');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('You\'ve been added to the VIP waitlist!');
      setEmail('');
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/r/${referralCode}`;
    navigator.clipboard.writeText(link);
    toast.success('Referral link copied!');
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" 
         style={{ backgroundImage: `url('/lovable-uploads/830a1f49-817d-4ee5-9db8-1b4edd4fbc15.png')` }}>
      <div className="min-h-screen bg-black/60 backdrop-blur-sm">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
              <Star className="w-3 h-3 mr-1" />
              VIP EXCLUSIVE
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Join the VIP List
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Get exclusive early access to premium products and special pricing
            </p>
            
            {referringUser && (
              <div className="mb-8">
                <Badge variant="outline" className="border-green-400/50 text-green-300 bg-green-500/10">
                  <Gift className="w-3 h-3 mr-1" />
                  Referred by {referringUser}
                </Badge>
              </div>
            )}
          </div>

          {/* Waitlist Form */}
          <Card className="max-w-md mx-auto mb-12 bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-center">Reserve Your Spot</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Join VIP Waitlist
                </Button>
              </form>
              
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-white/80 text-sm mb-3">Share and earn rewards:</p>
                <Button
                  variant="outline"
                  onClick={copyReferralLink}
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Copy Referral Link
                </Button>
                <p className="text-white/60 text-xs mt-2">
                  Earn exclusive perks for every friend you refer!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 relative">
              <div className="absolute top-4 right-4">
                <Lock className="w-5 h-5 text-white/60" />
              </div>
              <CardContent className="p-6">
                <div className="aspect-square bg-white/5 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-4xl">🏆</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Premium Products</h3>
                <p className="text-white/70 text-sm">Exclusive access to our premium collection</p>
                <Badge className="mt-2 bg-primary/20 text-primary">VIP Only</Badge>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 relative">
              <div className="absolute top-4 right-4">
                <Lock className="w-5 h-5 text-white/60" />
              </div>
              <CardContent className="p-6">
                <div className="aspect-square bg-white/5 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-4xl">💎</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Special Pricing</h3>
                <p className="text-white/70 text-sm">VIP members get exclusive discounts</p>
                <Badge className="mt-2 bg-primary/20 text-primary">VIP Only</Badge>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 relative">
              <div className="absolute top-4 right-4">
                <Lock className="w-5 h-5 text-white/60" />
              </div>
              <CardContent className="p-6">
                <div className="aspect-square bg-white/5 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-4xl">⚡</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Early Access</h3>
                <p className="text-white/70 text-sm">Be the first to see new arrivals</p>
                <Badge className="mt-2 bg-primary/20 text-primary">VIP Only</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="text-center mt-12">
            <div className="flex justify-center items-center space-x-2 text-white/60 mb-4">
              <Users className="w-4 h-4" />
              <span className="text-sm">Join 2,847+ VIP members</span>
            </div>
            <Link to="/auth" className="text-primary hover:text-primary/80 transition-colors">
              Already have access? Sign in →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vip;