import { useQuery } from '@tanstack/react-query';
import { flatsApi } from '../api/flats.api';
import { transactionsApi } from '../api/transactions.api';
import { useUiStore } from '../stores/uiStore';
import { formatCurrency, formatDate } from '../lib/utils';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import { TrendingUp, TrendingDown, Wallet, Building, AlertCircle } from 'lucide-react';
import { CATEGORIES } from '../lib/constants';
import { cn } from '../lib/utils';

export default function DashboardPage() {
  const { selectedMonth, selectedYear } = useUiStore();

  const { data: dashboardData, isLoading: flatsLoading } = useQuery({
    queryKey: ['dashboard', selectedMonth, selectedYear],
    queryFn: async () => {
      const flats = (await flatsApi.getAll(selectedMonth, selectedYear)).data.data;
      const expected = flats.reduce((acc, flat) => acc + flat.monthlyFee, 0);
      const collected = flats.filter(f => f.isPaid).reduce((acc, f) => acc + f.monthlyFee, 0);
      const paidCount = flats.filter(f => f.isPaid).length;
      
      return { flats, expected, collected, paidCount, totalFlats: flats.length };
    },
  });

  const { data: txData, isLoading: txLoading } = useQuery({
    queryKey: ['transactions', selectedMonth, selectedYear],
    queryFn: async () => {
      const txs = (await transactionsApi.getAll({ month: selectedMonth, year: selectedYear })).data.data;
      const expenses = txs.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
      const extraIncome = txs.filter(t => t.type === 'income' && t.category !== 'maintenance_fee').reduce((acc, t) => acc + t.amount, 0);
      return { transactions: txs, expenses, extraIncome };
    },
  });

  if (flatsLoading || txLoading) {
    return <DashboardSkeleton />;
  }

  const expected = dashboardData?.expected || 0;
  const collected = dashboardData?.collected || 0;
  const expenses = txData?.expenses || 0;
  const extraIncome = txData?.extraIncome || 0;
  const totalRevenue = collected + extraIncome;
  const netBalance = totalRevenue - expenses;
  const collectionRate = expected > 0 ? (collected / expected) * 100 : 0;

  const recentTransactions = txData?.transactions.slice(0, 5) || [];
  const unpaidFlats = dashboardData?.flats.filter(f => !f.isPaid) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold font-display text-primary">نظرة عامة على الأداء المالي</h2>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-fixed rounded-lg text-primary">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">إجمالي التحصيل</p>
              <h3 className="text-3xl font-bold font-display mt-1 text-text-main">
                {formatCurrency(collected)}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-danger-container rounded-lg text-danger">
              <TrendingDown size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">المصروفات</p>
              <h3 className="text-3xl font-bold font-display mt-1 text-text-main">
                {formatCurrency(expenses)}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">صافي الخزينة</p>
              <h3 className="text-3xl font-bold font-display mt-1 text-text-main">
                {formatCurrency(netBalance)}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary-container rounded-lg text-secondary">
              <Building size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">نسبة التحصيل</p>
              <h3 className="text-3xl font-bold font-display mt-1 text-text-main">
                %{collectionRate.toFixed(1)}
              </h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Transactions Table */}
        <Card className="xl:col-span-2 overflow-hidden p-0 flex flex-col h-[350px] xl:h-auto">
          <div className="p-4 border-b border-border bg-surface-container-low">
            <h3 className="text-lg font-bold font-display">أحدث المعاملات</h3>
          </div>
          <div className="overflow-x-auto overflow-y-auto flex-1">
            <table className="w-full text-sm text-right">
              <thead className="bg-surface-container text-text-muted sticky top-0">
                <tr>
                  <th className="px-6 py-3 font-semibold">التاريخ</th>
                  <th className="px-6 py-3 font-semibold">البيان</th>
                  <th className="px-6 py-3 font-semibold">التصنيف</th>
                  <th className="px-6 py-3 font-semibold">النوع</th>
                  <th className="px-6 py-3 font-semibold">المبلغ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 bg-surface">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-text-muted">{formatDate(tx.createdAt)}</td>
                    <td className="px-6 py-4 font-medium">{tx.description}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="text-[10px]">
                        {CATEGORIES[tx.category] || tx.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={tx.type === 'income' ? 'success' : 'danger'}>
                        {tx.type === 'income' ? (tx.category === 'maintenance_fee' ? 'سداد شقة' : 'دخل آخر') : 'مصروف'}
                      </Badge>
                    </td>
                    <td className={cn(
                      "px-6 py-4 whitespace-nowrap font-bold",
                      tx.type === 'income' ? "text-success" : "text-danger"
                    )}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </td>
                  </tr>
                ))}
                {recentTransactions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-text-muted">
                      لا توجد معاملات مسجلة في هذا الشهر
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Alerts / Unpaid Flats */}
        <Card className="p-0 flex flex-col h-[350px] xl:h-auto">
          <div className="p-4 border-b border-border bg-surface-container-low flex items-center justify-between">
            <h3 className="text-base font-bold font-display flex items-center gap-2">
              <AlertCircle size={18} className="text-warning" />
              تنبيهات (شقق متأخرة)
            </h3>
            <Badge variant="warning">{unpaidFlats.length} شقة</Badge>
          </div>
          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {unpaidFlats.length > 0 ? unpaidFlats.map(flat => (
              <div key={flat.id} className="flex justify-between items-center p-3 bg-surface border border-border/50 rounded-md">
                <div>
                  <p className="font-semibold text-sm">شقة {flat.number}</p>
                  <p className="text-xs text-text-muted">{flat.ownerName}</p>
                </div>
                <span className="text-sm font-bold text-danger">{formatCurrency(flat.monthlyFee)}</span>
              </div>
            )) : (
              <div className="h-full flex items-center justify-center text-text-muted text-sm">
                لا يوجد شقق متأخرة
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
