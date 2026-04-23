import api from './client';
import type { ApiResponse, Flat } from '../types';

export const flatsApi = {
  getAll: (month?: number, year?: number) =>
    api.get<ApiResponse<Flat[]>>('/flats', { params: { month, year } }),

  getById: (id: number) =>
    api.get<ApiResponse<Flat>>(`/flats/${id}`),

  create: (data: Partial<Flat>) =>
    api.post<ApiResponse<Flat>>('/flats', data),

  update: (id: number, data: Partial<Flat>) =>
    api.put<ApiResponse<Flat>>(`/flats/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<null>>(`/flats/${id}`),

  getHistory: (id: number) =>
    api.get<ApiResponse<any[]>>(`/flats/${id}/history`),

  bulkUpdateFee: (amount: number) =>
    api.post<ApiResponse<null>>('/flats/bulk-update-fee', { amount }),
};
