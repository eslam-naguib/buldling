import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { flatsApi } from '../api/flats.api';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Settings, Lock, Building, CheckCircle2, AlertCircle } from 'lucide-react';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'كلمة المرور الحالية مطلوبة'),
  newPassword: z.string().min(6, 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل'),
  confirmPassword: z.string().min(1, 'تأكيد كلمة المرور مطلوب'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "كلمات المرور لا تتطابق",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

const feeSchema = z.object({
  amount: z.number().min(1, 'المبلغ يجب أن يكون أكبر من 0'),
});

type FeeFormData = z.infer<typeof feeSchema>;

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [feeSuccess, setFeeSuccess] = useState('');
  const [feeError, setFeeError] = useState('');

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPassword } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const { register: registerFee, handleSubmit: handleFeeSubmit, formState: { errors: feeErrors }, reset: resetFee } = useForm<FeeFormData>({
    resolver: zodResolver(feeSchema),
    defaultValues: { amount: 200 }
  });

  const passwordMutation = useMutation({
    mutationFn: (data: PasswordFormData) => authApi.changePassword({ 
      currentPassword: data.currentPassword, 
      newPassword: data.newPassword 
    }),
    onSuccess: () => {
      setSuccess('تم تغيير كلمة المرور بنجاح');
      setError('');
      resetPassword();
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'حدث خطأ أثناء تغيير كلمة المرور');
      setSuccess('');
    }
  });

  const feeMutation = useMutation({
    mutationFn: (data: FeeFormData) => flatsApi.bulkUpdateFee(data.amount),
    onSuccess: () => {
      setFeeSuccess('تم تحديث مبلغ الاشتراك الشهري لجميع الشقق بنجاح');
      setFeeError('');
      queryClient.invalidateQueries({ queryKey: ['flats'] });
      setTimeout(() => setFeeSuccess(''), 3000);
    },
    onError: (err: any) => {
      setFeeError(err.response?.data?.message || 'حدث خطأ أثناء تحديث مبلغ الاشتراك');
      setFeeSuccess('');
    }
  });

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3 pb-6 border-b border-border/50">
        <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
          <Settings size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-display text-text-main">إعدادات النظام</h2>
          <p className="text-sm text-text-muted mt-1">تخصيص خيارات النظام والحماية</p>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-5 border-b border-border/50 bg-surface-container-low flex items-center gap-2">
          <Building className="text-primary" size={20} />
          <h3 className="text-lg font-bold font-display">إعدادات الشقق</h3>
        </div>

        <div className="p-6">
          <p className="text-sm text-text-muted mb-6">
            قم بتحديث قيمة الاشتراك الشهري لجميع الشقق. سيتم تطبيق هذا المبلغ على المتأخرات القادمة ولن يؤثر على السجلات السابقة.
          </p>

          {feeSuccess && (
            <div className="bg-success/10 text-success border border-success/20 p-4 rounded-xl mb-6 font-medium flex items-center gap-3 text-sm">
              <CheckCircle2 size={18} /> {feeSuccess}
            </div>
          )}
          
          {feeError && (
            <div className="bg-danger/10 text-danger border border-danger/20 p-4 rounded-xl mb-6 font-medium flex items-center gap-3 text-sm">
              <AlertCircle size={18} /> {feeError}
            </div>
          )}

          <form onSubmit={handleFeeSubmit((d: FeeFormData) => feeMutation.mutate(d))} className="space-y-6">
            <Input
              label="الاشتراك الشهري الموحد (جنيه)"
              type="number"
              error={feeErrors.amount?.message}
              {...registerFee('amount', { valueAsNumber: true })}
            />
            
            <div className="pt-4 border-t border-border/50 flex justify-end">
              <Button type="submit" loading={feeMutation.isPending} className="px-8 shadow-sm hover:shadow-elevation-1">
                تحديث الاشتراك لجميع الشقق
              </Button>
            </div>
          </form>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="p-5 border-b border-border/50 bg-surface-container-low flex items-center gap-2">
          <Lock className="text-primary" size={20} />
          <h3 className="text-lg font-bold font-display">تغيير كلمة المرور</h3>
        </div>

        <div className="p-6">
          {success && (
            <div className="bg-success/10 text-success border border-success/20 p-4 rounded-xl mb-6 font-medium flex items-center gap-3 text-sm">
              <CheckCircle2 size={18} /> {success}
            </div>
          )}
          
          {error && (
            <div className="bg-danger/10 text-danger border border-danger/20 p-4 rounded-xl mb-6 font-medium flex items-center gap-3 text-sm">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit((d) => passwordMutation.mutate(d))} className="space-y-6">
            <Input
              label="كلمة المرور الحالية"
              type="password"
              error={passwordErrors.currentPassword?.message}
              {...registerPassword('currentPassword')}
            />
            <Input
              label="كلمة المرور الجديدة"
              type="password"
              error={passwordErrors.newPassword?.message}
              {...registerPassword('newPassword')}
            />
            <Input
              label="تأكيد كلمة المرور الجديدة"
              type="password"
              error={passwordErrors.confirmPassword?.message}
              {...registerPassword('confirmPassword')}
            />
            
            <div className="pt-4 border-t border-border/50 flex justify-end">
              <Button type="submit" loading={passwordMutation.isPending} className="px-8 shadow-sm hover:shadow-elevation-1">
                حفظ كلمة المرور
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
