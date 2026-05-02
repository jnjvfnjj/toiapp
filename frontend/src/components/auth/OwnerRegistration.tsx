// src/components/auth/OwnerRegistration.tsx
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { GoogleAuth } from './GoogleAuth';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface OwnerRegistrationProps {
  onBack: () => void;
  onComplete: () => void;
}

export function OwnerRegistration({ onBack, onComplete }: OwnerRegistrationProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify({ 
        email: formData.email, 
        name: formData.name, 
        role: 'owner' 
      }));
      toast.success('Successfully registered!');
      onComplete();
      setIsLoading(false);
    }, 1000);
  };

  const handleGoogleSuccess = (userData: any) => {
    console.log('Google registration success for owner:', userData);
    toast.success('Google registration successful!');
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
            <CardTitle>Owner Registration</CardTitle>
          </div>
          <CardDescription>Create your owner account</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="owner@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Register'}
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
            mode="register"
            role="owner"
          />
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => onBack()}
              className="text-blue-600 hover:underline"
            >
              Sign in
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}