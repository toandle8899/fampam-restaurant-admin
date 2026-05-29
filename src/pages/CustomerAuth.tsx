import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/stores/authStore';

const CustomerAuth = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const signup = useAuthStore((s) => s.signup);
  const customer = useAuthStore((s) => s.customer);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPass, setSignupPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Already logged in — redirect
  if (customer) {
    return (
      <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4">
        <p className="font-serif-display text-2xl">Welcome back, {customer.name}</p>
        <div className="flex gap-3">
          <Link to="/dashboard" className="font-mono-data text-sm text-emerald hover:underline">
            My Orders →
          </Link>
          <Link to="/order" className="font-mono-data text-sm text-muted-foreground hover:underline">
            Order Food →
          </Link>
        </div>
      </main>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(loginEmail, loginPass);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signup(signupName, signupEmail, signupPass);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="hairline-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex items-center gap-3 px-4 py-3">
          <Link
            to="/order"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-mono-data text-xs">Menu</span>
          </Link>
          <div className="h-5 w-px bg-border/15" />
          <h1 className="font-serif-display text-lg">Account</h1>
        </div>
      </header>

      <div className="container mx-auto max-w-md px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="font-serif-display text-3xl">Welcome</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to track orders and checkout faster
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="login" className="flex-1 gap-2">
              <LogIn className="h-4 w-4" />
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" className="flex-1 gap-2">
              <UserPlus className="h-4 w-4" />
              Sign Up
            </TabsTrigger>
          </TabsList>

          {error && (
            <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 p-3">
              <p className="font-mono-data text-xs text-destructive">{error}</p>
            </div>
          )}

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="login-email" className="font-mono-data text-xs text-muted-foreground">
                  Email
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-secondary/30 border-border/20 font-mono-data text-sm"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="login-pass" className="font-mono-data text-xs text-muted-foreground">
                  Password
                </Label>
                <Input
                  id="login-pass"
                  type="password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••"
                  className="bg-secondary/30 border-border/20 font-mono-data text-sm"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald text-[#15191a] font-mono-data hover:bg-emerald/90"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="signup-name" className="font-mono-data text-xs text-muted-foreground">
                  Name
                </Label>
                <Input
                  id="signup-name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="Your name"
                  className="bg-secondary/30 border-border/20 font-mono-data text-sm"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="signup-email" className="font-mono-data text-xs text-muted-foreground">
                  Email
                </Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-secondary/30 border-border/20 font-mono-data text-sm"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="signup-pass" className="font-mono-data text-xs text-muted-foreground">
                  Password
                </Label>
                <Input
                  id="signup-pass"
                  type="password"
                  value={signupPass}
                  onChange={(e) => setSignupPass(e.target.value)}
                  placeholder="Min 6 characters"
                  className="bg-secondary/30 border-border/20 font-mono-data text-sm"
                  required
                  minLength={6}
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald text-[#15191a] font-mono-data hover:bg-emerald/90"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default CustomerAuth;
