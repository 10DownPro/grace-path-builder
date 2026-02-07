import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Mail, Lock, User, Loader2, ChevronRight, ArrowLeft } from 'lucide-react';
import logo from '@/assets/logo.png';
import { Link } from 'react-router-dom';
import { PhoneMockup } from '@/components/ui/PhoneMockup';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading, signIn, signUp } = useAuth();
  
  const [mode, setMode] = useState<'signin' | 'signup'>(
    location.pathname === '/signup' ? 'signup' : 'signin'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated (but only after loading is complete)
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Update mode based on URL
  useEffect(() => {
    setMode(location.pathname === '/signup' ? 'signup' : 'signin');
  }, [location.pathname]);

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
          navigate('/home');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Welcome back, soldier!');
          navigate('/home');
        }
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto animate-pulse">
            <img src={logo} alt="Faith Training" className="w-10 h-10 object-contain" />
          </div>
          <p className="text-muted-foreground font-display uppercase tracking-wider">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-dawn flex flex-col lg:flex-row items-center justify-center px-4 relative">
      {/* Back to Landing */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors z-20"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-body">Back</span>
      </Link>

      {/* Left Side - Phone Mockup (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-8">
        <PhoneMockup className="transform hover:scale-105 transition-transform duration-500" />
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md lg:pr-8">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="w-24 h-24 lg:w-32 lg:h-32 mx-auto mb-4">
            <img src={logo} alt="Faith Training" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-display text-2xl lg:text-3xl uppercase tracking-wider text-foreground">
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
          <Link
            to={mode === 'signin' ? '/signup' : '/login'}
            className="text-primary font-medium hover:underline mt-1 inline-block"
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </Link>
        </div>
      </div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground mt-8 text-center">
          By continuing, you agree to build your faith daily 💪
        </p>
      </div>
    </div>
  );
};

export default Auth;
