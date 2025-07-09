import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient, Prisma } from '@prisma/client';
import {
  signAccessToken,
  signRefreshToken,
  persistRefreshToken,
  verifyRefresh,
  revokeRefreshToken,
} from '../utils/token';

const prisma = new PrismaClient();

const router: express.Router = express.Router();

// Request body 타입 정의
interface RegisterRequestBody {
  email: string;
  password: string;
  nickname: string;
  image?: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

// 공통 유효성 검사 미들웨어
function checkCredentials(req: Request, res: Response, next: NextFunction) {
  const { email, password, nickname }: RegisterRequestBody = req.body;
  if (!email || !password || (req.path === '/register' && !nickname)) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  next();
}

// 회원가입
router.post('/register', checkCredentials, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, nickname, password, image }: RegisterRequestBody = req.body;
    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        nickname,
        password: hashed,
        image: image ?? null,
      },
      select: { id: true, email: true, nickname: true },
    });

    return res.status(201).json(user);
  } catch (err) {
    const e = err as Prisma.PrismaClientKnownRequestError;
    if (
      e.code === 'P2002' ||
      (e.meta && typeof e.meta === 'object' && 'target' in e.meta && (e.meta.target as string[]).includes('email'))
    ) {
      return res.status(409).json({ message: 'Email or nickname already exists' });
    }
    next(err);
  }
});

// 로그인
router.post('/login', checkCredentials, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password }: LoginRequestBody = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = signAccessToken({ id: user.id });
    const refreshToken = signRefreshToken({ id: user.id });
    await persistRefreshToken(user.id, refreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.json({ accessToken });
  } catch (err) {
    next(err);
  }
});

// Access Token 재발급 (Promise.any 제거)
router.post('/token', async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return res.status(400).json({ message: 'Missing refresh token' });

  try {
    const payload = verifyRefresh(refreshToken) as { id: number };

    const stored = await prisma.refreshToken.findMany({ where: { userId: payload.id } });

    const results = await Promise.allSettled(
      stored.map((r) => bcrypt.compare(refreshToken, r.tokenHash))
    );

    const stillValid = results.some(
      (result): result is PromiseFulfilledResult<boolean> =>
        result.status === 'fulfilled' && result.value === true
    );

    if (!stillValid) throw new Error('Revoked or not found');

    const newAccess = signAccessToken({ id: payload.id });
    return res.json({ accessToken: newAccess });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
});

// 로그아웃
router.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
