import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, Mail, Lock, User, Globe, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { registerSchema } from '@nexus/validation';
import { useAuthStore } from './authStore';
import { useToastStore } from '@/components/ui/Toast';

export function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [timezone] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuthStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = registerSchema.safeParse({
      fullName,
      email,
      password,
      confirmPassword,
      timezone,
    });

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      const formatted: Record<string, string> = {};
      Object.entries(fieldErrors).forEach(([k, v]) => {
        if (v && v[0]) formatted[k] = v[0];
      });
      setErrors(formatted);
      return;
    }

    setIsSubmitting(true);
    const result = await register({
      fullName,
      email,
      password,
      confirmPassword,
      timezone,
    });
    setIsSubmitting(false);

    if (result.success) {
      addToast({
        type: 'success',
        title: 'Account Created',
        message: 'Welcome to NEXUS. Your workspace is ready.',
      });
      navigate('/dashboard', { replace: true });
    } else {
      setErrors({ general: result.error || 'Registration failed' });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 nexus-bg-mesh">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-3xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create your account</h1>
          <p className="text-xs text-slate-500 mt-1">One workspace for your entire life.</p>
        </div>

        {/* Form Card */}
        <Card variant="glass" className="p-8 rounded-3xl shadow-xl">
          {errors.general && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-100 text-xs text-rose-600 font-medium">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Input
              label="Full Name"
              placeholder="e.g. Cassius Vance"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              error={errors.fullName}
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              placeholder="At least 8 chars, 1 uppercase & 1 number"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-slate-500 text-xs">
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span>Timezone: <strong>{timezone}</strong> (auto-detected)</span>
            </div>

            <Button
              type="submit"
              fullWidth
              size="md"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="mt-2"
            >
              Get Started
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-800">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

