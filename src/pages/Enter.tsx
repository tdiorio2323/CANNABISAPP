import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export default function Enter() {
  const nav = useNavigate();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/vip/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });
      
      const result = await response.json();
      
      if (result.ok) {
        nav('/vip');
      } else {
        const errorMessages = {
          'missing_code': 'Please enter a VIP code',
          'invalid': 'Invalid VIP code',
          'inactive': 'This VIP code is no longer active',
          'missing_env': 'System error - please try again'
        };
        setError(errorMessages[result.reason as keyof typeof errorMessages] || 'Invalid VIP code');
      }
    } catch (err) {
      setError('Network error - please try again');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">CABANA</h1>
          <p className="text-purple-200">Exclusive VIP Access</p>
        </div>
        
        <Card className="backdrop-blur-sm bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Enter VIP Code</CardTitle>
            <CardDescription className="text-purple-200">
              Enter your exclusive access code to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="VIP-CODE-HERE"
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-purple-400"
                disabled={loading}
              />
              
              {error && (
                <Alert className="bg-red-500/20 border-red-500/50 text-red-200">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                disabled={loading || !code.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Enter VIP Area'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="text-center mt-6 text-purple-200 text-sm">
          Need a VIP code? Contact us for exclusive access.
        </div>
      </div>
    </div>
  );
}
