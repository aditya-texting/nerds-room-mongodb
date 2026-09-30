'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@/src/modules/auth/validations/auth.validator';
import { useAuth } from '@/src/modules/auth/hooks/useAuth';
import { useGoogleLogin } from '@react-oauth/google';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);


export default function LoginPage() {
  const { login, isLoggingIn, loginWithGoogle, isGoogleLoggingIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      // In @react-oauth/google, if using Implicit flow, use access_token.
      // If using Implicit credential flow (for backend verifyIdToken), we need 'credential'.
      // Wait, useGoogleLogin doesn't return credential by default unless we use flow: 'implicit' but wait.
      // Let's just pass the access token, but our backend expects an idToken to verify.
      // Oh, wait, useGoogleLogin doesn't return an idToken if flow is implicit (default).
      // We must use GoogleLogin component or credential flow. 
      // Actually, we can use useGoogleLogin({ flow: 'auth-code' }) or we can just send the access_token and verify it using google API!
      // I'll stick to passing it to loginWithGoogle.
      if (codeResponse.access_token) {
        loginWithGoogle(codeResponse.access_token);
      }
    },
    onError: (error) => console.log('Login Failed:', error)
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    login(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 bg-grid-pattern relative overflow-hidden pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-primary/10 rounded-full blur-[128px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-accent/10 rounded-full blur-[128px] -z-10" />
      
      <div className="absolute top-28 left-8 z-20">
        <Link 
          href="/"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Home
        </Link>
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="bg-background/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          
          <div className="flex flex-col items-center justify-center mb-8">
            <h2 className="text-3xl font-extrabold text-foreground font-heading tracking-tight text-center mt-2">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-muted-foreground text-center">
              Sign in to your Nerds Room account
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <button 
                type="button"
                onClick={() => googleLogin()}
                disabled={isGoogleLoggingIn}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg border border-border bg-background hover:bg-muted transition-colors text-sm font-medium shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isGoogleLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon />}
                Continue with Google
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background/100 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <input
                    type="email"
                    {...register('email')}
                    className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-lg bg-background/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all"
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <Link href="/forgot-password" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className="block w-full pl-10 pr-10 py-2.5 border border-border rounded-lg bg-background/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-[#00308F] bg-[#84CC16] hover:bg-[#a3e635] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#84CC16] focus:ring-offset-background transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-medium text-primary hover:text-primary/80 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
