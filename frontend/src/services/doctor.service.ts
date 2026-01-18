import api from './api';

export const doctorService = {
  getAllDoctors: async (params?: {
    specialization?: string;
    availability?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/doctors', { params });
    return response.data;
  },

  getDoctorById: async (id: string) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },

  updateDoctorProfile: async (data: any) => {
    const response = await api.patch('/doctors/profile', data);
    return response.data;
  },

  updateAvailability: async (status: string) => {
    const response = await api.patch('/doctors/availability', { status });
    return response.data;
  },
};
