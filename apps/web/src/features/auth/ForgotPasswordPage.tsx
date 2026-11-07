import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Mail, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { forgotPasswordSchema } from '@nexus/validation';
import { authService } from '@/lib/services';
import { isSupabaseConfigured } from '@/lib/supabase';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = forgotPasswordSchema.safeParse({ email });
    if (!validation.success) {
      setError(validation.error.errors[0]?.message || 'Please enter a valid email');
      return;
    }

    setIsLoading(true);
    if (isSupabaseConfigured) {
      const { error: err } = await authService.resetPasswordForEmail(email);
      if (err) {
        setError(err.message);
        setIsLoading(false);
        return;
      }
    }
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 nexus-bg-mesh">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-3xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reset your password</h1>
          <p className="text-xs text-slate-500 mt-1">We'll send you instructions to recover your account.</p>
        </div>

        <Card variant="glass" className="p-8 rounded-3xl shadow-xl">
          {isSubmitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Reset Link Dispatched</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                If an account exists for <strong>{email}</strong>, you will receive a secure password reset link shortly.
              </p>
              <div className="pt-2">
                <Link to="/login">
                  <Button variant="outline" size="sm" fullWidth leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
                    Return to sign in
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100 text-xs text-rose-600 font-medium">
                  {error}
                </div>
              )}

              <Input
                label="Registered Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                autoFocus
              />

              <Button
                type="submit"
                fullWidth
                size="md"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Send Recovery Instructions
              </Button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to login</span>
                </Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}

