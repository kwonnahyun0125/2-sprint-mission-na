import { Request, Response, NextFunction } from 'express';
import { verifyAccess } from '../utils/token';

interface TokenPayload {
  id: number;
  email: string;
  nickname: string;
  iat: number;
  exp: number;
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res
      .status(401)
      .json({ message: 'Malformed authorization header (expected: Bearer <token>)' });
  }

  try {
    const payload = verifyAccess(token) as TokenPayload;
    req.user = payload; 
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return next();

  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return next();

  try {
    const payload = verifyAccess(token) as TokenPayload;
    req.user = payload;
  } catch {
    // 토큰이 잘못됐어도 공개 조회는 막지 않음
  }
  next();
}