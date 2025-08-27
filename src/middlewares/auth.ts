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
export { authenticate as authMiddleware };