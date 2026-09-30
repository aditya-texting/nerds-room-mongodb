import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authService } from '../services/auth.service';
import { useAuthContext } from '@/src/providers/auth-provider';

interface OnboardingInput {
  phone: string;
  userType: 'COLLEGE_STUDENT' | 'WORKING_PROFESSIONAL' | 'OTHER';
  role: 'PARTICIPANT' | 'ORGANIZER';
  organisationName?: string;
  jobRole?: string;
}

export const useOnboarding = () => {
  const router = useRouter();
  const { fetchUser } = useAuthContext();

  const onboardingMutation = useMutation({
    mutationFn: (data: OnboardingInput) => authService.onboarding(data),
    onSuccess: async (data) => {
      // Show the backend message (includes 24-48hr notice for organizers)
      toast.success(data?.message || 'Profile complete!');
      // Re-fetch user so context has updated role/status
      await fetchUser();
      router.push('/');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to save profile. Please try again.';
      toast.error(message);
    },
  });

  return {
    completeOnboarding: onboardingMutation.mutate,
    isSubmitting: onboardingMutation.isPending,
  };
};
