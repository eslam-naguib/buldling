import { Response } from 'express';
export declare function sendSuccess<T>(res: Response, data: T, message?: string, status?: number): Response<any, Record<string, any>>;
export declare function sendError(res: Response, message: string, status?: number): Response<any, Record<string, any>>;
//# sourceMappingURL=response.d.ts.map