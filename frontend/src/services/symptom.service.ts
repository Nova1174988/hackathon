import api from './api';

export const symptomService = {
  checkSymptoms: async (data: {
    symptoms: string;
    duration: string;
    severity: number;
    medicalHistory?: string;
    medications?: string;
    language?: string;
  }) => {
    const response = await api.post('/symptoms/check', data);
    return response.data;
  },

  getSymptomHistory: async () => {
    const response = await api.get('/symptoms/history');
    return response.data;
  },
};
