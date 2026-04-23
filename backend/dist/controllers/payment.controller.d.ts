import { Request, Response } from 'express';
export declare function getPayments(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function createPayment(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function bulkCreatePayments(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function deletePayment(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getUnpaid(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=payment.controller.d.ts.map