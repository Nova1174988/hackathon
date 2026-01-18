import api from './api';

export const consultationService = {
  createConsultation: async (data: {
    doctorId: string;
    scheduledTime: string;
    patientNotes?: string;
  }) => {
    const response = await api.post('/consultations', data);
    return response.data;
  },

  getConsultations: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/consultations', { params });
    return response.data;
  },

  getConsultationById: async (id: string) => {
    const response = await api.get(`/consultations/${id}`);
    return response.data;
  },

  updateConsultationStatus: async (id: string, data: {
    status?: string;
    doctorNotes?: string;
    prescription?: string;
  }) => {
    const response = await api.patch(`/consultations/${id}/status`, data);
    return response.data;
  },

  rateConsultation: async (id: string, data: {
    rating: number;
    review?: string;
  }) => {
    const response = await api.post(`/consultations/${id}/rate`, data);
    return response.data;
  },
};
