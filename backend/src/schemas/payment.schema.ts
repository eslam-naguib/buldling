import { z } from 'zod';

export const createPaymentSchema = z.object({
  flatId: z.number().int().positive('رقم الشقة مطلوب'),
  month: z.number().int().min(1).max(12, 'الشهر غير صالح'),
  year: z.number().int().min(2020).max(2100, 'السنة غير صالحة'),
  amount: z.number().int().positive('المبلغ مطلوب'),
  notes: z.string().optional(),
});

export const bulkPaymentSchema = z.object({
  flatIds: z.array(z.number().int().positive()).min(1, 'يرجى اختيار شقة واحدة على الأقل'),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2020).max(2100),
});
