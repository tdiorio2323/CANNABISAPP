import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Enter = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleKeyPress = (digit: string) => {
    if (code.length < 4) {
      setCode(prev => prev + digit);
    }
  };

  const handleClear = () => {
    setCode('');
  };

  const handleSubmit = () => {
    if (code === '1234') { // VIP code
      toast.success('VIP access granted!');
      navigate('/vip');
    } else {
      setIsShaking(true);
      toast.error('Invalid VIP code');
      setTimeout(() => {
        setIsShaking(false);
        setCode('');
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center" 
         style={{ backgroundImage: `url('/lovable-uploads/830a1f49-817d-4ee5-9db8-1b4edd4fbc15.png')` }}>
      <div className="min-h-screen w-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
        <Card className={`w-full max-w-md mx-4 bg-white/10 backdrop-blur-md border-white/20 ${isShaking ? 'animate-pulse' : ''}`}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white mb-2">VIP ACCESS</CardTitle>
            <p className="text-white/80">Enter your VIP code</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Code Display */}
            <div className="flex justify-center space-x-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="w-12 h-12 border-2 border-white/30 rounded-lg flex items-center justify-center text-white text-xl font-mono bg-white/5"
                >
                  {code[i] ? '●' : ''}
                </div>
              ))}
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <Button
                  key={num}
                  variant="outline"
                  size="lg"
                  onClick={() => handleKeyPress(num.toString())}
                  className="h-14 text-lg font-mono bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  {num}
                </Button>
              ))}
              <Button
                variant="outline"
                size="lg"
                onClick={handleClear}
                className="h-14 text-sm bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Clear
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleKeyPress('0')}
                className="h-14 text-lg font-mono bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                0
              </Button>
              <Button
                variant="default"
                size="lg"
                onClick={handleSubmit}
                disabled={code.length !== 4}
                className="h-14 text-sm bg-primary hover:bg-primary/90"
              >
                Enter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Enter;