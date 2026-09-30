import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authService } from '../services/auth.service';
import { SimpleRegisterInput } from '../validations/register.validator';

export const useRegister = () => {
  const router = useRouter();

  const registerMutation = useMutation({
    mutationFn: (data: SimpleRegisterInput) =>
      authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      }),
    onSuccess: (data) => {
      toast.success(data?.message || 'Account created successfully!');
      router.push('/login?registered=1');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    },
  });

  return {
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
  };
};
