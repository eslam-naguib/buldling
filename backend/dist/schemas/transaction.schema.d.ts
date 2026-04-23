import { z } from 'zod';
export declare const createTransactionSchema: z.ZodObject<{
    type: z.ZodEnum<["income", "expense"]>;
    category: z.ZodEnum<["maintenance_fee", "elevator", "cleaning", "electricity", "water", "other"]>;
    amount: z.ZodNumber;
    description: z.ZodString;
    flatId: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    month: z.ZodNumber;
    year: z.ZodNumber;
    date: z.ZodUnion<[z.ZodString, z.ZodDate]>;
}, "strip", z.ZodTypeAny, {
    type: "income" | "expense";
    year: number;
    month: number;
    amount: number;
    date: string | Date;
    category: "maintenance_fee" | "elevator" | "cleaning" | "electricity" | "water" | "other";
    description: string;
    flatId?: number | null | undefined;
}, {
    type: "income" | "expense";
    year: number;
    month: number;
    amount: number;
    date: string | Date;
    category: "maintenance_fee" | "elevator" | "cleaning" | "electricity" | "water" | "other";
    description: string;
    flatId?: number | null | undefined;
}>;
export declare const updateTransactionSchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodEnum<["income", "expense"]>>;
    category: z.ZodOptional<z.ZodEnum<["maintenance_fee", "elevator", "cleaning", "electricity", "water", "other"]>>;
    amount: z.ZodOptional<z.ZodNumber>;
    description: z.ZodOptional<z.ZodString>;
    flatId: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
    month: z.ZodOptional<z.ZodNumber>;
    year: z.ZodOptional<z.ZodNumber>;
    date: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
}, "strip", z.ZodTypeAny, {
    type?: "income" | "expense" | undefined;
    year?: number | undefined;
    month?: number | undefined;
    flatId?: number | null | undefined;
    amount?: number | undefined;
    date?: string | Date | undefined;
    category?: "maintenance_fee" | "elevator" | "cleaning" | "electricity" | "water" | "other" | undefined;
    description?: string | undefined;
}, {
    type?: "income" | "expense" | undefined;
    year?: number | undefined;
    month?: number | undefined;
    flatId?: number | null | undefined;
    amount?: number | undefined;
    date?: string | Date | undefined;
    category?: "maintenance_fee" | "elevator" | "cleaning" | "electricity" | "water" | "other" | undefined;
    description?: string | undefined;
}>;
//# sourceMappingURL=transaction.schema.d.ts.map