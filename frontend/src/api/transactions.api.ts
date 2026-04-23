import api from './client';
import type { ApiResponse, Transaction } from '../types';

export const transactionsApi = {
  getAll: (params?: { month?: number; year?: number; type?: string; category?: string }) =>
    api.get<ApiResponse<Transaction[]>>('/transactions', { params }),

  create: (data: Partial<Transaction>) =>
    api.post<ApiResponse<Transaction>>('/transactions', data),

  update: (id: number, data: Partial<Transaction>) =>
    api.put<ApiResponse<Transaction>>(`/transactions/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<null>>(`/transactions/${id}`),
};
