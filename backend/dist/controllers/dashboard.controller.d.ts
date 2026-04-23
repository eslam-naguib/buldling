import { Request, Response } from 'express';
export declare function getDashboardSummary(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getMonthlyReport(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getFlatReport(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getYearlyReport(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getRecentTransactions(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=dashboard.controller.d.ts.map