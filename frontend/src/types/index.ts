export interface Flat {
  id: number;
  number: number;
  ownerName: string;
  phone: string | null;
  email: string | null;
  monthlyFee: number;
  notes: string | null;
  isActive: boolean;
  isPaid?: boolean;
  payment?: Payment | null;
  payments?: Payment[];
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: number;
  flatId: number;
  month: number;
  year: number;
  amount: number;
  paidAt: string | null;
  isPaid: boolean;
  notes: string | null;
  createdAt: string;
  flat?: { number: number; ownerName: string };
}

export interface Transaction {
  id: number;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  flatId: number | null;
  month: number;
  year: number;
  date: string;
  createdAt: string;
}

export interface DashboardSummary {
  totalExpected: number;
  totalCollected: number;
  totalExpenses: number;
  balance: number;
  paidCount: number;
  unpaidCount: number;
  totalFlats: number;
  isNegativeBalance: boolean;
  collectionRate: number;
}

export interface MonthlyData {
  month: number;
  collected: number;
  expenses: number;
  balance: number;
  paidCount: number;
}

export interface FlatReport {
  flat: Flat;
  year: number;
  monthlyStatus: { month: number; isPaid: boolean; amount: number; paidAt: string | null }[];
  totalPaid: number;
  paidMonths: number;
}

export interface YearlyReport {
  year: number;
  report: {
    flatId: number;
    flatNumber: number;
    ownerName: string;
    months: Record<number, boolean>;
    totalPaid: number;
    paidCount: number;
  }[];
  summary: { totalCollected: number; totalExpenses: number; balance: number };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
