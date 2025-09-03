import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, Star, Gift, Crown, Sparkles } from 'lucide-react';

export default function Vip() {
  const location = useLocation();
  const [form, setForm] = useState({
    name: '',
    email: '',
    instagram: '',
    ref: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Get referral code from URL or cookie
    const params = new URLSearchParams(location.search);
    const refFromUrl = params.get('r');
    const refFromCookie = document.cookie
      .split(';')
      .find(c => c.trim().startsWith('ref_code='))
      ?.split('=')[1];
    
    if (refFromUrl || refFromCookie) {
      setForm(prev => ({ ...prev, ref: refFromUrl || refFromCookie || '' }));
    }
  }, [location]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      const result = await response.json();
      
      if (result.ok) {
        setStatus('success');
        setMessage('Welcome to Cabana VIP! You\'ll be notified when we launch.');
      } else {
        setStatus('error');
        setMessage(result.reason === 'missing_email' ? 'Email is required' : 'Something went wrong');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error - please try again');
    }
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <Card className="w-full max-w-lg backdrop-blur-sm bg-white/10 border-white/20">
          <CardContent className="pt-6 text-center">
            <div className="mb-6">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-2">Welcome to Cabana VIP!</h1>
              <p className="text-purple-200 text-lg">{message}</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-center space-x-2 text-white">
                <Crown className="w-5 h-5 text-yellow-400" />
                <span>You're now on our exclusive waitlist</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-white">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span>Follow us: @cabanagrp</span>
              </div>
            </div>
            
            <Button 
              onClick={() => window.location.href = 'https://instagram.com/cabanagrp'}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Follow on Instagram
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">CABANA</h1>
          <p className="text-xl text-purple-200 mb-4">Exclusive VIP Community</p>
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <Crown className="w-4 h-4 mr-1" />
            VIP Access Granted
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Sign-up Form */}
          <Card className="backdrop-blur-sm bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Join the Waitlist</CardTitle>
              <CardDescription className="text-purple-200">
                Be the first to know when we launch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">Name (optional)</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name"
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                    disabled={status === 'loading'}
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-white">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                    disabled={status === 'loading'}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="instagram" className="text-white">Instagram (optional)</Label>
                  <Input
                    id="instagram"
                    value={form.instagram}
                    onChange={(e) => setForm(prev => ({ ...prev, instagram: e.target.value }))}
                    placeholder="@yourusername"
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                    disabled={status === 'loading'}
                  />
                </div>

                {form.ref && (
                  <Alert className="bg-yellow-500/20 border-yellow-500/50">
                    <Star className="h-4 w-4" />
                    <AlertDescription className="text-yellow-200">
                      Referred by: <strong>{form.ref}</strong>
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  disabled={status === 'loading' || !form.email}
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <Crown className="mr-2 h-4 w-4" />
                      Join VIP Waitlist
                    </>
                  )}
                </Button>

                {status === 'error' && (
                  <Alert className="bg-red-500/20 border-red-500/50">
                    <AlertDescription className="text-red-200">{message}</AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="backdrop-blur-sm bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Gift className="mr-2 h-5 w-5" />
                VIP Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Sparkles className="w-5 h-5 text-purple-400 mt-1" />
                  <div>
                    <h4 className="text-white font-medium">Early Access</h4>
                    <p className="text-purple-200 text-sm">Be first to try new products</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Star className="w-5 h-5 text-yellow-400 mt-1" />
                  <div>
                    <h4 className="text-white font-medium">Exclusive Discounts</h4>
                    <p className="text-purple-200 text-sm">VIP-only pricing and offers</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Crown className="w-5 h-5 text-orange-400 mt-1" />
                  <div>
                    <h4 className="text-white font-medium">Priority Support</h4>
                    <p className="text-purple-200 text-sm">Skip the line, get help faster</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Gift className="w-5 h-5 text-pink-400 mt-1" />
                  <div>
                    <h4 className="text-white font-medium">Special Events</h4>
                    <p className="text-purple-200 text-sm">VIP-only launches and parties</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}