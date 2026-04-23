import { z } from 'zod';

export const createTransactionSchema = z.object({
  type: z.enum(['income', 'expense'], { message: 'النوع يجب أن يكون دخول أو خروج' }),
  category: z.enum(['maintenance_fee', 'elevator', 'cleaning', 'electricity', 'water', 'other'], {
    message: 'التصنيف غير صالح',
  }),
  amount: z.number().int().positive('المبلغ مطلوب'),
  description: z.string().min(1, 'البيان مطلوب'),
  flatId: z.number().int().positive().optional().nullable(),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2020).max(2100),
  date: z.string().or(z.date()),
});

export const updateTransactionSchema = createTransactionSchema.partial();
