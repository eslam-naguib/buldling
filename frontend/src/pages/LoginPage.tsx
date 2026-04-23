import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, LockKeyhole } from 'lucide-react';
import { authApi } from '../api/auth.api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const loginSchema = z.object({
  username: z.string().min(3, 'اسم المستخدم مطلوب'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      await authApi.login({ username: data.username, password: data.password });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'بيانات الدخول غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-primary p-4 rounded-xl shadow-subtle">
            <Building2 className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold font-display tracking-tight text-text-main">
          تسجيل الدخول للنظام
        </h2>
        <p className="mt-2 text-center text-sm text-text-muted">
          الرجاء إدخال بيانات الاعتماد الخاصة بك للوصول إلى لوحة التحكم
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-danger-container border-l-4 border-danger p-4 rounded-md">
                <p className="text-sm font-medium text-danger">{error}</p>
              </div>
            )}

            <Input
              label="اسم المستخدم"
              type="text"
              error={errors.username?.message}
              {...register('username')}
            />

            <Input
              label="كلمة المرور"
              type="password"
              error={errors.password?.message}
              {...register('password')}
            />

            <Button
              type="submit"
              className="w-full flex justify-center items-center gap-2"
              size="lg"
              loading={isSubmitting}
            >
              <LockKeyhole size={18} />
              تسجيل الدخول
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
