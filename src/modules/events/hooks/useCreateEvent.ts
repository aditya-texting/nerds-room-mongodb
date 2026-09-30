import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '../services/event.service';
import toast from 'react-hot-toast';

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => eventService.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to create event');
    }
  });
};
