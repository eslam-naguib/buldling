import { create } from 'zustand';

interface UiState {
  selectedMonth: number;
  selectedYear: number;
  sidebarOpen: boolean;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
  setMonthYear: (month: number, year: number) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

const now = new Date();

export const useUiStore = create<UiState>((set) => ({
  selectedMonth: now.getMonth() + 1,
  selectedYear: now.getFullYear(),
  sidebarOpen: false,
  setMonth: (month) => set({ selectedMonth: month }),
  setYear: (year) => set({ selectedYear: year }),
  setMonthYear: (month, year) => set({ selectedMonth: month, selectedYear: year }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
