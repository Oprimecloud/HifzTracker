'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Handle New Account Creation
  const [fullName, setFullName] = useState(''); // Add this state at the top
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName, // This matches the metadata in the SQL trigger
        }
      },
    });
    
    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Success! Please check your email to confirm your account.' });
    }
    setLoading(false);
  };

  // Handle Existing User Login
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      router.push('/dashboard');
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50 text-slate-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl border border-slate-100">
        <h1 className="text-3xl font-bold text-center text-emerald-700">HifzTracker</h1>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleSignIn} className="space-y-4">
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <Input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input type="password" placeholder="Create Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {message.text && (
          <p className={`text-sm text-center font-medium ${message.type === 'error' ? 'text-red-500' : 'text-emerald-600'}`}>
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}