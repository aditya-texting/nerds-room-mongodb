"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useAuthContext } from "@/src/providers/auth-provider";
import { useRegisterEvent } from "@/src/modules/events/hooks/useEvents";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, ChevronLeft, ChevronRight, Loader2, CheckCircle } from "lucide-react";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  event: any;
}

const COUNTRY_CODES = [
  { code: '+91', flag: '🇮🇳' },
  { code: '+1', flag: '🇺🇸' },
  { code: '+44', flag: '🇬🇧' },
  { code: '+971', flag: '🇦🇪' },
];

const createDynamicSchema = (formFields: any[]) => {
  const shape: any = {
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    countryCode: z.string().min(1),
    phone: z.string()
      .min(5, 'Phone number too short')
      .max(15, 'Phone number too long')
      .regex(/^\d+$/, 'Only digits allowed'),
  };

  formFields?.forEach((field) => {
    let fieldSchema: any;
    if (field.fieldType === "CHECKBOX") {
      fieldSchema = z.array(z.string());
      if (field.isRequired) {
        fieldSchema = fieldSchema.min(1, "Please select at least one option");
      } else {
        fieldSchema = fieldSchema.optional();
      }
    } else if (field.fieldType === "EMAIL") {
      fieldSchema = z.string();
      if (field.isRequired) {
        fieldSchema = fieldSchema.min(1, "Email is required").email("Invalid email");
      } else {
        fieldSchema = fieldSchema.optional().or(z.literal(""));
      }
    } else {
      fieldSchema = z.string();
      if (field.isRequired) {
        fieldSchema = fieldSchema.min(1, "This field is required");
      } else {
        fieldSchema = fieldSchema.optional().or(z.literal(""));
      }
    }
    shape[field.id] = fieldSchema;
  });

  return z.object(shape).superRefine((data: any, ctx) => {
    if (data.countryCode === '+91') {
      if (data.phone.length !== 10) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['phone'], message: 'Indian phone numbers must be exactly 10 digits' });
      } else if (!/^[6-9]\d{9}$/.test(data.phone)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['phone'], message: 'Invalid Indian mobile number (must start with 6, 7, 8, or 9)' });
      }
    } else if (data.countryCode === '+1') {
      if (data.phone.length !== 10) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['phone'], message: 'US phone numbers must be exactly 10 digits' });
      }
    }
  });
};

