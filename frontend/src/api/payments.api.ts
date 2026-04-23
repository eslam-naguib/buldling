import api from './client';
import type { ApiResponse, Payment } from '../types';

export const paymentsApi = {
  getAll: (month?: number, year?: number) =>
    api.get<ApiResponse<Payment[]>>('/payments', { params: { month, year } }),

  create: (data: { flatId: number; month: number; year: number; amount?: number; notes?: string }) =>
    api.post<ApiResponse<Payment>>('/payments', data),

  bulkCreate: (data: { flatIds: number[]; month: number; year: number }) =>
    api.post<ApiResponse<Payment[]>>('/payments/bulk', data),

  delete: (id: number) =>
    api.delete<ApiResponse<null>>(`/payments/${id}`),

  getUnpaid: (month?: number, year?: number) =>
    api.get<ApiResponse<any[]>>('/payments/unpaid', { params: { month, year } }),
};
