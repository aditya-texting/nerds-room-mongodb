import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { ResetPasswordInput } from '../validations/auth.validator';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export const useForgotPassword = () => {
  const router = useRouter();

  const sendOtpMutation = useMutation({
    mutationFn: (data: { email: string }) => authService.sendOtp(data),
    onSuccess: (data) => {
      toast.success(data?.message || 'OTP sent successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to send OTP';
      toast.error(message);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (data: { email: string; otp: string }) => authService.verifyOtp(data),
    onSuccess: (data) => {
      toast.success(data?.message || 'OTP verified!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Invalid OTP';
      toast.error(message);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordInput) => authService.resetPassword(data),
    onSuccess: (data) => {
      toast.success(data?.message || 'Password reset successfully!');
      router.push('/login');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to reset password';
      toast.error(message);
    },
  });

  return {
    sendOtp: sendOtpMutation.mutate,
    isSendingOtp: sendOtpMutation.isPending,
    verifyOtp: verifyOtpMutation.mutate,
    isVerifyingOtp: verifyOtpMutation.isPending,
    resetPassword: resetPasswordMutation.mutate,
    isResetting: resetPasswordMutation.isPending,
  };
};
