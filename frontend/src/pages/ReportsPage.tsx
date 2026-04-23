import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { flatsApi } from '../api/flats.api';
import { transactionsApi } from '../api/transactions.api';
import { useUiStore } from '../stores/uiStore';
import { formatCurrency } from '../lib/utils';
import { CATEGORIES } from '../lib/constants';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Download, FileText, Printer } from 'lucide-react';

export default function ReportsPage() {
  const { selectedMonth, selectedYear } = useUiStore();
  const [isExporting, setIsExporting] = useState(false);

  const { data: reportData, isLoading } = useQuery({
    queryKey: ['report', selectedMonth, selectedYear],
    queryFn: async () => {
      const [flatsRes, txRes] = await Promise.all([
        flatsApi.getAll(selectedMonth, selectedYear),
        transactionsApi.getAll({ month: selectedMonth, year: selectedYear })
      ]);

      const flats = flatsRes.data.data;
      const txs = txRes.data.data;

      const expectedFromFlats = flats.reduce((acc, f) => acc + f.monthlyFee, 0);
      const collectedFromFlats = flats.filter(f => f.isPaid).reduce((acc, f) => acc + f.monthlyFee, 0);
      const unpaidFlats = flats.filter(f => !f.isPaid);

      const incomes = txs.filter(t => t.type === 'income' && t.category !== 'maintenance_fee');
      const expenses = txs.filter(t => t.type === 'expense');

      const totalExtraIncome = incomes.reduce((acc, t) => acc + t.amount, 0);
      const totalExpenses = expenses.reduce((acc, t) => acc + t.amount, 0);

      const expensesByCategory = expenses.reduce((acc: Record<string, number>, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
        return acc;
      }, {});

      return {
        flats,
        unpaidFlats,
        expectedFromFlats,
        collectedFromFlats,
        totalExtraIncome,
        totalExpenses,
        expensesByCategory,
        netBalance: (collectedFromFlats + totalExtraIncome) - totalExpenses
      };
    }
  });

  const handleExport = async (type: 'pdf' | 'excel') => {
    setIsExporting(true);
    // Simulate export delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert(`سيتم تحميل ملف ${type.toUpperCase()} قريباً (تحت التطوير)`);
    setIsExporting(false);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-text-muted">جاري تحميل التقرير...</div>;
  }

  const data = reportData!;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface p-6 rounded-lg border border-border shadow-subtle">
        <div>
          <h2 className="text-2xl font-bold font-display text-primary flex items-center gap-2">
            <FileText className="text-primary-fixed" />
            التقرير المالي الشامل
          </h2>
          <p className="text-text-muted mt-1">
            ملخص الأداء المالي لشهر {selectedMonth} سنة {selectedYear}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto mt-4 sm:mt-0">
          <Button variant="outline" onClick={() => window.print()} className="gap-2 flex-1 sm:flex-none">
            <Printer size={16} />
            طباعة
          </Button>
          <Button variant="primary" onClick={() => handleExport('pdf')} loading={isExporting} className="gap-2 flex-1 sm:flex-none">
            <Download size={16} />
            تصدير PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="report-content">
        {/* Incomes Summary */}
        <Card className="p-6">
          <h3 className="text-lg font-bold font-display text-text-main mb-4 pb-2 border-b border-border">الملخص المالي (الواردات)</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-muted">المطلوب من الشقق:</span>
              <span className="font-semibold text-text-main">{formatCurrency(data.expectedFromFlats)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-muted">المُحصّل من الشقق:</span>
              <span className="font-bold text-success">{formatCurrency(data.collectedFromFlats)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-muted">دخل آخر:</span>
              <span className="font-bold text-primary-fixed">{formatCurrency(data.totalExtraIncome)}</span>
            </div>
            <div className="pt-4 mt-4 border-t border-border flex justify-between items-center bg-surface-container-low p-3 rounded-md">
              <span className="font-bold text-text-main">إجمالي الدخل الفعلي:</span>
              <span className="text-lg font-bold text-success">{formatCurrency(data.collectedFromFlats + data.totalExtraIncome)}</span>
            </div>
          </div>
        </Card>

        {/* Expenses Summary */}
        <Card className="p-6">
          <h3 className="text-lg font-bold font-display text-text-main mb-4 pb-2 border-b border-border">الملخص المالي (المصروفات)</h3>
          <div className="space-y-4">
            {Object.entries(data.expensesByCategory).map(([cat, amount]) => (
              <div key={cat} className="flex justify-between items-center text-sm">
                <span className="text-text-muted">{CATEGORIES[cat] || cat}:</span>
                <span className="font-semibold text-danger">{formatCurrency(amount as number)}</span>
              </div>
            ))}
            {Object.keys(data.expensesByCategory).length === 0 && (
              <div className="text-sm text-text-muted text-center py-2">لا توجد مصروفات مسجلة</div>
            )}
            <div className="pt-4 mt-4 border-t border-border flex justify-between items-center bg-danger-container/50 p-3 rounded-md">
              <span className="font-bold text-text-main">إجمالي المصروفات:</span>
              <span className="text-lg font-bold text-danger">{formatCurrency(data.totalExpenses)}</span>
            </div>
          </div>
        </Card>

        {/* Final Result */}
        <Card className="md:col-span-2 p-6 bg-primary text-white border-none">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-lg font-bold font-display opacity-90">صافي خزينة العمارة لهذا الشهر</h3>
              <p className="text-sm opacity-75 mt-1">إجمالي الدخل ناقص إجمالي المصروفات</p>
            </div>
            <div className="text-4xl font-bold font-display tracking-tight">
              {formatCurrency(data.netBalance)}
            </div>
          </div>
        </Card>

        {/* Unpaid Flats Detail */}
        <Card className="md:col-span-2 p-0 overflow-hidden">
          <div className="p-4 bg-surface-container-low border-b border-border">
            <h3 className="text-lg font-bold font-display text-text-main">الشقق المتأخرة عن السداد ({data.unpaidFlats.length})</h3>
          </div>
          <div className="p-4">
            {data.unpaidFlats.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {data.unpaidFlats.map(flat => (
                  <div key={flat.id} className="p-3 bg-surface border border-border rounded-md text-center">
                    <div className="font-bold text-text-main">شقة {flat.number}</div>
                    <div className="text-xs text-text-muted mt-1 truncate">{flat.ownerName}</div>
                    <div className="text-sm font-semibold text-warning mt-2">{formatCurrency(flat.monthlyFee)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-text-muted">
                جميع الشقق مسددة لهذا الشهر. أداء ممتاز!
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
