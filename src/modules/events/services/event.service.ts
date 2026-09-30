import { apiClient } from '@/src/core/axios';

export const eventService = {
  createEvent: async (data: any) => {
    const response = await apiClient.post('/events', data);
    return response.data;
  },
  getEvents: async (params?: any) => {
    const response = await apiClient.get('/events', { params });
    return response.data;
  },
  getEventById: async (id: string) => {
    const response = await apiClient.get(`/events/${id}`);
    return response.data;
  },
  updateEvent: async (id: string, data: any) => {
    const response = await apiClient.put(`/events/${id}`, data);
    return response.data;
  },
  deleteEvent: async (id: string) => {
    const response = await apiClient.delete(`/events/${id}`);
    return response.data;
  },
  registerForEvent: async (id: string, data: any) => {
    const response = await apiClient.post(`/events/${id}/register`, data);
    return response.data;
  },
  createTeam: async (eventId: string, name: string) => {
    const response = await apiClient.post(`/events/${eventId}/teams`, { name });
    return response.data;
  },
  joinTeam: async (eventId: string, joinCode: string) => {
    const response = await apiClient.post(`/events/${eventId}/teams/join`, { joinCode });
    return response.data;
  },
  getMyTeam: async (eventId: string) => {
    const response = await apiClient.get(`/events/${eventId}/teams/me`);
    return response.data;
  },
  submitTeamApplication: async (eventId: string) => {
    const response = await apiClient.post(`/events/${eventId}/teams/submit`, {});
    return response.data;
  }
};
