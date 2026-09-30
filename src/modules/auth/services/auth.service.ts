import { apiClient } from '@/src/core/axios';
import { LoginInput, ResetPasswordInput } from '../validations/auth.validator';
import { SimpleRegisterInput } from '../validations/register.validator';

export const authService = {
  login: async (data: LoginInput) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },
  loginWithGoogle: async (credential: string) => {
    const response = await apiClient.post('/auth/google', { credential });
    return response.data;
  },
  register: async (data: Omit<SimpleRegisterInput, 'confirmPassword'>) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },
  onboarding: async (data: {
    phone: string;
    userType: 'COLLEGE_STUDENT' | 'WORKING_PROFESSIONAL' | 'OTHER';
    role: 'PARTICIPANT' | 'ORGANIZER';
    organisationName?: string;
    jobRole?: string;
  }) => {
    const response = await apiClient.patch('/auth/onboarding', data);
    return response.data;
  },
  checkPhone: async (phone: string): Promise<{ exists: boolean }> => {
    const response = await apiClient.get(`/auth/check-phone?phone=${encodeURIComponent(phone)}`);
    return response.data;
  },
  sendOtp: async (data: { email: string }) => { 
    const response = await apiClient.post('/auth/forgot-password/send-otp', data);
    return response.data;
  },
  verifyOtp: async (data: { email: string; otp: string }) => {
    const response = await apiClient.post('/auth/forgot-password/verify-otp', data);
    return response.data;
  },
  resetPassword: async (data: ResetPasswordInput) => {
    const response = await apiClient.post('/auth/forgot-password/reset', data);
    return response.data;
  },
};