export default function RegistrationModal({ isOpen, onClose, onSuccess, event }: RegistrationModalProps) {
  const { user } = useAuthContext();
  const { mutateAsync: registerForEvent, isPending } = useRegisterEvent();

  const [currentStep, setCurrentStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyingFields, setVerifyingFields] = useState<Record<string, boolean>>({});
  const [verifiedFields, setVerifiedFields] = useState<Record<string, boolean>>({});

  useEffect(() => setMounted(true), []);

  // Prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const formFields = event?.formFields || [];
  const chunkedFormFields = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < formFields.length; i += 3) {
      chunks.push(formFields.slice(i, i + 3));
    }
    return chunks;
  }, [formFields]);

  const totalSteps = 1 + chunkedFormFields.length;

  const stepFields = useMemo(() => {
    const fields: string[][] = [["name", "email", "phone"]];
    chunkedFormFields.forEach((chunk) => {
      fields.push(chunk.map((f: any) => f.id));
    });
    return fields;
  }, [chunkedFormFields]);

  const dynamicSchema = useMemo(() => createDynamicSchema(formFields), [formFields]);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    reset,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(dynamicSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      countryCode: "+91",
      phone: "",
    },
  });

  useEffect(() => {
    if (isOpen && user) {
      const userPhone = user?.phone || "";
      let defaultCountryCode = "+91";
      let defaultPhoneNum = "";
      
      const matchedCode = COUNTRY_CODES.find(c => userPhone.startsWith(c.code));
      if (matchedCode) {
        defaultCountryCode = matchedCode.code;
        defaultPhoneNum = userPhone.substring(matchedCode.code.length);
      } else {
        defaultPhoneNum = userPhone;
      }

      reset({
        name: user?.name || "",
        email: user?.email || "",
        countryCode: defaultCountryCode,
        phone: defaultPhoneNum,
      });
      setCurrentStep(0);
    }
  }, [isOpen, user, reset]);

  if (!mounted) return null;
  if (!isOpen) return null;

  const handleProfileBlur = async (fieldId: string, fieldType: string) => {
    const value = getValues(fieldId as any) as string;
    if (!value) {
      clearErrors(fieldId as any);
      setVerifiedFields(prev => ({ ...prev, [fieldId]: false }));
      return;
    }

    const platform = fieldType === "GITHUB" ? "github" : null;
    if (!platform) return;

    setVerifyingFields(prev => ({ ...prev, [fieldId]: true }));
    setVerifiedFields(prev => ({ ...prev, [fieldId]: false }));
    clearErrors(fieldId as any);

    try {
      const res = await fetch(`/api/verify-profile?platform=${platform}&username=${encodeURIComponent(value)}`);
      const data = await res.json();
      if (data.valid) {
        clearErrors(fieldId as any);
        setVerifiedFields(prev => ({ ...prev, [fieldId]: true }));
      } else {
        setError(fieldId as any, { type: 'manual', message: data.message });
        setVerifiedFields(prev => ({ ...prev, [fieldId]: false }));
      }
    } catch {
      setError(fieldId as any, { type: 'manual', message: `Error verifying ${platform} profile.` });
      setVerifiedFields(prev => ({ ...prev, [fieldId]: false }));
    } finally {
      setVerifyingFields(prev => ({ ...prev, [fieldId]: false }));
    }
  };

  const verifyProfiles = async (fieldsToValidate: string[]) => {
    let isValid = true;
    for (const fieldId of fieldsToValidate) {
      const field = formFields.find((f: any) => f.id === fieldId);
      if (!field) continue;
      const value = getValues(fieldId as any) as string;
      if (!value) continue;

      const platform = field.fieldType === "GITHUB" ? "github" : null;
      if (!platform) continue;

      try {
        const res = await fetch(`/api/verify-profile?platform=${platform}&username=${encodeURIComponent(value)}`);
        const data = await res.json();
        if (!data.valid) {
          setError(fieldId as any, { type: 'manual', message: data.message });
          setVerifiedFields(prev => ({ ...prev, [fieldId]: false }));
          isValid = false;
        } else {
          clearErrors(fieldId as any);
          setVerifiedFields(prev => ({ ...prev, [fieldId]: true }));
        }
      } catch {
        setError(fieldId as any, { type: 'manual', message: `Error verifying ${platform} profile.` });
        setVerifiedFields(prev => ({ ...prev, [fieldId]: false }));
        isValid = false;
      }
    }
    return isValid;
  };

  const handleNext = async () => {
    const fieldsToValidate = stepFields[currentStep];
    const isStepValid = await trigger(fieldsToValidate as any);
    if (!isStepValid) return;

    setIsVerifying(true);
    const isProfilesValid = await verifyProfiles(fieldsToValidate);
    setIsVerifying(false);

    if (isProfilesValid) {
      setCurrentStep((p) => Math.min(p + 1, totalSteps - 1));
    }
  };

  const handlePrev = () => {
    setCurrentStep((p) => Math.max(p - 1, 0));
  };

  const onSubmit = async (data: any) => {
    if (!user) {
      toast.error("You must be logged in to register.");
      return;
    }

    try {
      // The API only expects answers. Standard fields like name/email/phone 
      // are editable in form but not currently sent to API payload for custom answers.
      // If we wanted to update user profile, we would do it here.
      const fieldsToValidate = stepFields[currentStep];
      setIsVerifying(true);
      const isProfilesValid = await verifyProfiles(fieldsToValidate);
      setIsVerifying(false);

      if (!isProfilesValid) return;

      const formattedAnswers = formFields.map((f: any) => {
        let val = data[f.id] || (f.fieldType === "CHECKBOX" ? [] : "");
        if (f.fieldType === "LINKEDIN" && val) val = `https://linkedin.com/in/${val}`;
        if (f.fieldType === "GITHUB" && val) val = `https://github.com/${val}`;
        return { fieldId: f.id, value: val };
      });

      await registerForEvent({ id: event.id, data: { answers: formattedAnswers } });
      toast.success("Successfully registered for the event!");
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to register.");
    }
  };


  const isLastStep = currentStep === totalSteps - 1;

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-background w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border shadow-[0_0_50px_rgba(0,0,0,0.3)] p-6 sm:p-8 animate-in zoom-in-95 duration-200 relative scrollbar-thin">
        <h3 className="text-2xl font-extrabold text-foreground mb-1">Register for {event.name}</h3>
        {totalSteps > 1 && (
          <p className="text-muted-foreground mb-6 text-sm">
            Step {currentStep + 1} of {totalSteps}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className={totalSteps > 1 ? "space-y-6" : "space-y-6 mt-6"}>
          
          {currentStep === 0 && (
            <div className="space-y-4 p-5 rounded-xl border border-border">
              <h4 className="font-bold text-base text-foreground mb-3">Participant Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-foreground">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    className="w-full p-2.5 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition text-sm text-foreground shadow-sm"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-foreground">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full p-2.5 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition text-sm text-foreground shadow-sm"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1.5 text-foreground">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      {...register("countryCode")}
                      className="w-24 p-2.5 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition text-sm text-foreground shadow-sm cursor-pointer"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      inputMode="numeric"
                      {...register("phone")}
                      className="flex-1 w-full p-2.5 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition text-sm text-foreground shadow-sm"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message as string}</p>}
                </div>
              </div>
            </div>
          )}

          {currentStep > 0 && chunkedFormFields[currentStep - 1] && (
            <div className="space-y-5">
              <h4 className="font-bold text-base text-foreground mb-3">Additional Information</h4>
              {chunkedFormFields[currentStep - 1].map((field: any) => (
                <div key={field.id} className="space-y-2 p-5 rounded-xl border border-border">
                  <label className="block text-sm font-bold text-foreground">
                    {field.fieldName} {field.isRequired && <span className="text-red-500">*</span>}
                  </label>

                  {field.fieldType === "TEXT" && (
                    <input
                      type="text"
                      {...register(field.id)}
                      className="w-full p-2.5 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition text-sm text-foreground shadow-sm"
                    />
                  )}

                  {field.fieldType === "EMAIL" && (
                    <input
                      type="email"
                      {...register(field.id)}
                      className="w-full p-2.5 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition text-sm text-foreground shadow-sm"
                    />
                  )}

                  {field.fieldType === "NUMBER" && (
                    <input
                      type="number"
                      {...register(field.id)}
                      className="w-full p-2.5 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition text-sm text-foreground shadow-sm"
                    />
                  )}

                  {field.fieldType === "TEXTAREA" && (
                    <textarea
                      rows={2}
                      {...register(field.id)}
                      className="w-full p-2.5 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition text-sm text-foreground resize-y shadow-sm"
                    />
                  )}

                  {field.fieldType === "LINKEDIN" && (
                    <div className="flex border border-border rounded-lg shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary overflow-hidden transition">
                      <span className="flex items-center px-3 bg-secondary/30 text-muted-foreground text-sm border-r border-border">linkedin.com/in/</span>
                      <input
                        type="text"
                        {...register(field.id)}
                        className="flex-1 p-2.5 bg-background outline-none text-sm text-foreground"
                      />
                    </div>
                  )}

                  {field.fieldType === "GITHUB" && (
                    <div className="relative">
                      <div className={`flex border rounded-lg shadow-sm overflow-hidden transition ${
                        verifiedFields[field.id] ? 'border-green-500 ring-1 ring-green-500/30' :
                        errors[field.id] ? 'border-red-500 ring-1 ring-red-500/30' :
                        'border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary'
                      }`}>
                        <span className="flex items-center px-3 bg-secondary/30 text-muted-foreground text-sm border-r border-border">github.com/</span>
                        <input
                          type="text"
                          {...register(field.id, {
                            onBlur: () => handleProfileBlur(field.id, field.fieldType)
                          })}
                          className="flex-1 p-2.5 bg-background outline-none text-sm text-foreground pr-10"
                        />
                        {verifyingFields[field.id] && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Loader2 className="w-4 h-4 text-primary animate-spin" />
                          </span>
                        )}
                        {verifiedFields[field.id] && !verifyingFields[field.id] && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {field.fieldType === "SELECT" && (
                    <select
                      {...register(field.id)}
                      className="w-full p-2.5 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition text-sm text-foreground shadow-sm"
                    >
                      <option value="">Select an option...</option>
                      {field.options?.map((opt: string) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}

                  {field.fieldType === "RADIO" && (
                    <div className="flex flex-col gap-3 mt-3">
                      {field.options?.map((opt: string) => (
                        <label key={opt} className="flex items-center gap-3 cursor-pointer text-sm font-medium text-foreground hover:text-primary transition">
                          <input
                            type="radio"
                            value={opt}
                            {...register(field.id)}
                            className="w-5 h-5 text-primary bg-background border-border focus:ring-primary"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {field.fieldType === "CHECKBOX" && (
                    <div className="flex flex-col gap-3 mt-3">
                      <Controller
                        name={field.id}
                        control={control}
                        defaultValue={[]}
                        render={({ field: controllerField }) => (
                          <>
                            {field.options?.map((opt: string) => {
                              const isChecked = (controllerField.value as string[])?.includes(opt);
                              return (
                                <label key={opt} className="flex items-center gap-3 cursor-pointer text-sm font-medium text-foreground hover:text-primary transition">
                                  <input
                                    type="checkbox"
                                    value={opt}
                                    checked={isChecked}
                                    onChange={(e) => {
                                      const currentValue = (controllerField.value as string[]) || [];
                                      if (e.target.checked) {
                                        controllerField.onChange([...currentValue, opt]);
                                      } else {
                                        controllerField.onChange(currentValue.filter((v: string) => v !== opt));
                                      }
                                    }}
                                    className="w-5 h-5 text-primary bg-background border-border rounded focus:ring-primary"
                                  />
                                  <span>{opt}</span>
                                </label>
                              );
                            })}
                          </>
                        )}
                      />
                    </div>
                  )}

                  {errors[field.id] && <p className="text-red-500 text-xs mt-1.5">{errors[field.id]?.message as string}</p>}
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center pt-6 border-t border-border mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending || isVerifying}
              className="px-5 py-2 font-semibold rounded-lg text-muted-foreground hover:text-white hover:bg-secondary transition disabled:opacity-50 text-sm"
            >
              Cancel
            </button>
            <div className="flex items-center gap-3">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={isPending || isVerifying}
                  className="px-5 py-2 font-semibold rounded-lg text-foreground hover:text-white hover:bg-secondary border border-border transition disabled:opacity-50 text-sm flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              )}
              
              {!isLastStep ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isVerifying}
                  className="px-6 py-2 font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition shadow-md disabled:opacity-50 text-sm flex items-center gap-1.5"
                >
                  {isVerifying ? "Verifying..." : "Next"} <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isPending || isVerifying || !user}
                  className="px-6 py-2 font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition shadow-md disabled:opacity-50 text-sm flex items-center gap-1.5"
                >
                  {isPending || isVerifying ? "Processing..." : "Complete Registration"} <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
