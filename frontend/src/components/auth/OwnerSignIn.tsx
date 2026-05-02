// src/components/auth/OwnerSignIn.tsx
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { GoogleAuth } from './GoogleAuth';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface OwnerSignInProps {
  onBack: () => void;
  onComplete: () => void;
}

export function OwnerSignIn({ onBack, onComplete }: OwnerSignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      if (email && password) {
        localStorage.setItem('user', JSON.stringify({ email, name: 'Owner', role: 'owner' }));
        toast.success('Successfully logged in!');
        onComplete();
      } else {
        toast.error('Please enter email and password');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleGoogleSuccess = (userData: any) => {
    console.log('Google login success for owner:', userData);
    toast.success('Google login successful!');
    onComplete();
  };

  const handleGoogleError = (error: string) => {
    console.error('Google auth error:', error);
    toast.error(error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle>Owner Sign In</CardTitle>
          </div>
          <CardDescription>Sign in to your owner account</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="owner@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <GoogleAuth
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            mode="signin"
            role="owner"
          />
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => onBack()}
              className="text-blue-600 hover:underline"
            >
              Sign up
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}