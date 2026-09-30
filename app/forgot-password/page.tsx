'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, KeyRound, Lock, ShieldCheck, Loader2, Check, X, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  forgotPasswordSchema,
  setPasswordSchema,
  ForgotPasswordInput,
  SetPasswordInput,
} from '@/src/modules/auth/validations/auth.validator';
import { useForgotPassword } from '@/src/modules/auth/hooks/useForgotPassword';

// step 1 → email sent
// step 2 → otp verify (with resend timer)
// step 3 → password reset (otp field gone)

const RESEND_TIMEOUT = 60; // seconds

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Resend timer
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { sendOtp, isSendingOtp, verifyOtp, isVerifyingOtp, resetPassword, isResetting } =
    useForgotPassword();

  // Step 1 form
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });

  // Step 3 form — only newPassword + confirmPassword (email & otp come from state)
  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    watch,
    formState: { errors: resetErrors },
  } = useForm<SetPasswordInput>({
    resolver: zodResolver(setPasswordSchema),
  });

  const newPassword = watch('newPassword') || '';

  const passwordRules = [
    { label: 'Minimum 8 characters', met: newPassword.length >= 8 },
    { label: 'Uppercase letter', met: /[A-Z]/.test(newPassword) },
    { label: 'Lowercase letter', met: /[a-z]/.test(newPassword) },
    { label: 'Number', met: /[0-9]/.test(newPassword) },
    { label: 'Special character', met: /[^A-Za-z0-9]/.test(newPassword) },
  ];

  // Start the countdown timer
  const startTimer = () => {
    setTimer(RESEND_TIMEOUT);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Step 1 submit — send OTP
  const onEmailSubmit = (data: ForgotPasswordInput) => {
    setEmail(data.email);
    sendOtp(data, {
      onSuccess: () => {
        setStep(2);
        startTimer();
      },
    });
  };

  // Resend OTP
  const handleResend = () => {
    sendOtp(
      { email },
      {
        onSuccess: () => {
          startTimer();
          setOtp('');
          setOtpError('');
        },
      }
    );
  };

  // Step 2 — verify OTP
  const handleVerifyOtp = () => {
    if (otp.length !== 6) {
      setOtpError('Please enter the 6-digit OTP');
      return;
    }
    setOtpError('');
    verifyOtp(
      { email, otp },
      {
        onSuccess: () => {
          setStep(3);
        },
        onError: (error: any) => {
          setOtpError(error.response?.data?.message || 'Invalid OTP');
        },
      }
    );
  };

  // Step 3 — reset password (merge email + otp from state into the API payload)
  const onResetSubmit = (data: SetPasswordInput) => {
    resetPassword({
      email,
      otp,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    });
  };

  // Header meta per step
  const stepMeta = {
    1: {
      icon: <KeyRound className="w-5 h-5 text-primary" />,
      title: 'Forgot Password',
      subtitle: "Enter your email and we'll send you an OTP",
    },
    2: {
      icon: <ShieldCheck className="w-5 h-5 text-primary" />,
      title: 'Verify OTP',
      subtitle: `We sent a 6-digit OTP to ${email}`,
    },
    3: {
      icon: <Lock className="w-5 h-5 text-primary" />,
      title: 'New Password',
      subtitle: 'OTP verified! Set your new password below.',
    },
  };

  const meta = stepMeta[step];

  return (
    <div className="min-h-screen flex items-center justify-center bg-grid-pattern relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-primary/10 rounded-full blur-[128px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-accent/10 rounded-full blur-[128px] -z-10" />

      <div className="absolute top-8 left-8 z-20">
        <Link
          href="/login"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Login
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-background/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl">

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-6 bg-primary'
                    : s < step
                    ? 'w-4 bg-primary/50'
                    : 'w-4 bg-border'
                }`}
              />
            ))}
          </div>

          {/* Header */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              {meta.icon}
            </div>
            <h2 className="text-2xl font-extrabold text-foreground font-heading tracking-tight text-center">
              {meta.title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground text-center">{meta.subtitle}</p>
          </div>

          {/* ─── STEP 1: EMAIL ─── */}
          {step === 1 && (
            <form className="space-y-5" onSubmit={handleEmailSubmit(onEmailSubmit)}>
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <input
                    type="email"
                    autoComplete="email"
                    disabled={isSendingOtp}
                    className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-lg bg-background/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all disabled:opacity-50"
                    placeholder="you@example.com"
                    {...registerEmail('email')}
                  />
                </div>
                {emailErrors.email && (
                  <p className="text-xs text-red-500 mt-1">{emailErrors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSendingOtp}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSendingOtp ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send OTP'}
              </button>
            </form>
          )}

          {/* ─── STEP 2: VERIFY OTP ─── */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Email read-only */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-lg bg-muted/40 sm:text-sm opacity-60 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* OTP input */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">Enter OTP</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, ''));
                      setOtpError('');
                    }}
                    disabled={isVerifyingOtp}
                    className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-lg bg-background/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all tracking-[0.5em] font-mono disabled:opacity-50"
                    placeholder="••••••"
                  />
                </div>
                {otpError && <p className="text-xs text-red-500 mt-1">{otpError}</p>}
              </div>

              {/* Verify button */}
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isVerifyingOtp || otp.length !== 6}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isVerifyingOtp ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify OTP'}
              </button>

              {/* Resend row */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-muted-foreground">
                  {timer > 0 ? (
                    <>
                      Resend in{' '}
                      <span className="font-semibold text-foreground tabular-nums">
                        0:{String(timer).padStart(2, '0')}
                      </span>
                    </>
                  ) : (
                    "Didn't receive the OTP?"
                  )}
                </span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={timer > 0 || isSendingOtp}
                  className="text-xs font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSendingOtp ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin inline" />
                  ) : (
                    'Resend OTP'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 3: NEW PASSWORD ─── */}
          {step === 3 && (
            <form className="space-y-5" onSubmit={handleResetSubmit(onResetSubmit)}>
              {/* OTP verified badge */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-xs font-medium text-green-600 dark:text-green-400">
                  OTP verified successfully
                </span>
              </div>

              {/* New Password */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    disabled={isResetting}
                    className="block w-full pl-10 pr-10 py-2.5 border border-border rounded-lg bg-background/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all disabled:opacity-50"
                    placeholder="••••••••"
                    {...registerReset('newPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((p) => !p)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {resetErrors.newPassword && (
                  <p className="text-xs text-red-500 mt-1">{resetErrors.newPassword.message}</p>
                )}

                {/* Password strength checklist */}
                {newPassword.length > 0 && (
                  <div className="mt-3 p-3 rounded-lg border border-border/50 bg-muted/20 space-y-1.5">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Password requirements
                    </p>
                    {passwordRules.map((rule, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        {rule.met ? (
                          <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-red-500/60 flex-shrink-0" />
                        )}
                        <span className={`text-xs ${rule.met ? 'text-green-500 font-medium' : 'text-muted-foreground'}`}>
                          {rule.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    disabled={isResetting}
                    className="block w-full pl-10 pr-10 py-2.5 border border-border rounded-lg bg-background/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all disabled:opacity-50"
                    placeholder="••••••••"
                    {...registerReset('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {resetErrors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">{resetErrors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isResetting}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isResetting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
