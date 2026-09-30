'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useGoogleLogin } from '@react-oauth/google';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { simpleRegisterSchema, SimpleRegisterInput } from '@/src/modules/auth/validations/register.validator';
import { authService } from '@/src/modules/auth/services/auth.service';
import { useAuthContext } from '@/src/providers/auth-provider';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

type Method = 'choose' | 'email';

export default function RegisterPage() {
  const router = useRouter();
  const { fetchUser } = useAuthContext();
  const [method, setMethod] = useState<Method>('choose');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<SimpleRegisterInput>({
    resolver: zodResolver(simpleRegisterSchema),
  });

  const password = watch('password') || '';

  const passwordRules = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Number', met: /[0-9]/.test(password) },
  ];

  const registerMutation = useMutation({
    mutationFn: (data: SimpleRegisterInput) =>
      authService.register({ name: data.name, email: data.email, password: data.password }),
    onSuccess: async (data) => {
      toast.success(data?.message || 'Account created!');
      await fetchUser(); 
      router.push('/');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });

  // Google register/login
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setIsGoogleLoading(true);
      try {
        const data = await authService.loginWithGoogle(codeResponse.access_token);
        toast.success(data?.message || 'Signed in with Google!');
        await fetchUser();
        router.push('/');
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Google sign-in failed');
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => toast.error('Google sign-in failed'),
  });

  const onSubmit = (data: SimpleRegisterInput) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-grid-pattern relative overflow-hidden pt-32 pb-12 px-4">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-primary/10 rounded-full blur-[128px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-accent/10 rounded-full blur-[128px] -z-10" />

      <div className="absolute top-28 left-8 z-20">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-background/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-foreground font-heading tracking-tight">
              Create Account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <AnimatePresence mode="wait">
            {/* ─── CHOOSE METHOD ─── */}
            {method === 'choose' && (
              <motion.div
                key="choose"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Google */}
                <button
                  onClick={() => googleLogin()}
                  disabled={isGoogleLoading}
                  className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl border border-border bg-background hover:bg-muted transition-all text-sm font-medium shadow-sm disabled:opacity-70 group"
                >
                  {isGoogleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon />}
                  <span>Continue with Google</span>
                  <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 text-xs text-muted-foreground/60 bg-transparent">or</span>
                  </div>
                </div>

                {/* Email */}
                <button
                  onClick={() => setMethod('email')}
                  className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl border border-border bg-background hover:bg-muted transition-all text-sm font-medium shadow-sm group"
                >
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <span>Continue with Email</span>
                  <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </button>
              </motion.div>
            )}

            {/* ─── EMAIL FORM ─── */}
            {method === 'email' && (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button
                  onClick={() => setMethod('choose')}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        {...register('name')}
                        className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-lg bg-background/50 focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-all"
                        placeholder="Kanhaiya Garg"
                      />
                    </div>
                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="email"
                        {...register('email')}
                        className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-lg bg-background/50 focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-all"
                        placeholder="you@example.com"
                      />
                    </div>
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        {...register('password')}
                        className="block w-full pl-10 pr-10 py-2.5 border border-border rounded-lg bg-background/50 focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-all"
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={() => setShowPassword(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                    {/* Password rules */}
                    {password.length > 0 && (
                      <div className="grid grid-cols-2 gap-1 mt-2">
                        {passwordRules.map((r, i) => (
                          <div key={i} className={`flex items-center gap-1.5 text-xs ${r.met ? 'text-green-500' : 'text-muted-foreground/60'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${r.met ? 'bg-green-500' : 'bg-muted-foreground/40'}`} />
                            {r.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        {...register('confirmPassword')}
                        className="block w-full pl-10 pr-10 py-2.5 border border-border rounded-lg bg-background/50 focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-all"
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={() => setShowConfirm(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={registerMutation.isPending}
                    className="w-full flex justify-center py-2.5 px-4 rounded-lg text-sm font-bold text-[#00308F] bg-[#84CC16] hover:bg-[#a3e635] transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                  >
                    {registerMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-xs text-muted-foreground/60 mt-6">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-foreground">Terms</Link> and{' '}
            <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
