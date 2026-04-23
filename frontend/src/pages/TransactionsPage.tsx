import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { transactionsApi } from '../api/transactions.api';
import { useUiStore } from '../stores/uiStore';
import { formatCurrency, formatDate } from '../lib/utils';
import { CATEGORIES } from '../lib/constants';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Card from '../components/ui/Card';
import { TableSkeleton } from '../components/ui/Skeleton';
import { Trash2, Plus } from 'lucide-react';

const schema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().min(1, 'المبلغ يجب أن يكون أكبر من 0'),
  description: z.string().min(1, 'الوصف مطلوب'),
});

type FormData = z.infer<typeof schema>;

export default function TransactionsPage() {
  const { selectedMonth, selectedYear } = useUiStore();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState('');

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions-list', selectedMonth, selectedYear],
    queryFn: async () => {
      const res = await transactionsApi.getAll({ month: selectedMonth, year: selectedYear });
      return res.data.data;
    },
  });

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'expense', amount: 0, description: '' },
  });

  const txType = watch('type');

  const createMutation = useMutation({
    mutationFn: (data: FormData) => transactionsApi.create({ 
      ...data, 
      category: 'other', 
      month: selectedMonth, 
      year: selectedYear,
      date: new Date().toISOString()
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions-list'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setIsModalOpen(false);
      reset();
      setSubmitError('');
    },
    onError: (err: any) => {
      setSubmitError(err.response?.data?.message || 'حدث خطأ أثناء حفظ المعاملة');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => transactionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions-list'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setDeleteId(null);
    },
  });

  const txList = Array.isArray(transactions) ? transactions : [];
  const incomes = txList.filter(t => t.type === 'income');
  const expenses = txList.filter(t => t.type === 'expense');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold font-display text-primary">إدارة المصروفات</h2>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 w-full sm:w-auto">
          <Plus size={18} />
          إضافة معاملة
        </Button>
      </div>

      {isLoading ? <TableSkeleton rows={10} /> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Expenses Column */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-lg font-bold font-display text-text-main">المصروفات</h3>
              <Badge variant="danger" className="text-sm">
                {formatCurrency(expenses.reduce((a, b) => a + b.amount, 0))}
              </Badge>
            </div>
            
            <div className="space-y-3">
              {expenses.map((tx) => (
                <Card key={tx.id} className="p-4 hover:border-primary/30 transition-colors group">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-text-main">{tx.description}</h4>
                      <p className="text-xs text-text-muted mt-1">{formatDate(tx.createdAt)}</p>
                      <Badge variant="outline" className="mt-2 text-[10px]">
                        {CATEGORIES[tx.category] || tx.category}
                      </Badge>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-bold text-danger">-{formatCurrency(tx.amount)}</span>
                      <button 
                        onClick={() => setDeleteId(tx.id)}
                        className="text-text-muted hover:text-danger hover:bg-danger-container p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                        title="حذف"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
              {expenses.length === 0 && (
                <div className="text-center py-8 text-text-muted bg-surface-container-low rounded-lg border border-border border-dashed">
                  لا يوجد مصروفات
                </div>
              )}
            </div>
          </div>

          {/* Incomes Column */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-lg font-bold font-display text-text-main">الواردات</h3>
              <Badge variant="success" className="text-sm">
                {formatCurrency(incomes.reduce((a, b) => a + b.amount, 0))}
              </Badge>
            </div>
            
            <div className="space-y-3">
              {incomes.map((tx) => (
                <Card key={tx.id} className="p-4 hover:border-primary/30 transition-colors group">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-text-main">{tx.description}</h4>
                      <p className="text-xs text-text-muted mt-1">{formatDate(tx.createdAt)}</p>
                      <Badge variant="outline" className="mt-2 text-[10px]">
                        {CATEGORIES[tx.category] || tx.category}
                      </Badge>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-bold text-success">+{formatCurrency(tx.amount)}</span>
                      {tx.category !== 'maintenance_fee' ? (
                        <button 
                          onClick={() => setDeleteId(tx.id)}
                          className="text-text-muted hover:text-danger hover:bg-danger-container p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                          title="حذف"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : (
                        <button 
                          className="text-text-muted/30 p-1.5 cursor-not-allowed"
                          title="لا يمكن حذف رسوم الشقق من هنا، قم بإلغاء السداد من صفحة الشقق"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
              {incomes.length === 0 && (
                <div className="text-center py-8 text-text-muted bg-surface-container-low rounded-lg border border-border border-dashed">
                  لا يوجد واردات
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="إضافة معاملة مالية">
        {submitError && (
          <div className="bg-danger/10 text-danger border border-danger/20 p-4 rounded-xl mb-6 font-medium text-sm">
            {submitError}
          </div>
        )}
        <form onSubmit={handleSubmit((d: FormData) => createMutation.mutate(d))} className="space-y-5">
          <Select
            label="نوع المعاملة"
            options={[
              { value: 'expense', label: 'مصروف' },
              { value: 'income', label: 'دخل آخر' },
            ]}
            error={errors.type?.message}
            {...register('type')}
          />
          <Input
            label="المبلغ"
            type="number"
            error={errors.amount?.message}
            {...register('amount', { valueAsNumber: true })}
          />
          <Input
            label="الوصف (البيان)"
            error={errors.description?.message}
            {...register('description')}
          />
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              إلغاء
            </Button>
            <Button type="submit" loading={createMutation.isPending} variant={txType === 'income' ? 'success' : 'primary'}>
              حفظ المعاملة
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="حذف المعاملة"
        message="هل أنت متأكد من حذف هذه المعاملة؟ سيؤثر هذا على إجمالي الخزينة."
        confirmText="نعم، احذف المعاملة"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
