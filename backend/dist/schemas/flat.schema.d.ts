import { z } from 'zod';
export declare const createFlatSchema: z.ZodObject<{
    number: z.ZodNumber;
    ownerName: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    phone: z.ZodOptional<z.ZodString>;
    email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    monthlyFee: z.ZodDefault<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    number: number;
    monthlyFee: number;
    ownerName?: string | undefined;
    phone?: string | undefined;
    email?: string | undefined;
    notes?: string | undefined;
}, {
    number: number;
    ownerName?: string | undefined;
    phone?: string | undefined;
    email?: string | undefined;
    monthlyFee?: number | undefined;
    notes?: string | undefined;
}>;
export declare const updateFlatSchema: z.ZodObject<{
    ownerName: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    phone: z.ZodOptional<z.ZodString>;
    email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    monthlyFee: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    ownerName?: string | undefined;
    phone?: string | undefined;
    email?: string | undefined;
    monthlyFee?: number | undefined;
    notes?: string | undefined;
}, {
    ownerName?: string | undefined;
    phone?: string | undefined;
    email?: string | undefined;
    monthlyFee?: number | undefined;
    notes?: string | undefined;
}>;
//# sourceMappingURL=flat.schema.d.ts.map