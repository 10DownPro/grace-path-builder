import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Mail, Lock, User, Loader2, ChevronRight } from 'lucide-react';
import logo from '@/assets/logo.png';

interface AuthFormProps {
  onSuccess?: () => void;
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          toast.error('Please enter your name');
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password, name);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Account created! Welcome to Faith Training.');
          onSuccess?.();
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Welcome back, soldier!');
          onSuccess?.();
        }
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-dawn flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-20 h-20 mx-auto mb-4">
          <img src={logo} alt="Faith Training" className="w-full h-full object-contain" />
        </div>
        <h1 className="font-display text-3xl uppercase tracking-wider text-foreground">
          Faith Training
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {mode === 'signin' ? 'Welcome back, soldier' : 'Join the ranks'}
        </p>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-sm gym-card p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-muted-foreground">
                Your Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="pl-10"
                  required={mode === 'signup'}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-muted-foreground">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10"
                required
                minLength={6}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full btn-gym"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <span className="font-display uppercase tracking-wider">
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                </span>
                <ChevronRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center pt-2 border-t border-border">
          <p className="text-sm text-muted-foreground">
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
          </p>
          <button
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-primary font-medium hover:underline mt-1"
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs text-muted-foreground mt-8 text-center">
        By continuing, you agree to build your faith daily 💪
      </p>
    </div>
  );
}
