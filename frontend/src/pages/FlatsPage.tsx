import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { flatsApi } from '../api/flats.api';
import { paymentsApi } from '../api/payments.api';
import { useUiStore } from '../stores/uiStore';
import { formatCurrency, formatDate } from '../lib/utils';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Card from '../components/ui/Card';
import { TableSkeleton } from '../components/ui/Skeleton';
import { CheckCircle2, History, XCircle, Search, Pencil, Phone, User, Building } from 'lucide-react';
import { cn } from '../lib/utils';

const paySchema = z.object({
  amount: z.number().min(1, 'المبلغ يجب أن يكون أكبر من 0'),
  notes: z.string().optional(),
});

export default function FlatsPage() {
  const { selectedMonth, selectedYear } = useUiStore();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [payModalFlatId, setPayModalFlatId] = useState<number | null>(null);
  const [historyModalFlatId, setHistoryModalFlatId] = useState<number | null>(null);
  const [unpayConfirmId, setUnpayConfirmId] = useState<number | null>(null);
  const [editFlat, setEditFlat] = useState<{ id: number; ownerName: string; phone: string } | null>(null);
  const [editOwnerName, setEditOwnerName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  const { data: flats, isLoading } = useQuery({
    queryKey: ['flats', selectedMonth, selectedYear],
    queryFn: async () => (await flatsApi.getAll(selectedMonth, selectedYear)).data.data,
  });

  const { data: historyData } = useQuery({
    queryKey: ['flatHistory', historyModalFlatId],
    queryFn: async () => historyModalFlatId ? (await flatsApi.getHistory(historyModalFlatId)).data.data : null,
    enabled: !!historyModalFlatId,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof paySchema>>({
    resolver: zodResolver(paySchema),
  });

  const payMutation = useMutation({
    mutationFn: (data: { id: number; amount: number; notes?: string }) => 
      paymentsApi.create({ flatId: data.id, month: selectedMonth, year: selectedYear, amount: data.amount, notes: data.notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setPayModalFlatId(null);
      reset();
    },
  });

  const unpayMutation = useMutation({
    mutationFn: (paymentId: number) => paymentsApi.delete(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setUnpayConfirmId(null);
    },
  });

  const updateOwnerMutation = useMutation({
    mutationFn: (data: { id: number; ownerName: string; phone: string }) =>
      flatsApi.update(data.id, { ownerName: data.ownerName, phone: data.phone }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setEditFlat(null);
      setEditOwnerName('');
      setEditPhone('');
    },
  });

  const bulkPayMutation = useMutation({
    mutationFn: (ids: number[]) => paymentsApi.bulkCreate({ flatIds: ids, month: selectedMonth, year: selectedYear }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  if (isLoading) return <TableSkeleton rows={8} />;

  const filteredFlats = flats?.filter(flat => {
    const matchesSearch = flat.number.toString().includes(searchTerm) || flat.ownerName.includes(searchTerm);
    const matchesFilter = filter === 'all' ? true : filter === 'paid' ? flat.isPaid : !flat.isPaid;
    return matchesSearch && matchesFilter;
  });

  const handleBulkPay = () => {
    const unpaidIds = filteredFlats?.filter(f => !f.isPaid).map(f => f.id) || [];
    if (unpaidIds.length > 0 && confirm(`هل أنت متأكد من تسديد ${unpaidIds.length} شقة؟`)) {
      bulkPayMutation.mutate(unpaidIds);
    }
  };

  const selectedFlat = flats?.find(f => f.id === payModalFlatId);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 pb-6 border-b border-border/50">
        <div>
          <h2 className="text-3xl font-bold font-display text-text-main flex items-center gap-2">
            <Building className="text-primary" size={28} />
            إدارة الشقق
          </h2>
          <p className="text-sm text-text-muted mt-1">متابعة حالة السداد وتحديث بيانات الملاك</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <div className="flex items-center gap-2 bg-surface px-4 py-2 rounded-full border border-border shadow-subtle">
            <div className="flex items-center gap-2 pr-2 border-l border-border/50">
              <span className="w-2 h-2 rounded-full bg-success"></span>
              <span className="text-sm font-bold text-text-main">{flats?.filter(f => f.isPaid).length || 0} <span className="font-normal text-text-muted">مسدد</span></span>
            </div>
            <div className="flex items-center gap-2 pl-2">
              <span className="w-2 h-2 rounded-full bg-warning"></span>
              <span className="text-sm font-bold text-text-main">{flats?.filter(f => !f.isPaid).length || 0} <span className="font-normal text-text-muted">متأخر</span></span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleBulkPay} 
            disabled={bulkPayMutation.isPending || !flats?.some(f => !f.isPaid)}
            className="flex-1 xl:flex-none border-primary/20 text-primary hover:bg-primary-container"
          >
            تسديد المتبقي (مجمع)
          </Button>
        </div>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
          <input 
            type="text"
            placeholder="ابحث برقم الشقة أو اسم المالك..."
            className="w-full h-12 pl-4 pr-12 rounded-xl border border-border bg-surface text-sm focus:border-primary focus:ring-1 focus:ring-primary shadow-subtle outline-none transition-all placeholder:text-text-muted"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select 
          options={[
            { value: 'all', label: 'جميع الحالات' },
            { value: 'paid', label: 'مسدد فقط' },
            { value: 'unpaid', label: 'متأخر فقط' },
          ]}
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="w-full sm:w-48 h-12 rounded-xl bg-surface shadow-subtle border-border"
        />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filteredFlats?.map((flat) => (
          <Card key={flat.id} className="p-0 relative group hover:shadow-elevation-1 hover:-translate-y-1 transition-all duration-300 overflow-hidden border-border/60">
            {/* Top Indicator */}
            <div className={cn("absolute top-0 left-0 right-0 h-1", flat.isPaid ? "bg-success" : "bg-warning")} />
            
            <div className="p-5">
              {/* Header: Number & Amount */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold font-display shadow-inner",
                    flat.isPaid ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                  )}>
                    {flat.number}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-text-main leading-none mb-1.5">شقة {flat.number}</h3>
                    <Badge variant={flat.isPaid ? 'success' : 'warning'} className="text-[10px] py-0 px-2 font-medium">
                      {flat.isPaid ? 'تم السداد' : 'متأخر'}
                    </Badge>
                  </div>
                </div>
                <div className="text-left bg-surface-container-low px-3 py-1.5 rounded-lg border border-border/50">
                  <span className="block text-sm font-bold text-text-main">{formatCurrency(flat.monthlyFee)}</span>
                  <span className="text-[10px] text-text-muted">شهرياً</span>
                </div>
              </div>

              {/* Owner Details */}
              <div className="space-y-3 bg-surface-container-low/50 p-3 rounded-xl border border-border/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <User size={14} className="text-text-muted shrink-0" />
                    <span className="text-sm font-medium text-text-main truncate">
                      {flat.ownerName || <span className="italic text-text-muted/70">غير مسجل</span>}
                    </span>
                  </div>
                  <button
                    onClick={() => { 
                      setEditFlat({ id: flat.id, ownerName: flat.ownerName || '', phone: flat.phone || '' }); 
                      setEditOwnerName(flat.ownerName || ''); 
                      setEditPhone(flat.phone || '');
                    }}
                    className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-md transition-colors shrink-0"
                    title="تعديل بيانات الشقة"
                  >
                    <Pencil size={14} />
                  </button>
                </div>
                {flat.phone && (
                  <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                    <Phone size={13} className="text-text-muted shrink-0" />
                    <span className="text-xs font-medium text-text-muted" dir="ltr">{flat.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center gap-2 p-4 bg-surface-container-low border-t border-border/50">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setHistoryModalFlatId(flat.id)} 
                className="w-10 px-0 shrink-0 bg-surface text-text-muted border-border hover:text-primary hover:border-primary/50"
                title="سجل السداد"
              >
                <History size={16} />
              </Button>
              
              {flat.isPaid ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setUnpayConfirmId(flat.payment?.id || null)} 
                  className="flex-1 text-danger border-danger/20 hover:bg-danger/10 hover:border-danger/30"
                >
                  <XCircle size={16} className="mr-1.5" />
                  إلغاء السداد
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={() => {
                    reset({ amount: flat.monthlyFee });
                    setPayModalFlatId(flat.id);
                  }} 
                  className="flex-1 shadow-sm"
                >
                  <CheckCircle2 size={16} className="mr-1.5" />
                  تسجيل سداد
                </Button>
              )}
            </div>
          </Card>
        ))}
        
        {filteredFlats?.length === 0 && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-surface border border-border border-dashed rounded-2xl">
            <Building size={48} className="text-border mb-4" />
            <h3 className="text-lg font-bold text-text-main mb-1">لا توجد شقق</h3>
            <p className="text-sm text-text-muted">لم يتم العثور على شقق تطابق معايير البحث الحالية.</p>
          </div>
        )}
      </div>

      {/* Pay Modal */}
      <Modal isOpen={!!payModalFlatId} onClose={() => setPayModalFlatId(null)} title={`تسجيل سداد - شقة ${selectedFlat?.number}`}>
        <form onSubmit={handleSubmit((d) => payModalFlatId && payMutation.mutate({ id: payModalFlatId, ...d }))} className="space-y-5">
          <Input
            label="المبلغ المدفوع"
            type="number"
            error={errors.amount?.message}
            {...register('amount', { valueAsNumber: true })}
          />
          <Input
            label="ملاحظات (اختياري)"
            {...register('notes')}
          />
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setPayModalFlatId(null)}>إلغاء</Button>
            <Button type="submit" loading={payMutation.isPending} variant="success">تأكيد السداد</Button>
          </div>
        </form>
      </Modal>

      {/* History Modal */}
      <Modal isOpen={!!historyModalFlatId} onClose={() => setHistoryModalFlatId(null)} title={`تاريخ سداد شقة ${flats?.find(f => f.id === historyModalFlatId)?.number}`}>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {historyData && historyData.length > 0 ? (
            historyData.map((record: any) => (
              <div key={record.id} className="p-4 bg-surface-container-low rounded-lg border border-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-text-main">{formatDate(record.paidAt)}</span>
                  <Badge variant="success">مسدد</Badge>
                </div>
                <div className="text-sm text-text-muted flex justify-between">
                  <span>المبلغ: <span className="font-semibold text-text-main">{formatCurrency(record.amount)}</span></span>
                  <span>عن شهر: {record.month}/{record.year}</span>
                </div>
                {record.notes && <p className="text-sm mt-2 text-text-muted border-t border-border pt-2">ملاحظة: {record.notes}</p>}
              </div>
            ))
          ) : (
            <p className="text-center text-text-muted py-4">لا توجد سجلات سابقة</p>
          )}
        </div>
      </Modal>

      {/* Edit Flat Info Modal */}
      <Modal isOpen={!!editFlat} onClose={() => setEditFlat(null)} title="تعديل بيانات الشقة">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (editFlat) {
              updateOwnerMutation.mutate({ id: editFlat.id, ownerName: editOwnerName.trim(), phone: editPhone.trim() });
            }
          }}
          className="space-y-5"
        >
          <Input
            label="اسم المالك (اتركه فارغاً للحذف)"
            value={editOwnerName}
            onChange={(e) => setEditOwnerName(e.target.value)}
          />
          <Input
            label="رقم الهاتف (اختياري)"
            dir="ltr"
            className="text-right"
            value={editPhone}
            onChange={(e) => setEditPhone(e.target.value)}
          />
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setEditFlat(null)}>إلغاء</Button>
            <Button type="submit" loading={updateOwnerMutation.isPending}>حفظ التغييرات</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!unpayConfirmId}
        onClose={() => setUnpayConfirmId(null)}
        onConfirm={() => unpayConfirmId && unpayMutation.mutate(unpayConfirmId)}
        title="إلغاء السداد"
        message="هل أنت متأكد من إلغاء سداد هذه الشقة لهذا الشهر؟ سيتم خصم المبلغ من الخزينة."
        loading={unpayMutation.isPending}
        confirmText="نعم، إلغاء السداد"
      />
    </div>
  );
}
