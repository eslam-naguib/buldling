import { z } from 'zod';
export declare const createPaymentSchema: z.ZodObject<{
    flatId: z.ZodNumber;
    month: z.ZodNumber;
    year: z.ZodNumber;
    amount: z.ZodNumber;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    year: number;
    month: number;
    flatId: number;
    amount: number;
    notes?: string | undefined;
}, {
    year: number;
    month: number;
    flatId: number;
    amount: number;
    notes?: string | undefined;
}>;
export declare const bulkPaymentSchema: z.ZodObject<{
    flatIds: z.ZodArray<z.ZodNumber, "many">;
    month: z.ZodNumber;
    year: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    year: number;
    month: number;
    flatIds: number[];
}, {
    year: number;
    month: number;
    flatIds: number[];
}>;
//# sourceMappingURL=payment.schema.d.ts.map