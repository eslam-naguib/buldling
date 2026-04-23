import { Request, Response } from 'express';
export declare function getAllFlats(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getFlatById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function createFlat(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateFlat(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function deleteFlat(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getFlatHistory(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function bulkUpdateFee(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=flat.controller.d.ts.map