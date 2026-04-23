import { z } from 'zod';

export const createFlatSchema = z.object({
  number: z.number().int().positive('رقم الشقة مطلوب'),
  ownerName: z.string().optional().or(z.literal('')),
  phone: z.string().optional(),
  email: z.string().email('بريد إلكتروني غير صالح').optional().or(z.literal('')),
  monthlyFee: z.number().int().positive('المبلغ الشهري مطلوب').default(200),
  notes: z.string().optional(),
});

export const updateFlatSchema = z.object({
  ownerName: z.string().optional().or(z.literal('')),
  phone: z.string().optional(),
  email: z.string().email('بريد إلكتروني غير صالح').optional().or(z.literal('')),
  monthlyFee: z.number().int().positive('المبلغ الشهري مطلوب').optional(),
  notes: z.string().optional(),
});
