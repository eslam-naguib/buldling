import api from './client';
import type { ApiResponse } from '../types';

export const authApi = {
  login: (data: { username: string; password: string }) =>
    api.post<ApiResponse<{ id: number; username: string }>>('/auth/login', data),

  logout: () => api.post('/auth/logout'),

  getMe: () => api.get<ApiResponse<{ id: number; username: string }>>('/auth/me'),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put<ApiResponse<null>>('/auth/change-password', data),
};
