'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, Briefcase, GraduationCap, Users, Megaphone,
  Loader2, ArrowRight, ArrowLeft, CheckCircle2, Building2, UserCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthContext } from '@/src/providers/auth-provider';
import { useOnboarding } from '@/src/modules/auth/hooks/useOnboarding';
import { authService } from '@/src/modules/auth/services/auth.service';

const COUNTRY_CODES = [
  { code: '+91', flag: '🇮🇳', label: 'IN' },
  { code: '+1', flag: '🇺🇸', label: 'US' },
  { code: '+44', flag: '🇬🇧', label: 'GB' },
  { code: '+61', flag: '🇦🇺', label: 'AU' },
  { code: '+971', flag: '🇦🇪', label: 'AE' },
  { code: '+65', flag: '🇸🇬', label: 'SG' },
  { code: '+49', flag: '🇩🇪', label: 'DE' },
  { code: '+33', flag: '🇫🇷', label: 'FR' },
  { code: '+81', flag: '🇯🇵', label: 'JP' },
  { code: '+86', flag: '🇨🇳', label: 'CN' },
];

const phoneSchema = z.object({
  countryCode: z.string().min(1),
  phone: z
    .string()
    .min(5, 'Phone number too short')
    .max(15, 'Phone number too long')
    .regex(/^\d+$/, 'Only digits allowed'),
}).superRefine((data, ctx) => {
  if (data.countryCode === '+91') {
    if (data.phone.length !== 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['phone'],
        message: 'Indian phone numbers must be exactly 10 digits',
      });
    } else if (!/^[6-9]\d{9}$/.test(data.phone)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['phone'],
        message: 'Invalid Indian mobile number (must start with 6, 7, 8, or 9)',
      });
    }
  } else if (data.countryCode === '+1') {
    if (data.phone.length !== 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['phone'],
        message: 'US phone numbers must be exactly 10 digits',
      });
    }
  }
});
type PhoneInput = z.infer<typeof phoneSchema>;

const userTypeSchema = z.object({
  userType: z.enum(['COLLEGE_STUDENT', 'WORKING_PROFESSIONAL']),
  organisationName: z.string().optional(),
  jobRole: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.userType === 'WORKING_PROFESSIONAL') {
    if (!data.organisationName || data.organisationName.trim().length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['organisationName'], message: 'Organisation Name is required' });
    }
    if (!data.jobRole || data.jobRole.trim().length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['jobRole'], message: 'Designation is required' });
    }
  }
});
type UserTypeInput = z.infer<typeof userTypeSchema>;

type Role = 'PARTICIPANT' | 'ORGANIZER';

