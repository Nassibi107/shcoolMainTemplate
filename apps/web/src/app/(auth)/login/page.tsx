'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, School, BookOpen } from 'lucide-react';
import { login, getDashboardRoute } from '@/lib/auth';
import { Button } from '@/components/ui/Button';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);
    try {
      const user = await login(values.email, values.password);
      router.push(getDashboardRoute(user.role));
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setServerError(
        axiosError.response?.data?.message ?? 'Invalid credentials. Please try again.',
      );
    }
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-secondary/20 blur-3xl" />
      </div>

      {/* Login card */}
      <div className="relative w-full max-w-md animate-fade-in">
        {/* School branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent mb-4 shadow-lg">
            <School className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-heading font-bold text-white text-3xl tracking-tight">
            Scope School
          </h1>
          <p className="text-white/60 mt-1.5 text-sm">Modern School Management</p>
        </div>

        {/* Form card */}
        <div className="bg-card rounded-card shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="font-heading font-bold text-primary text-xl">Welcome back</h2>
            <p className="text-muted text-sm mt-1">Sign in to your school account</p>
          </div>

          {serverError && (
            <div className="flex items-center gap-2.5 p-3.5 mb-5 bg-danger/10 border border-danger/20 rounded-input">
              <BookOpen className="w-4 h-4 text-danger shrink-0" />
              <p className="text-danger text-sm">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-app-text">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="admin@scopeschool.io"
                {...register('email')}
                className={`input-field ${errors.email ? 'border-danger focus:ring-danger/40' : ''}`}
              />
              {errors.email && (
                <p className="text-xs text-danger">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-app-text">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={`input-field pr-10 ${errors.password ? 'border-danger focus:ring-danger/40' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-danger">{errors.password.message}</p>
              )}
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    {...register('rememberMe')}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 rounded-full bg-border peer-checked:bg-accent transition-colors duration-200" />
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 peer-checked:translate-x-5" />
                </div>
                <span className="text-sm text-app-text select-none">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-accent hover:text-[#00a891] font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              isLoading={isSubmitting}
              size="lg"
              className="w-full mt-2 hover:shadow-[0_0_20px_rgba(0,194,168,0.4)]"
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-white/40 text-xs mt-6">
          © {new Date().getFullYear()} Scope School · Secure Login
        </p>
      </div>
    </div>
  );
}
