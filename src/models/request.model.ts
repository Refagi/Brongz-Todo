import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: unknown; // Tambahkan properti `user` hanya di sini
  token?: unknown;
}
