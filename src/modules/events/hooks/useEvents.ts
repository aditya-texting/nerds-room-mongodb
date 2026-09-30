import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { eventService } from '../services/event.service';

export const useEvents = (params?: any) => {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => eventService.getEvents(params),
    placeholderData: keepPreviousData,
  });
};

export const useEvent = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => eventService.getEventById(id),
    enabled: enabled && !!id,
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => eventService.updateEvent(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', id] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error) => {
      console.error('Delete event error:', error);
    },
  });
};

// Team Hooks
export const useMyTeam = (eventId: string, enabled: boolean = true, refetchInterval: number | false = false) => {
  return useQuery({
    queryKey: ['myTeam', eventId],
    queryFn: () => eventService.getMyTeam(eventId),
    enabled: enabled && !!eventId,
    refetchInterval,
  });
};

export const useCreateTeam = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => eventService.createTeam(eventId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTeam', eventId] });
    },
  });
};

export const useJoinTeam = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (joinCode: string) => eventService.joinTeam(eventId, joinCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTeam', eventId] });
    },
  });
};

export const useSubmitTeamApplication = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => eventService.submitTeamApplication(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTeam', eventId] });
    },
  });
};

export const useRegisterEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => eventService.registerForEvent(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', id] });
    },
  });
};
