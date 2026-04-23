import { Response } from 'express';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export function sendSuccess<T>(res: Response, data: T, message = 'تمت العملية بنجاح', status = 200) {
  const response: ApiResponse<T> = { success: true, message, data };
  return res.status(status).json(response);
}

export function sendError(res: Response, message: string, status = 400) {
  const response: ApiResponse<null> = { success: false, message, data: null };
  return res.status(status).json(response);
}
