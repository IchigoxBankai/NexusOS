import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Layers, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { loginSchema } from '@nexus/validation';
import { useAuthStore } from './authStore';
import { useToastStore } from '@/components/ui/Toast';
import { isSupabaseConfigured } from '@/lib/supabase';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, enterDemoMode } = useAuthStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setIsSubmitting(true);
    const result = await login({ email, password });
    setIsSubmitting(false);

    if (result.success) {
      addToast({
        type: 'success',
        title: 'Welcome to NEXUS',
        message: 'Signed in successfully.',
      });
      navigate(from, { replace: true });
    } else {
      setErrors({ general: result.error || 'Authentication failed' });
    }
  };

  const handleDemoAccess = () => {
    enterDemoMode();
    addToast({
      type: 'info',
      title: 'Demo Access Granted',
      message: 'Logged in as Cassius (Development Preview Mode).',
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 nexus-bg-mesh">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-3xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sign in to NEXUS</h1>
          <p className="text-xs text-slate-500 mt-1">One workspace. Your entire life.</p>
        </div>

        {/* Auth Card */}
        <Card variant="glass" className="p-8 rounded-3xl shadow-xl">
          {errors.general && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-100 text-xs text-rose-600 font-medium">
              {errors.general}
            </div>
          )}

          {!isSupabaseConfigured && (
            <div className="mb-5 p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100/80 text-xs text-indigo-900 leading-relaxed">
              <span className="font-semibold block mb-0.5">Development Environment</span>
              Supabase credentials not yet bound in <code>.env.local</code>. You can test live or use instant demo mode.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                leftIcon={<Lock className="w-4 h-4" />}
              />
              <div className="flex justify-end mt-1.5">
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              size="md"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          {/* Instant Demo Access Button */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleDemoAccess}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-2xl bg-indigo-50/80 hover:bg-indigo-100/90 text-indigo-700 text-xs font-semibold transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Instant Development Preview Mode</span>
            </button>
          </div>

          {/* Future OAuth Providers */}
          <div className="mt-6">
            <div className="relative flex items-center justify-center mb-4">
              <div className="border-t border-slate-200/60 w-full" />
              <span className="bg-white/80 px-3 text-[10px] uppercase font-semibold text-slate-400 absolute">
                Or continue with
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  addToast({
                    type: 'info',
                    title: 'OAuth Integration Prepared',
                    message: 'Google OAuth will be active once configured in Supabase Auth.',
                  });
                }}
                className="flex items-center justify-center gap-2 py-2 rounded-2xl bg-white/90 border border-slate-200/80 hover:bg-white text-xs font-medium text-slate-700 shadow-xs transition-all"
              >
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  addToast({
                    type: 'info',
                    title: 'OAuth Integration Prepared',
                    message: 'Apple ID OAuth will be active once configured in Supabase Auth.',
                  });
                }}
                className="flex items-center justify-center gap-2 py-2 rounded-2xl bg-white/90 border border-slate-200/80 hover:bg-white text-xs font-medium text-slate-700 shadow-xs transition-all"
              >
                <span>Apple</span>
              </button>
            </div>
          </div>

          {/* Registration link */}
          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-800">
              Create an account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
