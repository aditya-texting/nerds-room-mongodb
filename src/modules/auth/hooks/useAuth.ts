import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { LoginInput } from '../validations/auth.validator';
import { useAuthContext } from '@/src/providers/auth-provider';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const router = useRouter();
  const { fetchUser, clearUser } = useAuthContext();

  const loginMutation = useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: async (data) => {
      toast.success(data?.message || 'Login successful!');
      await fetchUser(); // ← fetch + store user in context immediately
      router.push('/');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'An error occurred during login';
      toast.error(message);
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: (credential: string) => authService.loginWithGoogle(credential),
    onSuccess: async (data) => {
      toast.success(data?.message || 'Google Login successful!');
      await fetchUser(); // ← fetch + store user in context immediately
      router.push('/');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to authenticate with Google';
      toast.error(message);
    },
  });

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginWithGoogle: googleLoginMutation.mutate,
    isGoogleLoggingIn: googleLoginMutation.isPending,
    clearUser,
  };
};
