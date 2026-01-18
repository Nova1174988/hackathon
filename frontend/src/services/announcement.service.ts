import api from './api';

export const announcementService = {
  getAllAnnouncements: async (params?: {
    category?: string;
    language?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/announcements', { params });
    return response.data;
  },

  getAnnouncementById: async (id: string) => {
    const response = await api.get(`/announcements/${id}`);
    return response.data;
  },

  createAnnouncement: async (data: any) => {
    const response = await api.post('/announcements', data);
    return response.data;
  },

  updateAnnouncement: async (id: string, data: any) => {
    const response = await api.patch(`/announcements/${id}`, data);
    return response.data;
  },

  deleteAnnouncement: async (id: string) => {
    const response = await api.delete(`/announcements/${id}`);
    return response.data;
  },

  incrementShares: async (id: string) => {
    const response = await api.post(`/announcements/${id}/share`);
    return response.data;
  },
};
