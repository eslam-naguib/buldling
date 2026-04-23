import api from './client';
import type { ApiResponse, DashboardSummary, MonthlyData, FlatReport, YearlyReport, Transaction } from '../types';

export const dashboardApi = {
  getSummary: (month?: number, year?: number) =>
    api.get<ApiResponse<DashboardSummary>>('/dashboard/summary', { params: { month, year } }),

  getMonthlyReport: (year?: number) =>
    api.get<ApiResponse<MonthlyData[]>>('/dashboard/monthly', { params: { year } }),

  getYearlyReport: (year?: number) =>
    api.get<ApiResponse<YearlyReport>>('/dashboard/yearly', { params: { year } }),

  getFlatReport: (flatId: number, year?: number) =>
    api.get<ApiResponse<FlatReport>>(`/dashboard/flat/${flatId}`, { params: { year } }),

  getRecentTransactions: () =>
    api.get<ApiResponse<Transaction[]>>('/dashboard/recent-transactions'),
};
