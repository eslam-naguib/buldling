import { Request, Response } from 'express';
export declare function login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function logout(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getMe(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function changePassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=auth.controller.d.ts.map