export function OnboardingModal() {
  const { user } = useAuthContext();
  const { completeOnboarding, isSubmitting } = useOnboarding();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [phoneData, setPhoneData] = useState<{ countryCode: string; phone: string } | null>(null);
  const [userTypeData, setUserTypeData] = useState<UserTypeInput | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);

  const {
    register: registerPhone,
    handleSubmit: handlePhoneSubmit,
    formState: { errors: phoneErrors },
  } = useForm<PhoneInput>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { countryCode: '+91' },
  });

  const {
    register: registerType,
    handleSubmit: handleTypeSubmit,
    watch: watchType,
    formState: { errors: typeErrors },
  } = useForm<UserTypeInput>({
    resolver: zodResolver(userTypeSchema),
  });

  const selectedType = watchType('userType');

  // Only render modal if user exists and hasn't onboarded yet (userType is OTHER)
  if (!user || user.userType !== 'OTHER') {
    return null;
  }

  const onPhoneSubmit = async (data: PhoneInput) => {
    setIsCheckingPhone(true);
    try {
      const full = `${data.countryCode}${data.phone}`;
      const result = await authService.checkPhone(full);
      
      if (result.exists) {
        toast.error('This phone number is already registered.');
      } else {
        setPhoneData({ countryCode: data.countryCode, phone: data.phone });
        setStep(2);
      }
    } catch (error) {
      toast.error('Failed to verify phone number. Try again.');
    } finally {
      setIsCheckingPhone(false);
    }
  };

  const onTypeSubmit = (data: UserTypeInput) => {
    setUserTypeData(data);
    setStep(3);
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
  };

  const handleFinalSubmit = () => {
    if (!phoneData || !userTypeData || !selectedRole) return;
    completeOnboarding({
      phone: `${phoneData.countryCode}${phoneData.phone}`,
      userType: userTypeData.userType,
      role: selectedRole,
      organisationName: userTypeData.organisationName,
      jobRole: userTypeData.jobRole,
    });
  };

  const stepLabels = ['Phone', 'About You', 'Your Role'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md px-4">
      {/* Premium Glassmorphic Card - Vertically Stable */}
      <div className="w-full max-w-[32rem] relative z-10 bg-background/95 backdrop-blur-2xl border border-border/50 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto overflow-x-hidden max-h-[90vh] ring-1 ring-black/5 custom-scrollbar">
        
        {/* Subtle Top Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary/80 via-primary to-primary/80" />

        {/* ─── HEADER & STEP INDICATOR INSIDE CARD ─── */}
        <div className="text-center mb-8 mt-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Complete Your Profile
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {user?.name ? `Welcome, ${user.name.split(' ')[0]}! ` : ''}Just a few steps to get started.
          </p>
        </div>

        {/* Modern Stepper (Ladder) */}
        <div className="relative flex items-center justify-between w-full max-w-[16rem] sm:max-w-xs mx-auto mb-12">
          {/* Background Track */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted/60 rounded-full" />
          
          {/* Active Track */}
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${((step - 1) / 2) * 100}%` }} 
          />

          {stepLabels.map((label, i) => {
            const s = (i + 1) as 1 | 2 | 3;
            const active = step >= s;
            const isCurrent = step === s;
            const done = step > s;
            
            return (
              <div key={label} className="relative z-10 flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-[2px] transition-all duration-500 bg-background ${
                  active ? 'border-primary text-primary shadow-md shadow-primary/20' : 'border-muted-foreground/30 text-muted-foreground'
                } ${isCurrent ? 'ring-4 ring-primary/20 scale-110' : ''}`}>
                  {done ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <span className="text-sm font-bold">{s}</span>}
                </div>
                <span className={`absolute top-10 text-[11px] font-bold whitespace-nowrap transition-colors duration-500 ${
                  isCurrent ? 'text-foreground' : active ? 'text-foreground/80' : 'text-muted-foreground'
                }`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            {/* ─── STEP 1: PHONE ─── */}
            {step === 1 && (
              <motion.div key="phone"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-foreground">Phone Number</h2>
                    <p className="text-xs text-muted-foreground">We'll use this for important event notifications.</p>
                  </div>
                </div>

                <form onSubmit={handlePhoneSubmit(onPhoneSubmit)} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-foreground ml-1">Mobile Number <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                      <select
                        {...registerPhone('countryCode')}
                        className="w-28 px-3 py-3 border border-border/60 rounded-xl bg-background hover:bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm font-medium cursor-pointer"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                        ))}
                      </select>

                      <div className="flex-1 relative">
                        <input
                          type="tel" inputMode="numeric" placeholder="9876543210"
                          {...registerPhone('phone')}
                          className="block w-full px-4 py-3 border border-border/60 rounded-xl bg-background hover:bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all sm:text-sm font-medium pr-10 shadow-sm"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          {isCheckingPhone && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                        </div>
                      </div>
                    </div>
                    {phoneErrors.phone && <motion.p initial={{ opacity:0, y:-5 }} animate={{ opacity:1, y:0 }} className="text-xs text-red-500 font-medium ml-1 mt-1">{phoneErrors.phone.message}</motion.p>}
                  </div>

                  <button
                    type="submit" disabled={isCheckingPhone}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            )}

            {/* ─── STEP 2: USER TYPE ─── */}
            {step === 2 && (
              <motion.div key="usertype"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-4 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Go Back
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <UserCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-foreground">I am a...</h2>
                    <p className="text-xs text-muted-foreground">Tell us a bit about your current status.</p>
                  </div>
                </div>

                <form onSubmit={handleTypeSubmit(onTypeSubmit)} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: 'COLLEGE_STUDENT', label: 'Student', icon: GraduationCap, desc: 'Currently studying' },
                      { value: 'WORKING_PROFESSIONAL', label: 'Professional', icon: Briefcase, desc: 'Employed / Freelance' },
                    ].map(({ value, label, icon: Icon, desc }) => {
                      const isSelected = selectedType === value;
                      return (
                        <label key={value} className={`relative flex flex-col items-center gap-2 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                          isSelected ? 'border-primary bg-primary/5 shadow-md shadow-primary/10 scale-[1.02]' : 'border-border/60 hover:border-border hover:bg-secondary/40'
                        }`}>
                          <input type="radio" value={value} {...registerType('userType')} className="sr-only" />
                          <Icon className={`w-8 h-8 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                          <div className="text-center mt-1">
                            <p className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>{label}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{desc}</p>
                          </div>
                          {isSelected && <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-primary animate-in zoom-in" />}
                        </label>
                      );
                    })}
                  </div>
                  {typeErrors.userType && <p className="text-xs text-red-500 font-medium ml-1">{typeErrors.userType.message}</p>}

                  <AnimatePresence>
                    {selectedType === 'WORKING_PROFESSIONAL' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden pt-2">
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-foreground ml-1">Organisation Name <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input {...registerType('organisationName')} placeholder="e.g. Google, Microsoft" className="block w-full pl-11 pr-4 py-3 border border-border/60 rounded-xl bg-background hover:bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all sm:text-sm shadow-sm" />
                          </div>
                          {typeErrors.organisationName && <p className="text-xs text-red-500 font-medium ml-1 mt-1">{typeErrors.organisationName.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-foreground ml-1">Your Role / Designation <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input {...registerType('jobRole')} placeholder="e.g. Software Engineer" className="block w-full pl-11 pr-4 py-3 border border-border/60 rounded-xl bg-background hover:bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all sm:text-sm shadow-sm" />
                          </div>
                          {typeErrors.jobRole && <p className="text-xs text-red-500 font-medium ml-1 mt-1">{typeErrors.jobRole.message}</p>}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button type="submit" disabled={!selectedType} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            )}

            {/* ─── STEP 3: ROLE ─── */}
            {step === 3 && (
              <motion.div key="role"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <button onClick={() => setStep(2)} className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-4 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Go Back
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-foreground">I am joining as...</h2>
                    <p className="text-xs text-muted-foreground">Select your primary role on the platform.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <button type="button" onClick={() => handleRoleSelect('PARTICIPANT')} disabled={isSubmitting} className={`group flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left disabled:opacity-60 relative ${selectedRole === 'PARTICIPANT' ? 'border-primary bg-primary/5 shadow-md shadow-primary/10 scale-[1.02]' : 'border-border/60 hover:border-primary/50 hover:bg-secondary/40'}`}>
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold text-base ${selectedRole === 'PARTICIPANT' ? 'text-primary' : 'text-foreground'}`}>Participant</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Discover, register, and join hackathons, competitions & amazing events.</p>
                    </div>
                    {selectedRole === 'PARTICIPANT' ? <CheckCircle2 className="w-5 h-5 text-primary animate-in zoom-in" /> : <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />}
                  </button>

                  <button type="button" onClick={() => handleRoleSelect('ORGANIZER')} disabled={isSubmitting} className={`group flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left disabled:opacity-60 relative overflow-hidden ${selectedRole === 'ORGANIZER' ? 'border-primary bg-primary/5 shadow-md shadow-primary/10 scale-[1.02]' : 'border-border/60 hover:border-primary/50 hover:bg-secondary/40'}`}>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Megaphone className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold text-base ${selectedRole === 'ORGANIZER' ? 'text-primary' : 'text-foreground'}`}>Organizer</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Host and manage your own events & hackathons seamlessly.</p>
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20">
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold tracking-wide uppercase">Requires Approval (24-48 hrs)</span>
                      </div>
                    </div>
                    {selectedRole === 'ORGANIZER' ? <CheckCircle2 className="w-5 h-5 text-primary animate-in zoom-in" /> : <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />}
                  </button>
                </div>

                <div className="mt-6">
                  <button onClick={handleFinalSubmit} disabled={!selectedRole || isSubmitting} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
                    Complete Profile <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {isSubmitting && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-3xl">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <p className="text-sm font-bold text-foreground animate-pulse">Setting up your profile...</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
